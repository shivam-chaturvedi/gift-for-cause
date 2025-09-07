import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Users, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

const categories = [
  "All",
  "Education",
  "Healthcare",
  "Women Empowerment",
  "Water & Sanitation",
  "Nutrition",
];

const NGOPartners = () => {
  const [ngos, setNgos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNGOs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("ngo")
        .select(
          `*`
        );
        console.log(data);
      if (error) console.error(error);
      else setNgos(data);
      setLoading(false);
    };
    fetchNGOs();
  }, []);

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || ngo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <p className="text-center py-12">Loading NGOs...</p>;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-secondary-light/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Our NGO Partners
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Meet our verified partner organizations working tirelessly to
              create positive change in communities across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row gap-6 items-center"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search NGOs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* NGO Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-muted-foreground">
              Showing {filteredNGOs.length} verified partner
              {filteredNGOs.length !== 1 ? "s" : ""}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== "All" && ` in "${selectedCategory}"`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredNGOs.map((ngo, index) => (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong border border-border/50"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ngo.image || "/api/placeholder/300/200"}
                    alt={ngo.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {ngo.verified && (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="secondary">{ngo.category}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {ngo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {ngo.description}
                  </p>

                  {/* Location, Rating, Impact */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{ngo.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span>{ngo.rating || "N/A"}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Impact: {ngo.impact || "N/A"}</div>
                    <div>Total Donors: {ngo.total_donors || 0}</div>
                    <div>Total Funds Raised: ₹{ngo.total_funds || 0}</div>
                    <div>Active Wishlists: {ngo.activeWishlists || 0}</div>
                    <div>Established Year: {ngo.established_year || "N/A"}</div>
                    <div>Email: {ngo.email}</div>
                    {ngo.phone && <div>Phone: {ngo.phone}</div>}
                    {ngo.website && (
                      <div>
                        Website:{" "}
                        <a
                          href={ngo.website}
                          target="_blank"
                          className="text-primary underline"
                        >
                          {ngo.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="default" className="flex-1" asChild>
                      <Link to={`/ngo/${ngo.id}`}>View Profile</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/browse?ngo=${ngo.name}`}>
                        <Users className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredNGOs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <p className="text-lg text-muted-foreground">
                No NGO partners found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NGOPartners;
