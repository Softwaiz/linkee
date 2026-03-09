import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/link"
import {
    ArrowRight,
    Github,
    BookMarked,
    Puzzle,
    Telescope,
    Heart,
    CheckCircle2,
    Users,
    Layers,
} from "lucide-react"

const useCases = [
    {
        icon: Puzzle,
        title: "Showcase your ecosystem",
        description:
            "List the plugins, integrations, and libraries that make your project shine — let users discover what's possible.",
    },
    {
        icon: BookMarked,
        title: "Curate tutorials & docs",
        description:
            "Group the best community-written guides, screencasts, and blog posts in one place. Save newcomers hours of searching.",
    },
    {
        icon: Telescope,
        title: "Projects to revisit later",
        description:
            "Bookmark cool open-source repos you found but haven't explored yet — and share that reading list with your community.",
    },
    {
        icon: Heart,
        title: "Highlight contributors",
        description:
            "Create a collection of people and projects contributing to your space. A great way to give credit and attract collaborators.",
    },
    {
        icon: Users,
        title: "Community resource hub",
        description:
            "Link your Discord, GitHub Discussions, forum, and social channels in one place — so contributors know where to go.",
    },
    {
        icon: Github,
        title: "Related projects & forks",
        description:
            "Curate notable forks, sibling projects, or inspired work. Help your ecosystem grow by connecting the dots.",
    },
]

const examples = [
    "Top 10 community plugins for our framework",
    "Tutorials for getting started with v3",
    "Open-source tools I keep bookmarked",
    "Contributors who are building amazing things",
]

export default function ForOpenSourcePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <title>Linkits for Open Source - Help people discover your ecosystem</title>
            <meta name="description" content="Group plugins, tutorials, integrations, and community resources into shareable kits so anyone can explore what your project offers." />
            <meta name="keywords" content="open source project links, GitHub ecosystem directory, open source resources hub, developer community links, OSS portfolio, Linkits for open source" />
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="px-6 py-20 md:py-28 text-center border-b border-border">
                    <div className="mx-auto max-w-[720px]">
                        <span className="inline-block mb-4 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            For Open-Source Projects
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                            Help people discover{" "}
                            <span className="text-foreground/60">your ecosystem.</span>
                        </h1>
                        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-prose mx-auto text-pretty">
                            Maintainers and contributors use Linkits to group plugins, tutorials,
                            integrations, and community resources into shareable kits — so anyone
                            can find and explore what your project has to offer.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button size="lg" asChild>
                                <Link href="/signup">
                                    Start your open-source kit
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/discover">Browse examples</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Use cases grid */}
                <section className="px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-[1080px]">
                        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl mb-2">
                            What open-source projects build with Linkits
                        </h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                            From maintainers documenting an ecosystem to contributors sharing discoveries.
                        </p>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {useCases.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm hover:border-foreground/20 transition-colors"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                                        <item.icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Example kit names */}
                <section className="px-6 py-16 md:py-20 bg-muted/30 border-t border-border">
                    <div className="mx-auto max-w-[720px]">
                        <div className="flex items-center gap-3 mb-8">
                            <Layers className="h-6 w-6 text-foreground/50" />
                            <h2 className="text-xl font-semibold text-foreground">Kit ideas to get you started</h2>
                        </div>
                        <ul className="space-y-3">
                            {examples.map((ex) => (
                                <li key={ex} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                                    <Github className="h-4 w-4 shrink-0 text-foreground/60" aria-hidden="true" />
                                    {ex}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* How it works */}
                <section className="px-6 py-16 md:py-20 border-t border-border">
                    <div className="mx-auto max-w-[720px] text-center">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl mb-10">
                            From scattered links to a living resource hub
                        </h2>
                        <ol className="space-y-6 text-left">
                            {[
                                { step: "1", title: "Name your kit", desc: "e.g. 'Essential tools for [your framework]' or 'Plugins directory'." },
                                { step: "2", title: "Add links from anywhere", desc: "GitHub repos, blog posts, YouTube tutorials, Discord servers, npm packages — any URL." },
                                { step: "3", title: "Link it from your README", desc: "Drop the shareable kit URL in your GitHub README and let users explore your ecosystem." },
                            ].map(({ step, title, desc }) => (
                                <li key={step} className="flex gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-foreground font-bold text-sm">
                                        {step}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{title}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-20 md:py-28 bg-foreground/5 border-t border-border">
                    <div className="mx-auto max-w-[580px] text-center">
                        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-foreground/40" />
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Make your project easier to discover
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Create your first open-source kit in minutes. Free forever for public collections.
                        </p>
                        <Button size="lg" className="mt-8" asChild>
                            <Link href="/signup">
                                Build your ecosystem kit
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
