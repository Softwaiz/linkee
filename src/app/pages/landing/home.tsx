import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturesBento } from "@/components/features-bento";
import { Monetization } from "@/components/monetization";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
    return (
        <main className="min-h-dvh">
            <Header />
            <Hero />
            <FeaturesBento />
            <Monetization />
            <CTA />
            <Footer />
        </main>
    );
}
