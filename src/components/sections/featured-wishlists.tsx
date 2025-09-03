import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InfiniteCarousel } from "@/components/ui/infinite-carousel"
import { WishlistCard } from "@/components/ui/wishlist-card"

// Import generated images
import educationSupplies from "@/assets/education-supplies.jpg"
import cleanWater from "@/assets/clean-water.jpg"
import womenEmpowerment from "@/assets/women-empowerment.jpg"
import medicalEquipment from "@/assets/medical-equipment.jpg"
import solarLamps from "@/assets/solar-lamps.jpg"

// Mock data - in real app this would come from API
const featuredWishlists = [
  {
    id: "1",
    title: "School Supplies for Rural Children",
    description: "Help provide essential learning materials for underprivileged children in rural areas. Every donation creates opportunities for education.",
    ngoName: "Education First Foundation",
    location: "Rajasthan, India",
    occasion: "Back to School",
    targetAmount: 50000,
    raisedAmount: 32000,
    image: educationSupplies,
    urgent: true,
  },
  {
    id: "2", 
    title: "Clean Water Initiative",
    description: "Support the installation of water purification systems in villages lacking access to clean drinking water.",
    ngoName: "Water for All",
    location: "Odisha, India",
    occasion: "World Water Day",
    targetAmount: 75000,
    raisedAmount: 45000,
    image: cleanWater,
  },
  {
    id: "3",
    title: "Women's Skill Development",
    description: "Empower women through vocational training programs that provide sustainable livelihood opportunities.",
    ngoName: "Women Empowerment Trust",
    location: "Karnataka, India", 
    occasion: "Women's Day",
    targetAmount: 40000,
    raisedAmount: 28000,
    image: womenEmpowerment,
  },
  {
    id: "4",
    title: "Medical Equipment for Rural Clinic",
    description: "Help equip a rural health center with essential medical devices to serve remote communities better.",
    ngoName: "Health Access Initiative",
    location: "Bihar, India",
    occasion: "Health Awareness",
    targetAmount: 100000,
    raisedAmount: 60000,
    image: medicalEquipment,
  },
  {
    id: "5",
    title: "Solar Lamps for Students",
    description: "Provide solar-powered study lamps for students in areas with limited electricity access.",
    ngoName: "Bright Future NGO",
    location: "Jharkhand, India",
    occasion: "Diwali Special",
    targetAmount: 25000,
    raisedAmount: 18000,
    image: solarLamps,
  }
]

export function FeaturedWishlistsSection() {
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
          <InfiniteCarousel
            autoplay={true}
            delay={4000}
            className="mb-8"
          >
            {featuredWishlists.map((wishlist) => (
              <WishlistCard
                key={wishlist.id}
                {...wishlist}
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
          <Button
            variant="outline"
            size="lg"
            asChild
            className="group"
          >
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
  )
}