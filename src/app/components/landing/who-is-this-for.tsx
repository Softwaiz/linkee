import { BookOpen, Briefcase, Building2, Rocket, Star, Trophy, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/link"

const audiences = [
    {
        icon: BookOpen,
        title: "Bloggers & Writers",
        description: "Curate your best articles, references, and sources in one organized place.",
    },
    {
        icon: Briefcase,
        title: "Portfolio Creators",
        description: "Showcase a portfolio of your past projects, case studies, and achievements.",
    },
    {
        icon: Rocket,
        title: "Open Source Projects",
        description: "Track your framework's top plugins, tutorials, or integrations (e.g., RedwoodSDK's top 10 links).",
    },
    {
        icon: Building2,
        title: "Enterprises",
        description: "Display an official directory of company projects, resources, or public assets.",
    },
    {
        icon: Trophy,
        title: "Industry Top Lists",
        description: "Curate and track the top 10 entrepreneurs, founders, or leaders across your region.",
    },
    {
        icon: Star,
        title: "Community Movers",
        description: "Highlight the top 50 people making an impact, like women moving the line in tech.",
    },
]

export function WhoIsThisFor() {
    return (
        <section
            id="who-is-this-for"
            className="px-6 py-16 md:py-24 bg-muted/30 border-t border-border"
            aria-labelledby="who-is-this-for-heading"
        >
            <div className="mx-auto max-w-[1080px]">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2
                        id="who-is-this-for-heading"
                        className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4"
                    >
                        Who is Linkits for?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Whether you are an individual creator, an open source project, or a large enterprise, Linkits is built to help you organize and share what matters most.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
                    {audiences.map((audience) => (
                        <div key={audience.title} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-start text-left hover:border-foreground/20 transition-colors">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/5 text-foreground mb-5">
                                <audience.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {audience.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                                {audience.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center bg-foreground/5 rounded-2xl p-8 md:p-12 border border-border">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                        Ready to start curating?
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of users who are organizing their digital life with Linkits. It takes less than a minute to create your first collection.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/signup">
                            Create your account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
