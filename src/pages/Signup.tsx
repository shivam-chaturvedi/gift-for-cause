import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Loader2, Building, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ImageUploader from "@/components/ui/image-uploader";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "donor" as "donor" | "ngo",
    // NGO-specific fields
    description: "",
    long_description: "",
    location: "",
    category: "",
    established_year: "",
    website: "",
    image: "",
  });

  const { signup, user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/"); // redirect if already logged in
  }, [user, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (role: "donor" | "ngo") => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.role === "ngo"
          ? {
              description: formData.description,
              long_description: formData.long_description,
              location: formData.location,
              category: formData.category,
              established_year: formData.established_year,
              website: formData.website,
              image: formData.image,
            }
          : {}
      );
      toast({
        title: "Signup successful!",
        description: "Welcome! You are now registered.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg border border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent shadow-md">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign up to start making impact
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="flex space-x-4">
              <motion.button
                type="button"
                onClick={() => handleRoleChange("donor")}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  formData.role === "donor"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-sm">Donor</p>
                    <p className="text-xs text-muted-foreground">
                      Give meaningfully
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => handleRoleChange("ngo")}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  formData.role === "ngo"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-sm">NGO</p>
                    <p className="text-xs text-muted-foreground">
                      Create impact
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>

              {formData.role === "ngo" && (
                <>
                  <div>
                    <Label htmlFor="description">Short Description</Label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Brief description of NGO"
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="long_description">Long Description</Label>
                    <Textarea
                      id="long_description"
                      placeholder="Detailed information about NGO"
                      value={formData.long_description}
                      onChange={(e) =>
                        handleChange("long_description", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="City, State, Country"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      type="text"
                      placeholder="NGO Category"
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="established_year">Established Year</Label>
                    <Input
                      id="established_year"
                      type="number"
                      placeholder="e.g., 2005"
                      value={formData.established_year}
                      onChange={(e) =>
                        handleChange("established_year", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.org"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">NGO Logo / Image</Label>
                    <ImageUploader
                      initialImage={formData.image}
                      onUploadComplete={(url) => handleChange("image", url)}
                    />
                  </div>
                </>
              )}

              <Button
                variant="hero"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="text-center mt-2">
                <Button variant="link" asChild>
                  <Link to="/login">Already have an account? Login</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
