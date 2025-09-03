import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, Users, Heart, Share2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const WishlistDetails = () => {
  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)

  // Mock data - in real app this would fetch based on ID
  const wishlist = {
    id: id,
    title: "School Supplies for Rural Children",
    description: "Help provide essential learning materials for underprivileged children in rural areas. Every donation creates opportunities for education and brighter futures.",
    longDescription: `This initiative aims to provide comprehensive educational support to children in remote villages of Rajasthan. The wishlist includes basic school supplies like notebooks, pencils, erasers, and textbooks that are essential for learning but often unavailable in these areas.

Beyond immediate supplies, this program also includes educational materials that encourage creative learning and skill development. Every contribution directly impacts a child's ability to learn and grow.`,
    ngoName: "Education First Foundation",
    ngoDescription: "A verified NGO working for 15+ years in rural education across India.",
    location: "Rajasthan, India",
    occasion: "Back to School",
    targetAmount: 50000,
    raisedAmount: 32000,
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400", 
      "/api/placeholder/600/400"
    ],
    urgent: true,
    items: [
      { name: "Notebooks (Pack of 10)", price: 250, quantity: 100 },
      { name: "Pencil Set", price: 150, quantity: 200 },
      { name: "School Bag", price: 800, quantity: 50 },
      { name: "Textbooks Set", price: 1200, quantity: 40 },
    ],
    updates: [
      {
        date: "2024-01-15",
        title: "Distribution Event Completed",
        description: "Successfully distributed supplies to 150 children in 3 villages."
      },
      {
        date: "2024-01-10", 
        title: "Milestone Reached",
        description: "60% funding achieved! Thank you to all our supporters."
      }
    ]
  }

  const progress = (wishlist.raisedAmount / wishlist.targetAmount) * 100
  const remaining = wishlist.targetAmount - wishlist.raisedAmount

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/browse">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Calendar className="w-3 h-3 mr-1" />
                  {wishlist.occasion}
                </Badge>
                {wishlist.urgent && (
                  <Badge variant="destructive">Urgent</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {wishlist.title}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{wishlist.ngoName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{wishlist.location}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="col-span-2">
                <img
                  src={wishlist.images[0]}
                  alt={wishlist.title}
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
              <div className="space-y-4">
                {wishlist.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${wishlist.title} ${index + 2}`}
                    className="w-full h-[152px] object-cover rounded-xl"
                  />
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">About This Initiative</h2>
              <div className="prose prose-gray max-w-none">
                {wishlist.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Items List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">What Your Donation Provides</h2>
              <div className="grid gap-4">
                {wishlist.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity needed: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">Recent Updates</h2>
              <div className="space-y-4">
                {wishlist.updates.map((update, index) => (
                  <div key={index} className="flex space-x-4 p-4 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground">{update.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{update.date}</p>
                      <p className="text-muted-foreground">{update.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 space-y-6 sticky top-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ₹{wishlist.raisedAmount.toLocaleString()} raised
                    </span>
                    <span className="font-medium text-foreground">
                      ₹{remaining.toLocaleString()} needed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {progress.toFixed(0)}% funded
                  </div>
                </div>

                <Separator />

                <Button variant="donate" size="lg" className="w-full">
                  Donate Now
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  100% secure • Tax benefits available
                </div>
              </div>
            </motion.div>

            {/* NGO Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-foreground">About the NGO</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{wishlist.ngoName}</span>
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {wishlist.ngoDescription}
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to={`/ngo/${wishlist.ngoName.toLowerCase().replace(/\s+/g, '-')}`}>
                    View NGO Profile
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WishlistDetails