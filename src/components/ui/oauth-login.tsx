import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function OAuthLogin({ redirectTo = "/" }) {
  const [loadingProvider, setLoadingProvider] = useState("");
  
  // After redirect, fetch the session & user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message);
        return;
      }
      if (session?.user) {
        const user = session.user;
        // Upsert user into 'users' table
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .upsert(
            [
              {
                id: user.id,
                name: user.user_metadata?.full_name || user.email,
                email: user.email,
                role: "donor",
              },
            ],
          );

        if (profileError) {
          console.error("Error saving user profile:", profileError.message);
        } else {
          console.log("User profile saved:", profileData);
        }
      }
    };

    fetchUser();
  }, []);

  const handleOAuthLogin = async (provider) => {
    setLoadingProvider(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) console.error("OAuth login error:", error.message);
    setLoadingProvider("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => handleOAuthLogin("google")}
        disabled={loadingProvider === "google"}
      >
        {loadingProvider === "google" ? "Loading..." : "Login with Google"}
      </Button>
    </div>
  );
}
