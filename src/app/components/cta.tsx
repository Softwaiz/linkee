import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
    return (
        <section className="px-6 py-32">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
                    Start Curating Today
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                    Join thousands of curators building their digital gardens.
                    Your taste is your superpower—let&apos;s put it to work.
                </p>

                <Button size="lg" className="text-lg px-10 py-7 gap-2 group">
                    Get Started — It&apos;s Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="mt-8 text-sm text-muted-foreground">
                    Optimized for the Edge. Zero Latency. Zero Magic.
                </p>
            </div>
        </section>
    );
}
