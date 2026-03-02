import { Footer } from "@/components/footer"
import { FeaturedKits } from "@/components/landing/featured-kits"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { WhoIsThisFor } from "@/components/landing/who-is-this-for"
import { JsonLd } from "@/components/landing/json-ld"
import { Navbar } from "@/components/landing/navbar"
import { RequestInfo } from "rwsdk/worker"
import { SetupInitialWebring } from "@/components/landing/setup-initial-webring"

export default function Home(props: RequestInfo) {
  if (props.ctx.user) {
    props.ctx.redirect("/home");
    return <></>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedKits />
        <HowItWorks />
        <WhoIsThisFor />
      </main>
      <Footer />
    </div>
  )
}