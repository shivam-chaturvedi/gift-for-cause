import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Heart, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface WishlistCardProps {
  id: string
  title: string
  description: string
  ngoName: string
  location: string
  occasion: string
  targetAmount: number
  raisedAmount: number
  image: string
  urgent?: boolean
}

export function WishlistCard({
  id,
  title,
  description,
  ngoName,
  location,
  occasion,
  targetAmount,
  raisedAmount,
  image,
  urgent = false,
}: WishlistCardProps) {
  const progress = (raisedAmount / targetAmount) * 100
  const remaining = targetAmount - raisedAmount

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong border border-border/50"
    >
      {urgent && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 right-4 z-10"
        >
          <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
            Urgent
          </Badge>
        </motion.div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Heart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart className="w-4 h-4 text-muted-foreground hover:text-primary" />
        </motion.button>

        {/* Occasion Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            <Calendar className="w-3 h-3 mr-1" />
            {occasion}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        {/* NGO Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{ngoName}</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ₹{raisedAmount.toLocaleString()} raised
            </span>
            <span className="font-medium text-foreground">
              ₹{remaining.toLocaleString()} needed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {progress.toFixed(0)}% funded
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="hero"
            className="flex-1"
            asChild
          >
            <Link to={`/donate/${id}`}>
              Donate Now
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link to={`/wishlist/${id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}