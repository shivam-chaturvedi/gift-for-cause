import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Users,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface NGO {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  email: string;
  role: string;
  created_at: string;
}

interface SuccessStory {
  id: string;
  title: string;
  story_text: string;
  media_url: string;
  impact_metrics: string;
  created_at: string;
  ngo_id: NGO; // joined NGO object comes here
}

export function SuccessStories() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from("success_stories")
          .select("*, ngo_id(*)")
          .order("created_at", { ascending: false });

        if (error) throw error;
        console.log("Fetched success stories:", data);
        setStories(data || []);
      } catch (error) {
        console.error("Error fetching success stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (stories.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % stories.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [stories.length]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  const goToSlide = (index: number) => setCurrentIndex(index);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-teal-50 dark:from-orange-950/20 dark:to-teal-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real impact from real donations
            </p>
          </div>
          <div className="flex justify-center">
            <div className="h-96 w-full max-w-4xl bg-gray-200 animate-pulse rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-teal-50 dark:from-orange-950/20 dark:to-teal-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Real impact from real donations
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="relative h-[500px] overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Card className="h-full border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardContent className="h-full p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                      {/* Media Section */}
                      <div className="relative overflow-hidden rounded-l-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-teal-500/20" />
                        {stories[currentIndex].media_url.match(
                          /\.(mp4|webm|ogg)$/i
                        ) ? (
                          <video
                            src={stories[currentIndex].media_url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={stories[currentIndex].media_url}
                            alt={stories[currentIndex].title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute bottom-4 left-4">
                          <Badge
                            variant="secondary"
                            className="bg-white/90 text-gray-900"
                          >
                            Featured Story
                          </Badge>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8 flex flex-col justify-center">
                        <div className="mb-6">
                          <Badge variant="outline" className="mb-3">
                            {stories[currentIndex].ngo_id.name}
                          </Badge>
                          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {stories[currentIndex].title}
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                            {stories[currentIndex].story_text}
                          </CardDescription>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Impact Metrics
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stories[currentIndex].impact_metrics}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src={
                                stories[currentIndex].ngo_id.logo ||
                                "/placeholder.png"
                              }
                              alt={stories[currentIndex].ngo_id.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {stories[currentIndex].ngo_id.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                stories[currentIndex].created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button asChild>
                            <Link
                              to={`/ngo/${
                                stories[currentIndex].ngo_id.id || ""
                              }`}
                            >
                              Learn More
                            </Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to="/success-stories">View All Stories</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              1,000+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Families Impacted
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              50+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">NGOs Partnered</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              $500K+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Donations</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
