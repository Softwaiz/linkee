import { Layers, Search, Share2 } from "lucide-react"

const features = [
    {
        icon: Layers,
        title: "Build your knowledge base",
        description:
            "Save and organize your links into structured collections.",
    },
    {
        icon: Search,
        title: "Discover what others curated",
        description:
            "Browse curated content created by people like you, around the world.",
    },
    {
        icon: Share2,
        title: "Share your knowledge",
        description:
            "Publish collections and help others access high-quality resources.",
    },
]

export function HowItWorks() {
    return (
        <section
            id="discover"
            className="bg-primary/10 px-6 py-16 md:py-20"
            aria-labelledby="how-it-works-heading"
        >
            <div className="mx-auto max-w-[1080px]">
                <h2
                    id="how-it-works-heading"
                    className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
                >
                    How Linkits helps you
                </h2>

                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                                <feature.icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
