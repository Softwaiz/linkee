import { Footer } from "@/components/footer"
import { FeaturedKits } from "@/components/landing/featured-kits"
import { HeroSection } from "@/components/landing/hero-section"
import { JsonLd } from "@/components/landing/json-ld"
import { Navbar } from "@/components/landing/navbar"
import { RequestInfo } from "rwsdk/worker"

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
      </main>
      <Footer />
    </div>
  )
}