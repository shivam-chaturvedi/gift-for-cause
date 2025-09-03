import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does Gift for a Cause work?",
    answer: "Simply browse verified NGO wishlists, select items that resonate with you, and make secure donations. You'll receive updates on how your gift creates real impact."
  },
  {
    question: "Are all NGOs verified?",
    answer: "Yes! All our partner NGOs go through a rigorous verification process to ensure transparency and legitimacy."
  },
  {
    question: "Can I get tax benefits for my donations?",
    answer: "Yes, all donations made through our platform are eligible for tax deductions under Section 80G of the Income Tax Act."
  },
  {
    question: "How do I track the impact of my donation?",
    answer: "You'll receive regular updates via email and can view detailed impact reports in your donor dashboard."
  }
]

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}

export default FAQ