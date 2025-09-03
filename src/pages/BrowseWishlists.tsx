import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WishlistCard } from "@/components/ui/wishlist-card"

// Mock data - in real app this would come from API
const allWishlists = [
  {
    id: "1",
    title: "School Supplies for Rural Children",
    description: "Help provide essential learning materials for underprivileged children in rural areas. Every donation creates opportunities for education.",
    ngoName: "Education First Foundation",
    location: "Rajasthan, India",
    occasion: "Back to School",
    targetAmount: 50000,
    raisedAmount: 32000,
    image: "/api/placeholder/400/300",
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
    image: "/api/placeholder/400/300",
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
    image: "/api/placeholder/400/300",
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
    image: "/api/placeholder/400/300",
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
    image: "/api/placeholder/400/300",
  },
  {
    id: "6",
    title: "Nutritious Meals Program",
    description: "Support daily nutritious meal programs for malnourished children in urban slums.",
    ngoName: "Feed the Future",
    location: "Mumbai, Maharashtra",
    occasion: "Child Nutrition Week",
    targetAmount: 35000,
    raisedAmount: 22000,
    image: "/api/placeholder/400/300",
  }
]

const BrowseWishlists = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOccasion, setSelectedOccasion] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  const filteredWishlists = allWishlists.filter(wishlist => {
    const matchesSearch = wishlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wishlist.ngoName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOccasion = selectedOccasion === "all" || wishlist.occasion === selectedOccasion
    return matchesSearch && matchesOccasion
  })

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
              Discover meaningful ways to celebrate while creating real impact. 
              Find the perfect wishlist that aligns with your values.
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
                placeholder="Search wishlists, NGOs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Occasions</SelectItem>
                  <SelectItem value="Back to School">Back to School</SelectItem>
                  <SelectItem value="World Water Day">World Water Day</SelectItem>
                  <SelectItem value="Women's Day">Women's Day</SelectItem>
                  <SelectItem value="Health Awareness">Health Awareness</SelectItem>
                  <SelectItem value="Diwali Special">Diwali Special</SelectItem>
                  <SelectItem value="Child Nutrition Week">Child Nutrition Week</SelectItem>
                </SelectContent>
              </Select>

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-muted-foreground">
              Showing {filteredWishlists.length} wishlist{filteredWishlists.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedOccasion !== "all" && ` in "${selectedOccasion}"`}
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
                    setSearchTerm("")
                    setSelectedOccasion("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BrowseWishlists