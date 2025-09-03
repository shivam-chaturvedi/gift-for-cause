import { motion } from "framer-motion"
import { ArrowRight, Gift, Search, Heart, Share, Play, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const steps = [
  {
    icon: Gift,
    title: "Choose an Occasion",
    description: "Celebrate birthdays, anniversaries, holidays, or any special moment by choosing to give meaningfully.",
    color: "from-accent to-primary",
  },
  {
    icon: Search,
    title: "Browse Wishlists",
    description: "Explore verified NGO wishlists filled with items that make real differences in communities.",
    color: "from-primary to-secondary",
  },
  {
    icon: Heart,
    title: "Select & Donate",
    description: "Pick items that resonate with you and make secure donations that go directly to verified NGOs.",
    color: "from-secondary to-accent",
  },
  {
    icon: Share,
    title: "Track Impact",
    description: "Receive updates on how your gift created change and share your impact story with loved ones.",
    color: "from-accent to-primary",
  },
]

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-accent-light/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                How It Works
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transform any celebration into an opportunity to create lasting impact. 
              Our platform makes charitable giving personal, transparent, and joyful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-6 group"
              >
                {/* Step Number */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} p-5 shadow-medium group-hover:shadow-strong transition-all duration-300`}
                  >
                    <step.icon className="w-full h-full text-white" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 z-10">
                    <ArrowRight className="w-6 h-6 text-primary/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8 mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              See It In Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how Sarah transformed her birthday celebration into meaningful impact
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden shadow-strong border-border/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <p className="text-muted-foreground">Sarah's 25th Birthday</p>
                      </div>
                      <p className="text-lg font-semibold">
                        "Instead of asking for gifts, I want to make a difference"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <p className="text-sm text-muted-foreground">Browsed Education NGOs</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <p className="text-sm text-muted-foreground">Selected school supplies wishlist</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <p className="text-sm text-muted-foreground">Donated ₹5,000 for 25 children</p>
                      </div>
                    </div>

                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-primary font-semibold mb-2">Impact Created:</p>
                      <p className="text-sm text-muted-foreground">
                        25 children received complete school supply kits, improving their learning experience
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 text-center border border-border/50"
                    >
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Watch Demo</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        See the complete donor journey in 2 minutes
                      </p>
                      <Button variant="outline" size="sm">
                        Play Video
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to help you get started
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I know my donation reaches the right people?</AccordionTrigger>
                <AccordionContent>
                  All our NGO partners are verified and registered. You'll receive regular updates with photos and reports showing exactly how your donation was used and the impact it created.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I donate for someone else's special occasion?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! You can make donations in honor of friends and family. We'll send them a beautiful certificate and impact report showing the difference made in their name.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a minimum donation amount?</AccordionTrigger>
                <AccordionContent>
                  No minimum amount required. Every contribution matters. Items range from ₹50 notebooks to ₹10,000 medical equipment, so there's something for every budget.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How quickly will my donation make an impact?</AccordionTrigger>
                <AccordionContent>
                  Most items are delivered within 3-5 business days. You'll receive tracking updates and impact photos once the NGO receives and distributes your donation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" asChild>
              <Link to="/faq">
                View All FAQs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of people who have transformed their celebrations 
              into opportunities for positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/browse">
                  Browse Wishlists
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/ngo-partners">
                  Partner with Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks