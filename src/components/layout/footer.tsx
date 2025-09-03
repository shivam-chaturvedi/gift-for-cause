import { Link } from "react-router-dom"
import { Heart, Facebook, Twitter, Instagram, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = {
  main: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Browse Wishlists", href: "/browse" },
    { name: "NGO Partners", href: "/ngo-partners" },
    { name: "Success Stories", href: "/success-stories" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
  social: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Email", href: "mailto:hello@giftforacause.org", icon: Mail },
  ],
}

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Gift for a Cause
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Making charitable giving personal, celebratory, and transparent. 
              Transform every occasion into an opportunity to make a difference.
            </p>
            <div className="flex space-x-2">
              {footerLinks.social.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="rounded-lg"
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Indicators */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Trust & Safety</h3>
            <div className="space-y-3">
              <div className="trust-badge">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                100% Secure Donations
              </div>
              <div className="trust-badge">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Verified NGO Partners
              </div>
              <div className="trust-badge">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Full Transparency
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Gift for a Cause. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Made with ❤️ for a better world
          </p>
        </div>
      </div>
    </footer>
  )
}