import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Star, CheckCircle, Users, Calendar, Globe, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WishlistCard } from "@/components/ui/wishlist-card"

const NGOProfile = () => {
  const { slug } = useParams()

  // Mock data - in real app this would fetch based on slug
  const ngo = {
    id: "education-first-foundation",
    name: "Education First Foundation",
    description: "Dedicated to providing quality education to underprivileged children in rural areas through innovative programs and sustainable solutions.",
    longDescription: `Education First Foundation has been working tirelessly for over 15 years to bridge the education gap in rural India. Our mission is to ensure that every child, regardless of their background, has access to quality education.

We believe that education is the most powerful tool for breaking the cycle of poverty. Through our various programs, we provide not just books and supplies, but also trained teachers, digital learning tools, and infrastructure support to schools in remote areas.

Our holistic approach includes teacher training, community engagement, and long-term sustainability planning to ensure lasting impact in the communities we serve.`,
    location: "Rajasthan, India",
    category: "Education",
    verified: true,
    rating: 4.8,
    establishedYear: 2008,
    website: "https://educationfirst.org",
    email: "contact@educationfirst.org",
    image: "/api/placeholder/600/300",
    stats: {
      beneficiaries: "15,000+",
      projects: "150+", 
      volunteers: "200+",
      impact: "50+ villages"
    },
    activeWishlists: [
      {
        id: "1",
        title: "School Supplies for Rural Children",
        description: "Help provide essential learning materials for underprivileged children in rural areas.",
        ngoName: "Education First Foundation",
        location: "Rajasthan, India",
        occasion: "Back to School",
        targetAmount: 50000,
        raisedAmount: 32000,
        image: "/api/placeholder/400/300",
        urgent: true,
      },
      {
        id: "7",
        title: "Digital Learning Lab Setup",
        description: "Establish computer labs in rural schools to bridge the digital divide.",
        ngoName: "Education First Foundation", 
        location: "Rajasthan, India",
        occasion: "Digital India",
        targetAmount: 80000,
        raisedAmount: 45000,
        image: "/api/placeholder/400/300",
      }
    ],
    recentUpdates: [
      {
        date: "2024-01-20",
        title: "New School Opened in Jaisalmer",
        description: "Successfully opened our 50th partner school, now serving 500 more children."
      },
      {
        date: "2024-01-15",
        title: "Teacher Training Program Completed",
        description: "Trained 25 teachers in modern teaching methodologies and digital tools."
      },
      {
        date: "2024-01-10",
        title: "Annual Impact Report Released",
        description: "Published our comprehensive impact report showing 95% literacy improvement in partner schools."
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/ngo-partners">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Partners
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 mb-12"
        >
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <img
              src={ngo.image}
              alt={ngo.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center justify-center space-x-4 mb-4">
                {ngo.verified && (
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified NGO
                  </Badge>
                )}
                <Badge variant="secondary">
                  {ngo.category}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{ngo.name}</h1>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{ngo.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-accent fill-current" />
                  <span>{ngo.rating} rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Est. {ngo.establishedYear}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">About Us</h2>
              <div className="prose prose-gray max-w-none">
                {ngo.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Impact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">Our Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(ngo.stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="text-center p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="text-2xl font-bold text-primary">{value}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Active Wishlists */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Active Wishlists</h2>
                <Button variant="outline" asChild>
                  <Link to={`/browse?ngo=${ngo.name}`}>
                    View All
                  </Link>
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {ngo.activeWishlists.map((wishlist) => (
                  <WishlistCard key={wishlist.id} {...wishlist} />
                ))}
              </div>
            </motion.div>

            {/* Recent Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">Recent Updates</h2>
              <div className="space-y-4">
                {ngo.recentUpdates.map((update, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-foreground">{update.title}</h3>
                      <span className="text-sm text-muted-foreground">{update.date}</span>
                    </div>
                    <p className="text-muted-foreground">{update.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 space-y-4 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={ngo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {ngo.website}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${ngo.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {ngo.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{ngo.location}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button variant="hero" className="w-full" asChild>
                  <Link to={`/browse?ngo=${ngo.name}`}>
                    <Users className="w-4 h-4 mr-2" />
                    Support This NGO
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Share Profile
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NGOProfile