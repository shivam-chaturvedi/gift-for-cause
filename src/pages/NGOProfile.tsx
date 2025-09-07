import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Star, CheckCircle, Users, Calendar, Globe, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WishlistCard } from "@/components/ui/wishlist-card"
import { supabase } from "@/lib/supabase"

interface NGO {
  id: string
  name: string
  description?: string
  long_description?: string
  location?: string
  category?: string
  verified?: boolean
  rating?: number
  established_year?: number
  website?: string
  email?: string
  image?: string
  stats?: Record<string, string>
}

const NGOProfile = () => {
  const { id } = useParams<{ id: string }>()
  const [ngo, setNgo] = useState<NGO | null>(null)
  const [wishlists, setWishlists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNGO = async () => {
      try {
        if (!id) return

        // Fetch NGO by id
        const { data: ngoData, error: ngoError } = await supabase
          .from("ngo")
          .select("*")
          .eq("id", id)
          .single()

        if (ngoError) throw ngoError

        setNgo(ngoData)

        // Fetch wishlists linked to this NGO
        const { data: wishlistData, error: wishlistError } = await supabase
          .from("wishlists")
          .select("*")
          .eq("ngo_id", id)

        if (wishlistError) throw wishlistError
        setWishlists(wishlistData || [])
      } catch (err) {
        console.error("Error fetching NGO profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNGO()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading NGO profile...</p>
      </div>
    )
  }

  if (!ngo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">NGO not found.</p>
      </div>
    )
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
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <img
              src={ngo.image || "/api/placeholder/600/300"}
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
                {ngo.category && (
                  <Badge variant="secondary">{ngo.category}</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{ngo.name}</h1>
              <div className="flex items-center justify-center space-x-6 text-sm">
                {ngo.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{ngo.location}</span>
                  </div>
                )}
                {ngo.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span>{ngo.rating} rating</span>
                  </div>
                )}
                {ngo.established_year && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Est. {ngo.established_year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {ngo.long_description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-foreground">About Us</h2>
                <div className="prose prose-gray max-w-none">
                  {ngo.long_description.split("\n\n").map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Impact Stats */}
            {ngo.stats && (
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
                        {key.replace(/_/g, " ")}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Active Wishlists */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Active Wishlists</h2>
              </div>
              {wishlists.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {wishlists.map((wishlist) => (
                    <WishlistCard key={wishlist.id} {...wishlist} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No active wishlists.</p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 space-y-4 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-3">
                {ngo.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      {ngo.website}
                    </a>
                  </div>
                )}
                {ngo.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${ngo.email}`} className="text-sm text-primary hover:underline">
                      {ngo.email}
                    </a>
                  </div>
                )}
                {ngo.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{ngo.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-3">
                <Button variant="hero" className="w-full" asChild>
                  <Link to={`/browse?ngo=${ngo.id}`}>
                    <Users className="w-4 h-4 mr-2" />
                    Support This NGO
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

export default NGOProfile
