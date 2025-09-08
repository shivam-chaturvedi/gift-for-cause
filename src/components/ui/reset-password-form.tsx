import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          // This event triggers when the user clicks the reset link in their email
          const newPassword = prompt("Enter your new password:");

          if (!newPassword) {
            toast({
              title: "Password not set",
              description: "You must provide a new password to continue",
              variant: "destructive",
            });
            return;
          }

          const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            toast({
              title: "Error updating password",
              description: error.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Password updated successfully",
              description: "You can now log in with your new password",
            });
            navigate("/login");
          }
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSendResetEmail = async () => {
    if (!email) {
      toast({
        title: "Enter your email",
        description: "Please provide your account email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (error) throw error;

      toast({
        title: "Reset email sent",
        description: "Check your email for the reset link",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8 p-8"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendResetEmail();
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button variant="hero" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Email"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
