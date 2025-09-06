"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WishlistCard } from "@/components/ui/wishlist-card";
import { supabase } from "@/lib/supabase";

// Types for wishlist rows
interface Wishlist {
  id: string;
  title: string;
  description: string;
  ngo_name: string;
  location: string;
  target_amount: number;
  raised_amount: number;
  image: string;
  urgent?: boolean;
}

const BrowseWishlists = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [loading, setLoading] = useState(true);

  // Fetch wishlists from Supabase
  useEffect(() => {
    const fetchWishlists = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("wishlists")
        .select(
          "id, title, description, ngo_name, location, target_amount, raised_amount, image, urgent"
        );

      if (error) {
        console.error("Error fetching wishlists:", error);
      } else {
        setWishlists(data || []);
      }
      setLoading(false);
    };

    fetchWishlists();
  }, []);

  const filteredWishlists = wishlists.filter((wishlist) => {
    const matchesSearch =
      wishlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.ngo_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.location.toLowerCase().includes(searchTerm.toLowerCase());

    // 🚨 NOTE: No "occasion" column in schema now, so removed filter
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Browse Wishlists
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover meaningful ways to support NGOs while creating real
              impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search wishlists, NGOs, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sorting */}
            <div className="flex gap-4 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="urgent">Most Urgent</SelectItem>
                  <SelectItem value="progress">Most Progress</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading wishlists...
            </p>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <p className="text-muted-foreground">
                  Showing {filteredWishlists.length} wishlist
                  {filteredWishlists.length !== 1 ? "s" : ""}
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredWishlists.map((wishlist, index) => (
                  <motion.div
                    key={wishlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <WishlistCard {...wishlist} />
                  </motion.div>
                ))}
              </motion.div>

              {filteredWishlists.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground">
                      No wishlists found matching your criteria.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSortBy("relevance");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseWishlists;
