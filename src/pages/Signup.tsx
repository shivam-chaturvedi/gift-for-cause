import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { supabase } from "@/lib/supabase";
import FileDragDropUploader from "@/components/ui/ngo-doc-uploader";

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
    document_url: "",
    // Tax certificates
    has_tax_certificates: false,
    // Consent
    consent: false,
  });

  const { signup, user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/"); // redirect if already logged in
  }, [user, navigate]);

  const handleChange = (field: string, value: string | boolean) => {
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
    
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (formData.role !== "ngo") {
        // Normal user signup
        await signup(
          formData.email,
          formData.password,
          formData.name,
          formData.role
        );
      } else {
        // NGO signup
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (authError) throw authError;

        const userId = authData.user?.id;
        if (!userId) throw new Error("User ID not returned from auth signup");

        // Insert into users table first
        const { error: userError } = await supabase
          .from("users")
          .insert([
            {
              id: userId,
              name: formData.name,
              email: formData.email,
              role: formData.role,
            },
          ]);

        if (userError) throw userError;

        // Then insert into ngo table
        const { data: ngoData, error: ngoError } = await supabase
          .from("ngo")
          .insert([
            {
              id: userId, // link to auth.users
              name: formData.name,
              email: formData.email,
              role: formData.role,
              description: formData.description,
              long_description: formData.long_description,
              location: formData.location,
              category: formData.category,
              established_year: formData.established_year,
              website: formData.website,
              image: formData.image,
              document_url: formData.document_url,
              has_tax_certificates: formData.has_tax_certificates,
            },
          ]);

        if (ngoError) throw ngoError;

        toast({
          title: "Signup successful!",
          description: "Welcome! You are now registered.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                disabled={isSubmitting || isLoading}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  formData.role === "donor"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 bg-card",
                  (isSubmitting || isLoading) && "opacity-50 cursor-not-allowed"
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
                disabled={isSubmitting || isLoading}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  formData.role === "ngo"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 bg-card",
                  (isSubmitting || isLoading) && "opacity-50 cursor-not-allowed"
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
                <Label htmlFor="name">
                  Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isSubmitting || isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isSubmitting || isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={isSubmitting || isLoading}
                  required
                />
              </div>

              {formData.role === "ngo" && (
                <>
                  <div>
                    <Label htmlFor="description">
                      Short Description <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      required
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
                    <Label htmlFor="location">
                      Location <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      required
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
                    <Label htmlFor="established_year">
                      Established Year <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      required
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
                    <Label htmlFor="document_url">
                      NGO Documents (PDF / Image){" "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Please upload certified documents as per your country’s
                      legal requirements (e.g., Registration Certificate, FCRA,
                      PAN, or equivalent).
                    </p>
                    <FileDragDropUploader
                      bucket="ngo_documents"
                      onUploadComplete={(url) => {
                        handleChange("document_url", url);
                        toast({
                          title: "Document uploaded",
                          description:
                            "Your NGO document has been uploaded successfully.",
                        });
                      }}
                    />
                    {formData.document_url && (
                      <p className="text-xs text-green-600 mt-1">
                        ✅ Document uploaded successfully
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="image">
                      NGO Logo / Image <span className="text-red-600">*</span>
                    </Label>
                    <ImageUploader
                      initialImage={formData.image}
                      onUploadComplete={(url) => {
                        handleChange("image", url);
                        toast({
                          title: "Image uploaded",
                          description: "NGO image uploaded successfully",
                        });
                      }}
                    />
                  </div>
                </>
              )}

              {/* Tax Certificates Section - For NGOs Only */}
              {formData.role === "ngo" && (
                <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      Tax Exemption Certificates (Optional)
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      If you have 80G (India) or 12A certificates, please indicate below. This helps donors understand tax benefits.
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="has_tax_certificates"
                      checked={formData.has_tax_certificates}
                      onCheckedChange={(checked) => 
                        handleChange("has_tax_certificates", checked === true)
                      }
                      className="mt-1"
                    />
                    <Label 
                      htmlFor="has_tax_certificates" 
                      className="text-xs leading-relaxed cursor-pointer"
                    >
                      I have 80G/12A tax exemption certificates (or equivalent in my country)
                    </Label>
                  </div>
                </div>
              )}

              {/* Consent Section - For All Users */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Data Protection & Privacy Consent
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>
                      <strong>Data Collection:</strong> We collect your personal information including name, email, contact details{formData.role === "ngo" ? ", and organization information" : ""} to provide our services and facilitate donations.
                    </p>
                    <p>
                      <strong>Purpose:</strong> Your data is used to create and manage your account, process donations{formData.role === "ngo" ? ", send important updates about your campaigns" : ""}, and comply with legal requirements.
                    </p>
                    <p>
                      <strong>Data Sharing:</strong> We may share your information with payment processors, verification services, and legal authorities as required by law. We do not sell your personal data to third parties.
                    </p>
                    <p>
                      <strong>Your Rights:</strong> You have the right to access, update, or delete your personal information. You can withdraw consent at any time by contacting us.
                    </p>
                    <p>
                      <strong>Data Security:</strong> We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <p>
                      <strong>Retention:</strong> We retain your personal information only as long as necessary to fulfill the purposes outlined in this consent or as required by law.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      This consent is required under GDPR (EU), DPDPA (India), and other applicable data protection laws.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => 
                      handleChange("consent", checked === true)
                    }
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="consent" 
                    className="text-xs leading-relaxed cursor-pointer"
                  >
                    <span className="text-red-600">*</span> I have read and understood the data protection and privacy policy above. I consent to the collection, processing, and use of my personal information as described for the purposes of using this platform and its services.
                  </Label>
                </div>
              </div>

              <Button
                variant="hero"
                className="w-full mt-2"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {formData.role === "ngo" ? "Creating NGO Account..." : "Signing Up..."}
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
