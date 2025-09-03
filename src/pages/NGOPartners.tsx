import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Users, CheckCircle, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock NGO data
const ngos = [
  {
    id: "education-first-foundation",
    name: "Education First Foundation",
    description: "Dedicated to providing quality education to underprivileged children in rural areas.",
    location: "Rajasthan, India",
    category: "Education",
    verified: true,
    rating: 4.8,
    activeWishlists: 5,
    image: "/api/placeholder/300/200",
    impact: "15,000+ children educated"
  },
  {
    id: "water-for-all",
    name: "Water for All",
    description: "Working to provide clean and safe drinking water to communities in need.",
    location: "Odisha, India", 
    category: "Water & Sanitation",
    verified: true,
    rating: 4.9,
    activeWishlists: 3,
    image: "/api/placeholder/300/200",
    impact: "500+ wells installed"
  },
  {
    id: "women-empowerment-trust",
    name: "Women Empowerment Trust",
    description: "Empowering women through skill development and entrepreneurship programs.",
    location: "Karnataka, India",
    category: "Women Empowerment",
    verified: true,
    rating: 4.7,
    activeWishlists: 8,
    image: "/api/placeholder/300/200",
    impact: "2,000+ women trained"
  },
  {
    id: "health-access-initiative",
    name: "Health Access Initiative", 
    description: "Improving healthcare access in remote and underserved communities.",
    location: "Bihar, India",
    category: "Healthcare",
    verified: true,
    rating: 4.6,
    activeWishlists: 4,
    image: "/api/placeholder/300/200",
    impact: "100+ clinics supported"
  },
  {
    id: "bright-future-ngo",
    name: "Bright Future NGO",
    description: "Creating sustainable solutions for education and livelihood in rural communities.",
    location: "Jharkhand, India",
    category: "Education",
    verified: true,
    rating: 4.5,
    activeWishlists: 6,
    image: "/api/placeholder/300/200",
    impact: "10,000+ lives impacted"
  },
  {
    id: "feed-the-future",
    name: "Feed the Future",
    description: "Fighting malnutrition and hunger through sustainable food programs.",
    location: "Mumbai, Maharashtra",
    category: "Nutrition",
    verified: true,
    rating: 4.8,
    activeWishlists: 7,
    image: "/api/placeholder/300/200",
    impact: "50,000+ meals served"
  }
]

const categories = ["All", "Education", "Healthcare", "Women Empowerment", "Water & Sanitation", "Nutrition"]

const NGOPartners = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || ngo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
              Meet our verified partner organizations working tirelessly to create 
              positive change in communities across India.
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
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search NGOs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
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
              Showing {filteredNGOs.length} verified partner{filteredNGOs.length !== 1 ? 's' : ''}
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
                    src={ngo.image}
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
                    <Badge variant="secondary">
                      {ngo.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {ngo.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ngo.description}
                    </p>
                  </div>

                  {/* Location and Rating */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{ngo.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span className="font-medium">{ngo.rating}</span>
                    </div>
                  </div>

                  {/* Impact & Stats */}
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{ngo.impact}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ngo.activeWishlists} active wishlist{ngo.activeWishlists !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="default" className="flex-1" asChild>
                      <Link to={`/ngo/${ngo.id}`}>
                        View Profile
                      </Link>
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
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  No NGO partners found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Partner CTA */}
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
              Want to Partner with Us?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join our network of verified NGOs and reach donors who want to 
              make meaningful contributions to your cause.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Become a Partner
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default NGOPartners