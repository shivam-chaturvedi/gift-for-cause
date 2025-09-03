import { motion } from "framer-motion"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedWishlistsSection } from "@/components/sections/featured-wishlists"
import { TrustedPartnersSection } from "@/components/sections/trusted-partners"
import { VerificationProcessSection } from "@/components/sections/verification-process"
import { SuccessStories } from "@/components/sections/success-stories"

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturedWishlistsSection />
      <TrustedPartnersSection />
      <VerificationProcessSection />
      <SuccessStories />
    </motion.div>
  );
};

export default Index;
