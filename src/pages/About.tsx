import { motion } from "framer-motion"

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About Gift for a Cause
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We believe every celebration should create lasting change. Our platform 
              transforms traditional gift-giving into meaningful charitable impact.
            </p>
          </motion.div>

          <div className="prose prose-lg max-w-none space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make charitable giving personal, celebratory, and transparent by connecting 
                meaningful occasions with verified social causes. We envision a world where 
                every birthday, anniversary, and celebration becomes an opportunity to create 
                positive change.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">How We Started</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2024, Gift for a Cause emerged from a simple question: "What if 
                every celebration could change a life?" Our founders, passionate about both 
                technology and social impact, created this platform to bridge the gap between 
                personal joy and collective responsibility.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Transparency</h3>
                  <p className="text-muted-foreground">Every donation is tracked with complete transparency.</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Celebration</h3>
                  <p className="text-muted-foreground">We make giving joyful and emotionally rewarding.</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Trust</h3>
                  <p className="text-muted-foreground">All our NGO partners are rigorously verified.</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Impact</h3>
                  <p className="text-muted-foreground">Every gift creates measurable, lasting change.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About