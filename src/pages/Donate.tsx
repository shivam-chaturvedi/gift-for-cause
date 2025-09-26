import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft, Check, Shield, Heart, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import ManualDonationForm from "@/components/ui/donation.form";
import { sendDonationConfirmationEmail, sendNGODonationNotificationEmail } from "@/lib/mailer";

type DonationStep = "confirmation" | "details" | "payment" | "success";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  funded_qty: number;
}

interface WishlistData {
  ngo_id: string;
  id: string;
  title: string;
  description: string;
  ngo_name: string;
  ngo_email?: string;
  image: string;
  urgent: boolean;
  target_amount: number;
  raised_amount: number;
  wishlist_items: WishlistItem[];
  ngos: {
    contact_email: string;
  };
}

const Donate = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<DonationStep>("confirmation");
  const [donationData, setDonationData] = useState({
    donorName: "",
    donorEmail: "",
    message: "",
    isAnonymous: false,
    items: [] as { id: string; qty: number; price: number }[],
  });
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [loading, setLoading] = useState(true);

  const [donor, setDonor] = useState<any>(null);
  const [manualDonation, setManualDonation] = useState(false);

  const fetchDonor = async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      setDonor(null);
    } else {
      setDonor(data);
    }
    setLoading(false);
  };

  // Pre-fill donor info if logged in
  useEffect(() => {
    if (user) {
      fetchDonor(user.email || "");

      setDonationData((prev) => ({
        ...prev,
        donorName: user.name || "",
        donorEmail: user.email || "",
      }));
    }
  }, [user]);

  // Fetch wishlist data from Supabase
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("wishlists")
        .select("*, wishlist_items(*)")
        .eq("id", id)
        .single();
      console.log(data);

      if (error) {
        toast({
          title: "Error fetching wishlist",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data) {
        setWishlist(data as WishlistData);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [id]);

  const stepProgress = {
    confirmation: 25,
    details: 50,
    payment: 75,
    success: 100,
  };

  const handleNextStep = () => {
    const steps: DonationStep[] = [
      "confirmation",
      "details",
      "payment",
      "success",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1)
      setCurrentStep(steps[currentIndex + 1]);
  };

  const handlePrevStep = () => {
    const steps: DonationStep[] = [
      "confirmation",
      "details",
      "payment",
      "success",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1]);
  };

  const toggleItemSelection = (item: WishlistItem) => {
    setDonationData((prev) => {
      const existing = prev.items.find((i) => i.id === item.id);
      if (existing) {
        // Remove item if already selected
        return { ...prev, items: prev.items.filter((i) => i.id !== item.id) };
      } else {
        // Add item with qty 1
        return {
          ...prev,
          items: [...prev.items, { id: item.id, qty: 1, price: item.price }],
        };
      }
    });
  };

  const updateItemQty = (itemId: string, qty: number) => {
    setDonationData((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, qty } : i)),
    }));
  };

  const totalAmount = donationData.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const handlePayment = async () => {
    if (totalAmount <= 0) {
      toast({ title: "No items selected", variant: "destructive" });
      return;
    }

    toast({ title: "Donation completed successfully!" });

    // Insert donation record
    const { data: donation, error } = await supabase
      .from("donations")
      .insert([
        {
          user_id: donor?.id || null,
          wishlist_id: wishlist?.id || null,
          amount: totalAmount,
          status: "completed", // default status
          name: donationData.donorName,
          email: donationData.donorEmail,
          // razorpay fields can remain null
          razorpay_order_id: null,
          razorpay_payment_id: null,
          razorpay_signature: null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating donation:", error);
      toast({
        title: "Error recording donation",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Update wishlist raised amount
    await supabase
      .from("wishlists")
      .update({
        raised_amount: wishlist!.raised_amount + totalAmount,
      })
      .eq("id", wishlist!.id);

    // Send emails after successful donation
    try {
      // Send confirmation email to donor
      const donorEmailResult = await sendDonationConfirmationEmail(
        donationData.donorEmail,
        donationData.donorName,
        totalAmount,
        wishlist?.title || "Unknown Wishlist",
        wishlist?.ngo_name || "Unknown NGO"
      );

      if (donorEmailResult.success) {
        console.log("Donation confirmation email sent to donor");
        toast({
          title: "Email Sent",
          description: "A confirmation email has been sent to your email address.",
        });
      } else {
        console.warn("Failed to send donor confirmation email:", donorEmailResult.error);
        toast({
          title: "Email Failed",
          description: "Donation completed but confirmation email could not be sent. Please check your email manually.",
          variant: "destructive",
        });
      }

      // Send notification email to NGO
      if (wishlist?.ngos?.contact_email) {
        const ngoEmailResult = await sendNGODonationNotificationEmail(
          wishlist.ngos.contact_email,
          wishlist.ngo_name || "Unknown NGO",
          donationData.donorName,
          totalAmount,
          wishlist.title || "Unknown Wishlist"
        );

        if (ngoEmailResult.success) {
          console.log("NGO notification email sent successfully");
        } else {
          console.warn("Failed to send NGO notification email:", ngoEmailResult.error);
        }
      }
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      toast({
        title: "Email Service Unavailable",
        description: "Donation completed successfully, but email notifications could not be sent.",
        variant: "destructive",
      });
    }

    // Move to success step
    handleNextStep();
  };

  const renderStepContent = () => {
    if (loading)
      return <p className="text-center text-muted-foreground">Loading...</p>;
    if (!wishlist)
      return <p className="text-center text-red-500">Wishlist not found</p>;

    switch (currentStep) {
      case "confirmation":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Confirm Your Gift
              </h2>
              <p className="text-muted-foreground">
                Select the items you want to donate
              </p>
            </div>

            <div className="space-y-4">
              {wishlist.wishlist_items.map((item) => {
                const selected = donationData.items.find(
                  (i) => i.id === item.id
                );
                return (
                  <Card
                    onClick={() => toggleItemSelection(item)}
                    key={item.id}
                    className={`border-2 cursor-pointer ${
                      selected ? "border-primary" : "border-primary/20"
                    }`}
                  >
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {wishlist.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Price: ₹{item.price}
                        </p>
                        {selected && (
                          <Input
                            type="number"
                            min={1}
                            value={selected.qty}
                            onChange={(e) =>
                              updateItemQty(item.id, Number(e.target.value))
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-20 mt-2"
                          />
                        )}
                      </div>
                      <Badge
                        variant={wishlist.urgent ? "destructive" : "secondary"}
                      >
                        {wishlist.urgent ? "Urgent" : "Standard"}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/browse">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Browse
                </Link>
              </Button>
              <Button
                variant="hero"
                onClick={handleNextStep}
                disabled={donationData.items.length === 0}
                className="w-full sm:w-auto"
              >
                Continue to Details
              </Button>
            </div>
          </motion.div>
        );

      case "details":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Your Details
              </h2>
              <p className="text-muted-foreground">
                Help us personalize your donation experience
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Full Name</Label>
                <Input
                  id="donorName"
                  placeholder="Enter your full name"
                  value={donationData.donorName}
                  onChange={(e) =>
                    setDonationData((prev) => ({
                      ...prev,
                      donorName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorEmail">Email Address</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={donationData.donorEmail}
                  onChange={(e) =>
                    setDonationData((prev) => ({
                      ...prev,
                      donorEmail: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Input
                  id="message"
                  placeholder="Add a message for the NGO"
                  value={donationData.message}
                  onChange={(e) =>
                    setDonationData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button variant="outline" onClick={handlePrevStep} className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleNextStep}
                disabled={
                  !donationData.donorName ||
                  !donationData.donorEmail ||
                  donationData.items.length === 0
                }
                className="w-full sm:w-auto"
              >
                Continue to Payment
              </Button>
            </div>
          </motion.div>
        );

      case "payment":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Complete Your Donation
              </h2>
              <p className="text-muted-foreground">
                You can pay via the bank details or QR code below
              </p>
            </div>

            {/* Payment summary */}
            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Payment Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {donationData.items.map((i) => {
                  const itemData = wishlist.wishlist_items.find(
                    (w) => w.id === i.id
                  );
                  return (
                    <div
                      key={i.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-muted-foreground">
                        {itemData?.name} x{i.qty}
                      </span>
                      <span className="font-semibold">₹{i.qty * i.price}</span>
                    </div>
                  );
                })}
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>

                <ManualDonationForm
                  ngoName={wishlist.ngo_name}
                  ngoId={wishlist?.ngo_id}
                  userId={donor?.id}
                  donorName={donor.name}
                  donorEmail={donor.email}
                  totalAmount={totalAmount}
                />
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button variant="outline" onClick={handlePrevStep} className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="hero"
                onClick={() => {
                  handlePayment();
                }}
                className="w-full sm:w-auto"
              >
                <Shield className="w-4 h-4 mr-2" />
                Confirm Donation
              </Button>
            </div>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Thank You! 🎉
              </h2>
              <p className="text-lg text-muted-foreground">
                Your donation has been successfully processed
              </p>
            </div>

            <Card className="text-left">
              <CardContent className="p-6 space-y-3">
                {donationData.items.map((i) => {
                  const itemData = wishlist.wishlist_items.find(
                    (w) => w.id === i.id
                  );
                  return (
                    <div key={i.id} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {itemData?.name}
                      </span>
                      <span className="font-medium">₹{i.qty * i.price}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NGO</span>
                  <span className="font-medium">{wishlist.ngo_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Donor</span>
                  <span className="font-medium">{donationData.donorName}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-muted-foreground">
                A receipt has been sent to{" "}
                <strong>{donationData.donorEmail}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link to="/browse">
                  <Gift className="w-4 h-4 mr-2" />
                  Donate Again
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/">
                  <Heart className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent-light/20 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {Object.keys(stepProgress).indexOf(currentStep) + 1} of 4
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(stepProgress[currentStep])}% Complete
              </span>
            </div>
            <Progress value={stepProgress[currentStep]} className="h-2" />
          </div>

          {/* Main Content */}
          <Card className="shadow-strong border-border/50 backdrop-blur-sm">
            <CardContent className="p-8">{renderStepContent()}</CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Donate;
