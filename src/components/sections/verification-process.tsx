import { motion } from "framer-motion"
import { Shield, CheckCircle, Eye, Award } from "lucide-react"

const verificationSteps = [
  {
    icon: Shield,
    title: "Legal Verification",
    description: "Registration documents, tax-exempt status, and compliance checks",
    features: ["Government Registration", "Tax Exemption Certificate", "Legal Compliance"]
  },
  {
    icon: CheckCircle,
    title: "Impact Assessment",
    description: "Track record of successful projects and community impact",
    features: ["Project History", "Beneficiary Testimonials", "Impact Metrics"]
  },
  {
    icon: Eye,
    title: "Ongoing Monitoring",
    description: "Regular audits, progress reports, and transparency updates",
    features: ["Monthly Reports", "Financial Audits", "Progress Tracking"]
  }
]

export function VerificationProcessSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-accent-light/10 to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Trust & Transparency</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Verification Process
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every NGO partner undergoes rigorous verification to ensure your donations 
            create real, measurable impact in the communities they serve.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {verificationSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 border border-border/50 backdrop-blur-sm">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-glow"
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-card-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 pt-4">
                    {step.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (index * 0.2) + (featureIndex * 0.1) }}
                        className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-full opacity-20 group-hover:opacity-40 transition-opacity"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">
              100% Verified NGO Partners
            </h3>
            <p className="text-muted-foreground mb-6">
              Every rupee you donate is tracked and reported back to you with complete transparency.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Verified Impact Reports</span>
              </div>
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Financial Transparency</span>
              </div>
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Regular Updates</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}