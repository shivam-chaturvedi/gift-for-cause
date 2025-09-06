import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteCarousel } from "@/components/ui/infinite-carousel";
import { WishlistCard } from "@/components/ui/wishlist-card";
import { supabase } from "@/lib/supabase"; // for dynamic data fetch

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

export function FeaturedWishlistsSection() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlists() {
      const { data, error } = await supabase
        .from("wishlists")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching wishlists:", error.message);
      } else if (data) {
        setWishlists(data as Wishlist[]);
      }
      setLoading(false);
    }

    fetchWishlists();
  }, []);

  if (loading)
    return (
      <p className="text-center py-16 text-muted-foreground">
        Loading featured wishlists...
      </p>
    );

  if (wishlists.length === 0)
    return (
      <p className="text-center py-16 text-muted-foreground">
        No featured wishlists available.
      </p>
    );

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Featured Wishlists
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover meaningful ways to celebrate while creating real impact.
            These wishlists need your support to transform lives.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <InfiniteCarousel autoplay={true} delay={4000} className="mb-8">
            {wishlists.map((wishlist) => (
              <WishlistCard
                key={wishlist.id}
                id={wishlist.id}
                title={wishlist.title}
                description={wishlist.description}
                ngo_name={wishlist.ngo_name}
                location={wishlist.location}
                target_amount={wishlist.target_amount}
                raised_amount={wishlist.raised_amount}
                image={wishlist.image}
                urgent={wishlist.urgent}
              />
            ))}
          </InfiniteCarousel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="outline" size="lg" asChild className="group">
            <Link to="/browse">
              Browse All Wishlists
              <motion.div
                className="ml-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
