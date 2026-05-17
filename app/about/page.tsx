import { HeroSection } from "@/components/about/hero-section"
import { StatsSection } from "@/components/about/stats-section"
import { ServicesSection } from "@/components/about/services-section"
import { FeaturesSection } from "@/components/about/features-section"
import { PricingSection } from "@/components/about/pricing-section"
import { TestimonialsSection } from "@/components/about/testimonials-section"
import { CTASection as AboutCTASection } from "@/components/about/cta-section"
import { CTASection as MainCTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0] w-full overflow-x-hidden relative">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturesSection />
      <AboutCTASection />
      <PricingSection />
      <TestimonialsSection />
      <MainCTASection />
      <Footer />
    </main>
  )
}
