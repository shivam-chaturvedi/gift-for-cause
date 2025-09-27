import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { sendContactFormEmail } from "@/lib/mailer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {toast} = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // Send email using mailer
      const emailResult = await sendContactFormEmail(
        formData.name,
        formData.email,
        formData.subject,
        formData.message
      );

      if (emailResult.success) {
        // Also save to database for record keeping
        const { error: dbError } = await supabase
          .from("contact_messages")
          .insert([formData]);

        if (dbError) {
          console.warn("Failed to save to database:", dbError.message);
        }

        toast({
          title: "Message Sent",
          description: "Thank you for reaching out! We'll get back to you soon.",
        });
        setSuccess("Thank you for reaching out! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setError(emailResult.error || "Failed to send message. Please try again.");
        toast({
          title: "Error",
          description: emailResult.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Get in touch with our team
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Send us a message</h2>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-lg mx-auto"
              >
                <Input
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send Message"}
                </Button>

                {success && <p className="text-green-600 mt-2">{success}</p>}
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </form>{" "}
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Get in touch</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      giftforacause@myyahoo.com
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to all inquiries within 24-48 hours during business days. 
                    For urgent matters, please mention "URGENT" in your subject line.
                  </p>
                </div>
                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Privacy & Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your messages are handled with strict confidentiality. We do not share your 
                    personal information with third parties. Read our{" "}
                    <a href="/privacy" className="text-primary underline hover:no-underline">
                      Privacy Policy
                    </a>{" "}
                    for more details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
