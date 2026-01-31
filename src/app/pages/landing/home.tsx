import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturesBento } from "@/components/features-bento";
import { Monetization } from "@/components/monetization";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { RequestInfo } from "rwsdk/worker";
import DiscoverPage from "../protected/discover";
import { HomeDiscover } from "./home-discover";

export default function Home(props: RequestInfo) {

    /// when the user is already connected, there's no need to see the landing page. 
    if (props.ctx.user) {
        props.ctx.redirect("/home", 302);
    }

    return (
        <main className="min-h-dvh">
            <Header />
            <Hero />
            <HomeDiscover/>
            <FeaturesBento />
            <Monetization />
            <CTA />
            <Footer />
        </main>
    );
}
