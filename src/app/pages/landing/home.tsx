import { Footer } from "@/components/footer"
import { CtaSection } from "@/components/landing/cta-section"
import { FeaturedKits } from "@/components/landing/featured-kits"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { JsonLd } from "@/components/landing/json-ld"
import { Navbar } from "@/components/landing/navbar"
import { TrendingSectionSSR } from "@/components/landing/trending-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedKits />
        <HowItWorks />
        <TrendingSectionSSR />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}