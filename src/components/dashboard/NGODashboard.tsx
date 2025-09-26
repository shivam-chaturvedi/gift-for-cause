import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  DollarSign,
  Gift,
  TrendingUp,
  Users,
  FileText,
  Ban,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { WishlistForm } from "../ui/wishlist-form";
import { SuccessStoryForm } from "../ui/success-story-form";
import NgoBankDetailsForm from "../ui/bank-details-form";
import { WishlistCard } from "../ui/wishlist-card";
import { useToast } from "../ui/use-toast";

interface WishlistWithItems {
  raised_amount: number;
  id: string;
  title: string;
  status: string;
  created_at: string;
  target_amount: number;
  description: string;
  image?: string;
  urgent?: boolean;
  wishlist_items: Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
    funded_qty: number;
  }>;
}

interface DonationWithDetails {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  wishlist_id: {
    id: string;
    title: string;
  };
  user_id: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
}

export function NGODashboard() {
  const [wishlists, setWishlists] = useState<WishlistWithItems[]>([]);
  const [donations, setDonations] = useState<DonationWithDetails[]>([]);
  const [bankDetailsForm, setBankDetailsForm] = useState(false);
  const [newStory, setNewStory] = useState({
    title: "",
    story_text: "",
    impact_metrics: "",
  });
  const [stories, setStories] = useState<any[]>([]);

  const { user: authUser, isLoading: authLoading } = useAuth();
  const [ngo, setNgo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showWishListForm, setShowWishListForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSuccessStoryForm, setShowSuccessStoryForm] = useState(false);
  const [visibleStories, setVisibleStories] = useState(3);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [editingWishlist, setEditingWishlist] = useState<any>(null);
  const { toast } = useToast();

  // Edit wishlist function
  const handleEditWishlist = (wishlistId: string) => {
    const wishlist = wishlists.find(w => w.id === wishlistId);
    if (wishlist) {
      setEditingWishlist(wishlist);
      setShowWishListForm(true);
    }
  };

  // Delete wishlist function
  const handleDeleteWishlist = async (wishlistId: string) => {
    try {
      // First delete all wishlist items
      const { error: itemsError } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("wishlist_id", wishlistId);

      if (itemsError) throw itemsError;

      // Then delete the wishlist
      const { error: wishlistError } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", wishlistId);

      if (wishlistError) throw wishlistError;

      // Update local state
      setWishlists(prev => prev.filter(w => w.id !== wishlistId));

      toast({
        title: "Success",
        description: "Wishlist deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting wishlist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete wishlist.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      if (!ngo) return;
      try {
        const { data, error } = await supabase
          .from("ngo_bank_details")
          .select("*")
          .eq("ngo_id", ngo.id)
          .single();

        if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
        setBankDetails(data || null);
      } catch (error) {
        console.error("Error fetching bank details:", error);
        setBankDetails(null);
      }
    };

    fetchBankDetails();
  }, [ngo]);

  // Fetch success stories
  useEffect(() => {
    const fetchStories = async () => {
      if (!ngo) return;
      try {
        const { data, error } = await supabase
          .from("success_stories")
          .select("*")
          .eq("ngo_id", ngo.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setStories(data || []);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, [ngo, showSuccessStoryForm]);

  // Fetch NGO user data
  const fetchUser = async (email: string) => {
    const { data, error } = await supabase
      .from("ngo")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      setNgo(null);
    } else {
      setNgo(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      if (authUser?.email) {
        fetchUser(authUser.email);
      } else {
        setNgo(null);
        setIsLoading(false);
        navigate("/login");
      }
    }
  }, [authUser, authLoading, navigate]);

  // Fetch wishlists and donations
  useEffect(() => {
    const fetchData = async () => {
      if (!ngo) return;
      try {
        // Wishlists
        const { data: wishlistData, error: wishlistError } = await supabase
          .from("wishlists")
          .select("*, wishlist_items(*)")
          .eq("ngo_id", ngo.id);
        if (wishlistError) throw wishlistError;

        // Donations
        let { data: donationData, error: donationsError } = await supabase
          .from("donations")
          .select("*, wishlist_id(*), user_id(*)")
          .eq("wishlist_id.ngo_id", ngo.id)
          .order("created_at", { ascending: false });
        if (donationsError) throw donationsError;

        donationData = donationData.filter(
          (d) => d.wishlist_id && d.wishlist_id?.ngo_id === ngo.id
        );
        // Remove duplicates
        const uniqueDonations = donationData
          ? Array.from(new Map(donationData.map((d) => [d.id, d])).values())
          : [];
        const uniqueWishlists = wishlistData
          ? Array.from(new Map(wishlistData.map((w) => [w.id, w])).values())
          : [];

        // Only completed donations
        setDonations(uniqueDonations.filter((d) => d.status === "completed"));
        setWishlists(uniqueWishlists);

        console.log("Fetched donations (unique & completed):", uniqueDonations);
      } catch (error) {
        console.error("Error fetching NGO dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [ngo, showWishListForm]);

  // Stats
  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalDonations = donations.length;
  const activeWishlists = wishlists.filter(
    (w) => w.status === "published"
  ).length;
  const pendingWishlists = wishlists.filter((w) => w.status === "draft").length;

  const now = new Date();
  const currentMonth = now.getMonth(); // 0–11
  const currentYear = now.getFullYear();

  const donationsThisMonth = donations.filter((d) => {
    const donationDate = new Date(d.created_at);
    return (
      donationDate.getMonth() === currentMonth &&
      donationDate.getFullYear() === currentYear
    );
  });

  const totalRaisedThisMonth = donationsThisMonth.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );

  const statsCards = [
    {
      title: "Total Raised",
      value: `₹${totalRaised.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Donations Received",
      value: totalDonations.toString(),
      icon: Gift,
      color: "text-blue-600",
    },
    {
      title: "Active Wishlists",
      value: activeWishlists.toString(),
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "This Month",
      value: `₹${Math.round(totalRaisedThisMonth).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showSuccessStoryForm && ngo && (
        <SuccessStoryForm
          ngo={ngo}
          onClose={() => setShowSuccessStoryForm(false)}
          onSuccess={() => setShowSuccessStoryForm(false)}
        />
      )}

      <div className="mb-6">
        <Card className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                NGO Verification Status
              </p>
              <p className="text-xl font-bold">
                {ngo?.verified === true && (
                  <span className="text-green-600 dark:text-green-400">
                    Approved ✅
                  </span>
                )}
                {ngo?.verified === false && (
                  <span className="text-red-600 dark:text-red-400">
                    Rejected ❌
                  </span>
                )}
                {ngo?.verified === null && (
                  <span className="text-yellow-600 dark:text-yellow-400">
                    Pending ⏳
                  </span>
                )}
              </p>
            </div>
            <div>
              {ngo?.verified === true && (
                <Users className="h-10 w-10 text-green-600 dark:text-green-400" />
              )}
              {ngo?.verified === false && (
                <Ban className="h-10 w-10 text-red-600 dark:text-red-400" />
              )}
              {ngo?.verified === null && (
                <Calendar className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {bankDetailsForm && ngo && (
        <NgoBankDetailsForm
          ngoId={ngo.id}
          initialData={bankDetails}
          onClose={() => setBankDetailsForm(false)}
          onSuccess={() => {
            setBankDetailsForm(false);

            setBankDetails(null);
            supabase
              .from("ngo_bank_details")
              .select("*")
              .eq("ngo_id", ngo.id)
              .single()
              .then(({ data }) => setBankDetails(data));
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NGO Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your wishlists, track donations, and share impact stories
          </p>
        </div>

        {showWishListForm && ngo && (
          <WishlistForm 
            ngo={ngo} 
            onClose={() => {
              setShowWishListForm(false);
              setEditingWishlist(null);
            }}
            editingWishlist={editingWishlist}
            onSuccess={() => {
              setEditingWishlist(null);
              // Refresh wishlists
              const fetchData = async () => {
                try {
                  const { data: wishlistData, error: wishlistError } = await supabase
                    .from("wishlists")
                    .select("*, wishlist_items(*)")
                    .eq("ngo_id", ngo.id);
                  if (wishlistError) throw wishlistError;
                  
                  const uniqueWishlists = wishlistData
                    ? Array.from(new Map(wishlistData.map((w) => [w.id, w])).values())
                    : [];
                  setWishlists(uniqueWishlists);
                } catch (error) {
                  console.error("Error refreshing wishlists:", error);
                }
              };
              fetchData();
            }}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Overview</h2>
            <Button
              variant="default"
              onClick={() => {
                setBankDetailsForm(true);
              }}
            >
              {bankDetails ? "Edit Bank Details" : "Submit Bank Details"}
            </Button>
          </div>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wishlists">Wishlists</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wishlist Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Wishlist Progress</CardTitle>
                  <CardDescription>
                    Current status of your wishlists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wishlists.slice(0, 3).map((wishlist) => {
                      const totalItems = wishlist.wishlist_items?.length || 0;
                      const fundedItems =
                        wishlist.wishlist_items?.filter(
                          (item) => item.funded_qty >= item.qty
                        ).length || 0;
                      const progress = (
                        wishlist.target_amount > 0
                          ? (wishlist.raised_amount / wishlist.target_amount) *
                            100
                          : 0
                      ).toPrecision(4);
                      return (
                        <div key={wishlist.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{wishlist.title}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={Number(progress)} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {wishlist.raised_amount} of {wishlist.target_amount}{" "}
                            total money funded
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wishlists */}
          <TabsContent value="wishlists" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Wishlists</h2>
              <Button onClick={() => setShowWishListForm(true)}>
                Create New Wishlist
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlists.map((wishlist) => (
                <WishlistCard
                  key={wishlist.id}
                  id={wishlist.id}
                  title={wishlist.title}
                  description={wishlist.description}
                  ngo_name={ngo?.name || "NGO"}
                  location={ngo?.location || "Location"}
                  target_amount={wishlist.target_amount}
                  raised_amount={wishlist.raised_amount}
                  image={wishlist.image || "/api/placeholder/400/300"}
                  urgent={wishlist.urgent}
                  showDeleteButton={true}
                  onDelete={handleDeleteWishlist}
                  isNGODashboard={true}
                  wishlist_items={wishlist.wishlist_items}
                  onEdit={handleEditWishlist}
                />
              ))}
            </div>
          </TabsContent>

          {/* Donations */}
          <TabsContent value="donations" className="space-y-6">
            <h2 className="text-2xl font-bold">Completed Donations</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Wishlist</TableHead>
                  <TableHead>Amount (₹)</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Payment ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.user_id?.name || "-"}</TableCell>
                    <TableCell>{donation.user_id?.email || "-"}</TableCell>
                    <TableCell>{donation.wishlist_id?.title || "-"}</TableCell>
                    <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
                    <TableCell>{donation.status}</TableCell>
                    <TableCell>{donation.razorpay_order_id}</TableCell>
                    <TableCell>{donation.razorpay_payment_id || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Success Stories */}
          <TabsContent value="stories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Success Stories</h2>
              <Button onClick={() => setShowSuccessStoryForm(true)}>
                Add Story
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.slice(0, visibleStories).map((story) => (
                <Card key={story.id}>
                  <CardHeader>
                    <CardTitle>{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{story.story_text}</p>
                    {story.impact_metrics && (
                      <p className="mt-2 text-sm text-gray-500">
                        Impact: {story.impact_metrics}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {visibleStories < stories.length && (
                <Button
                  variant="outline"
                  onClick={() => setVisibleStories(visibleStories + 3)}
                >
                  Load More
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
