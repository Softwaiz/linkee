import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/link"
import {
    ArrowRight,
    BookOpen,
    Rss,
    Shuffle,
    Star,
    Users,
    CheckCircle2,
    ThumbsUp,
    Layers,
} from "lucide-react"

const useCases = [
    {
        icon: Star,
        title: "\"Top picks\" collections",
        description:
            "Write once, curate forever. Share your '5 best reads this month' as a Linkits collection instead of a cluttered thread.",
    },
    {
        icon: Shuffle,
        title: "Mix your content with others'",
        description:
            "Combine your own articles with great pieces you found. As long as it's on the same subject, it belongs in the same kit.",
    },
    {
        icon: Rss,
        title: "Write anywhere, link everywhere",
        description:
            "Substack, Medium, your own blog, Dev.to — it doesn't matter where you publish. Linkits aggregates it all.",
    },
    {
        icon: Users,
        title: "Build a reading community",
        description:
            "Share your curated lists with your audience and let them discover quality content through your lens.",
    },
    {
        icon: BookOpen,
        title: "Thematic resource hubs",
        description:
            "Create a dedicated collection per topic: 'Best resources on TypeScript', 'UX writing must-reads'…",
    },
    {
        icon: ThumbsUp,
        title: "Validate your expertise",
        description:
            "A well-curated list signals taste and knowledge. Use it as a soft portfolio of your editorial judgment.",
    },
]

const examples = [
    "My 5 favourite newsletters this year",
    "Top 10 React performance articles",
    "Essential reads for indie hackers",
    "Writing resources I keep coming back to",
]

export default function ForBloggersPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="px-6 py-20 md:py-28 text-center border-b border-border">
                    <div className="mx-auto max-w-[720px]">
                        <span className="inline-block mb-4 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            For Bloggers
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                            Curate your top picks.{" "}
                            <span className="text-foreground/60">Share what you love.</span>
                        </h1>
                        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-prose mx-auto text-pretty">
                            As a blogger you already have opinions. Linkits lets you turn them into
                            curated resource collections — your own articles, mixed with the best of
                            what others have written, grouped by topic.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button size="lg" asChild>
                                <Link href="/signup">
                                    Create your first top-picks kit
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
                            What bloggers build with Linkits
                        </h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                            Your editorial voice, extended beyond your own blog.
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
                                    <Star className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
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
                            From scattered tabs to a shareable kit
                        </h2>
                        <ol className="space-y-6 text-left">
                            {[
                                { step: "1", title: "Pick a topic", desc: "Create a collection named after a theme your readers care about." },
                                { step: "2", title: "Add your picks", desc: "Drop in links from any source — your blog, others' articles, newsletters, videos." },
                                { step: "3", title: "Publish & promote", desc: "Share the kit link in your next newsletter, on social, or embed it in a post." },
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
                            Turn your reading list into something shareable
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Free to start. No complicated setup. Your first curated kit is just a few clicks away.
                        </p>
                        <Button size="lg" className="mt-8" asChild>
                            <Link href="/signup">
                                Start curating
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
