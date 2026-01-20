import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-border rounded-full bg-card/50 backdrop-blur-sm">
                    <span className="text-sm text-muted-foreground">Optimized for the Edge. Zero Latency. Zero Magic.</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance mb-6">
                    <span className="text-foreground">Your Taste is the</span>
                    <br />
                    <span className="text-accent">Ultimate Filter.</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty">
                    Transform the &ldquo;beautiful mess&rdquo; of the internet into high-fidelity knowledge assets.
                    Curation with soul, speed, and zero gravity.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="text-base px-8 py-6 gap-2 group">
                        Start Curating Today
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="lg" className="text-base px-8 py-6 bg-transparent">
                        See How It Works
                    </Button>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                    It&apos;s Free — No credit card required
                </p>
            </div>
        </section>
    );
}
