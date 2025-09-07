import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { DonorDashboard } from "@/components/dashboard/DonorDashboard";
import { NGODashboard } from "@/components/dashboard/NGODashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (data === null || error) {
      const { data, error } = await supabase
        .from("ngo")
        .select("*")
        .eq("email", email)
        .single();

      setUser(data);
      if (error) {
        console.error("Error fetching NGO data:", error);
        navigate("/login");
      }
    } else {
      setUser(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      if (authUser?.email) {
        fetchUser(authUser.email);
      } else {
        setUser(null);
        setIsLoading(false);
        navigate("/login");
      }
    }
  }, [authUser, authLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Render dashboards based on role
  switch (user.role) {
    case "donor":
      return <DonorDashboard />;
    case "ngo":
      return <NGODashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <DonorDashboard />;
  }
}
