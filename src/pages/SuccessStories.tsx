"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface Story {
  id: string;
  created_at: string;
  title: string;
  story_text: string;
  impact_metrics?: string;
  media_url?: string; // can be image or video
  ngo_id: string;
}

const SuccessStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [visibleStories, setVisibleStories] = useState(3);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch stories from Supabase
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Fetched success stories:", data);
      if (error) {
        console.error("Error fetching stories:", error);
      } else {
        setStories(data || []);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-accent-light/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Success Stories
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Real stories of how celebrations became catalysts for change.
              Discover how ordinary moments created extraordinary impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading stories...
            </p>
          ) : stories.length > 0 ? (
            <div className="grid gap-12">
              {stories.slice(0, visibleStories).map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  {/* Media (Image or Video) */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className={`relative overflow-hidden rounded-2xl shadow-medium ${
                      index % 2 === 1 ? "lg:col-start-2" : ""
                    }`}
                  >
                    {story.media_url ? (
                      story.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={story.media_url}
                          controls
                          className="w-full h-80 object-cover rounded-2xl"
                        />
                      ) : (
                        <img
                          src={story.media_url}
                          alt={story.title}
                          className="w-full h-80 object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-80 bg-muted flex items-center justify-center text-muted-foreground">
                        No Media
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {new Date(story.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div
                    className={`space-y-6 ${
                      index % 2 === 1 ? "lg:col-start-1" : ""
                    }`}
                  >
                    <div className="space-y-3">
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        {story.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {story.story_text}
                      </p>
                    </div>

                    {/* Impact Info */}
                    {story.impact_metrics && (
                      <div className="p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-5 w-5 text-primary" />
                          <p className="font-medium text-primary">
                            {story.impact_metrics}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Load More */}
              {visibleStories < stories.length && (
                <div className="flex justify-center pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleStories((prev) => prev + 3)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No stories found.
            </p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Create Your Own Success Story
            </h2>
            <p className="text-lg text-muted-foreground">
              Every celebration is an opportunity to create lasting change.
              Start your journey today and become part of our impact community.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="hero-gradient text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-medium hover:shadow-strong transition-all duration-300"
              >
                Start Making Impact
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;
