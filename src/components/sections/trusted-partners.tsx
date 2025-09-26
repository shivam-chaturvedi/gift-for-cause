import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Users, Globe, Award, MapPin, Info, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

type NGO = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  long_description?: string;
  location?: string;
  verified?: boolean;
  image?: string;
  website?: string;
  email?: string;
  phone?: string;
  has_tax_certificates?: boolean;
  stats?: {
    lives_impacted?: string;
    states_covered?: string;
    trust_score?: string;
  };
};

export function TrustedPartnersSection() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNGOs = async () => {
      const { data, error } = await supabase.from("ngo").select("*");
      if (error) {
        console.error("Error fetching NGOs:", error);
        setLoading(false);
        return;
      }

      setNgos(data.filter((n) => n?.verified) as NGO[]);
      setLoading(false);
    };

    fetchNGOs();
  }, []);

  if (loading) return <p>Loading NGOs...</p>;

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Trusted Partners</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Partnering with{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              India's Leading NGOs
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We collaborate with verified, impact-driven organizations across
            India.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ngos.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Link to={`/ngo/${ngo.id}`}>
                <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 border border-border/50 backdrop-blur-sm h-[200px] flex flex-col">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Logo/Image */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex-shrink-0 text-4xl bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-3 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors"
                    >
                      {ngo.image ? (
                        <img
                          src={ngo.image}
                          alt={ngo.name}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      ) : (
                        "🏢"
                      )}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 space-y-2 flex flex-col">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {ngo.name}
                        </h3>
                        <div className="flex flex-col gap-1">
                          {ngo.verified && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                            >
                              <Award className="w-3 h-3" />
                              <span>Verified</span>
                            </motion.div>
                          )}
                          {ngo.has_tax_certificates && (
                            <Badge className="bg-blue-600 text-white text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              80G/12A
                            </Badge>
                          )}
                        </div>
                      </div>

                      {ngo.category && (
                        <p className="text-sm text-muted-foreground">
                          <Info className="w-3 h-3 inline mr-1" />
                          {ngo.category}
                        </p>
                      )}

                      {ngo.location && (
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {ngo.location}
                        </p>
                      )}

                      <div className="flex flex-col text-sm space-y-1 mt-auto">
                        {ngo.stats?.lives_impacted && (
                          <span>Impact: {ngo.stats.lives_impacted}</span>
                        )}
                        {ngo.stats?.states_covered && (
                          <span>
                            States Covered: {ngo.stats.states_covered}
                          </span>
                        )}
                        {ngo.stats?.trust_score && (
                          <span>Trust Score: {ngo.stats.trust_score}</span>
                        )}
                        {ngo.website && (
                          <span>
                            Website:{" "}
                            <a
                              href={ngo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              {ngo.website}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
