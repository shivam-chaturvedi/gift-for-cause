import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Heart,
  Share2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const WishlistDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [wishlistData, setWishlistData] = useState<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("wishlists")
          .select("*, wishlist_items(*)")
          .eq("id", id)
          .single();

        if (error) throw error;
        console.log("Fetched wishlist:", data);
        setWishlistData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchWishlist();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  const wishlist = {
    id: id,
    title: wishlistData?.title,
    description: wishlistData?.description,
    ngoId: wishlistData?.ngo_id,
    ngoName: wishlistData?.ngo_name,
    ngoDescription:
      "A verified NGO working for 15+ years in rural education across India.",
    location: wishlistData?.location,
    targetAmount: wishlistData?.target_amount,
    raisedAmount: wishlistData?.raised_amount,
    images: [wishlistData?.image],
    urgent: wishlistData?.urgent,
    items: wishlistData?.wishlist_items || [],
  };

  const progress = (wishlist.raisedAmount / wishlist.targetAmount) * 100;
  const remaining = wishlist.targetAmount - wishlist.raisedAmount;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/browse">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-2">
                {wishlist.urgent && <Badge variant="destructive">Urgent</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {wishlist.title}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{wishlist.ngoName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{wishlist.location}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? "fill-primary text-primary" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link Copied",
                        description: "Wishlist link copied to clipboard.",
                      });
                    }}
                    variant="ghost"
                    size="icon"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="col-span-2">
                <img
                  src={
                    wishlistData.image || "https://via.placeholder.com/600x400"
                  }
                  alt={wishlist.title}
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
              <div className="space-y-4">
                {wishlist.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${wishlist.title} ${index + 2}`}
                    className="w-full h-[152px] object-cover rounded-xl"
                  />
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">
                About This Initiative
              </h2>
              <div className="prose prose-gray max-w-none">
                {wishlist.description.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-muted-foreground leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Items List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">
                What Your Donation Provides
              </h2>
              <div className="grid gap-4">
                {wishlist.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border border-border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity needed: {item.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            ></motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 space-y-6 sticky top-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ₹{wishlist.raisedAmount.toLocaleString()} raised
                    </span>
                    <span className="font-medium text-foreground">
                      ₹{Math.max(remaining, 0).toLocaleString()} needed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {progress.toFixed(0)}% funded
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={() => navigate(`/donate/${id}`)}
                  variant="donate"
                  size="lg"
                  className="w-full"
                >
                  Donate Now
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  100% secure • Tax benefits available
                </div>
              </div>
            </motion.div>

            {/* NGO Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-foreground">
                About the NGO
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {wishlist.ngoName}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {wishlist.ngoDescription}
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link
                    to={`/ngo/${wishlist.ngoId
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    View NGO Profile
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistDetails;
