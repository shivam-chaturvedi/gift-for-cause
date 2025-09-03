import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Heart, Gift, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "@/components/ui/animated-counter"

const stats = [
  { value: 10000, label: "Lives Impacted", icon: Heart, suffix: "+" },
  { value: 500, label: "Gifts Delivered", icon: Gift, suffix: "+" },
  { value: 150, label: "NGO Partners", icon: Users, suffix: "+" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent-light/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-accent-light/50 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium"
              >
                <Heart className="w-4 h-4 text-primary" />
                <span>Transform Every Occasion Into Impact</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Gift for a Cause
                </span>
                <br />
                <span className="text-foreground">
                  Make Every Gift Matter
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Turn birthdays, anniversaries, and celebrations into opportunities 
                to create real impact. Browse NGO wishlists and give gifts that 
                truly change lives.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="hero"
                size="hero"
                asChild
                className="group"
              >
                <Link to="/browse">
                  Start Giving Today
                  <motion.div
                    className="ml-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="hero"
                asChild
              >
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center space-y-2"
                >
                  <div className="flex justify-center">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    <AnimatedCounter 
                      end={stat.value} 
                      duration={2}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-strong"
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-accent to-primary shadow-glow"
                    >
                      <Gift className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      🎉 Birthday Gift
                    </h3>
                    <p className="text-muted-foreground">
                      Instead of flowers, send school supplies to children in need
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="celebration" className="animate-bounce-gentle">
                      Make Impact ✨
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Heart className="w-8 h-8 text-accent" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Users className="w-6 h-6 text-secondary" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}