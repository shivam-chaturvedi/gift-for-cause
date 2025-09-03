import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Heart, Users, Globe, Award } from "lucide-react"

const partners = [
  {
    name: "Akshaya Patra Foundation",
    logo: "🍽️",
    category: "Education & Nutrition",
    impact: "1.8M+ children fed daily",
    verified: true
  },
  {
    name: "Teach for India",
    logo: "📚",
    category: "Education",
    impact: "75K+ students impacted",
    verified: true
  },
  {
    name: "Pratham Foundation",
    logo: "🎓",
    category: "Education",
    impact: "6.5M+ children reached",
    verified: true
  },
  {
    name: "CRY - Child Rights",
    logo: "👶",
    category: "Child Welfare",
    impact: "3M+ children supported",
    verified: true
  },
  {
    name: "Goonj",
    logo: "👕",
    category: "Rural Development",
    impact: "2M+ families helped",
    verified: true
  },
  {
    name: "Smile Foundation",
    logo: "😊",
    category: "Education & Health",
    impact: "1.5M+ lives touched",
    verified: true
  }
]

export function TrustedPartnersSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Trusted Partners</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Partnering with 
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              {" "}India's Leading NGOs
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We work with verified, impact-driven organizations that have proven track records 
            of creating meaningful change in communities across India.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Link to={`/ngo/${partner.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    {/* Logo */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="text-4xl bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-3 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors"
                    >
                      {partner.logo}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {partner.name}
                        </h3>
                        {partner.verified && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                          >
                            <Award className="w-3 h-3" />
                            <span>Verified</span>
                          </motion.div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {partner.category}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="w-4 h-4 text-secondary" />
                        <span className="font-medium text-secondary">
                          {partner.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">150+</div>
              <div className="text-sm text-muted-foreground">Verified NGOs</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">10M+</div>
              <div className="text-sm text-muted-foreground">Lives Impacted</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">28</div>
              <div className="text-sm text-muted-foreground">States Covered</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Award className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">99.8%</div>
              <div className="text-sm text-muted-foreground">Trust Score</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}