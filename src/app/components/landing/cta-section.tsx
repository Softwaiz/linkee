import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "../link"

export function CtaSection() {
    return (
        <section
            id="create"
            className="bg-secondary/5 px-6 py-20 md:py-28 relative"
            aria-labelledby="cta-heading"
        >
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
                    backgroundSize: "32px 32px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
                    maskImage:
                        "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto flex max-w-[580px] flex-col items-center text-center">
                <h2
                    id="cta-heading"
                    className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-4xl"
                >
                    Start your first collection
                </h2>
                <p className="mt-4 text-sm text-muted-foreground md:text-base">
                    No complicated dashboards. No long onboarding. Start building a
                    collection in seconds.
                </p>
                <Button
                    size="lg"
                    className="mt-8 bg-foreground text-background hover:bg-foreground/90"
                    asChild
                >
                    <Link href="/collections/new">
                        Create your first collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </section>
    )
}
