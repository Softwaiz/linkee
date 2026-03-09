import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/link"
import {
    ArrowRight,
    Github,
    Globe,
    Linkedin,
    Youtube,
    Code2,
    Star,
    Layers,
    CheckCircle2,
} from "lucide-react"

const linkTypes = [
    { icon: Linkedin, label: "LinkedIn profile", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Github, label: "GitHub account", color: "text-foreground", bg: "bg-foreground/10" },
    { icon: Youtube, label: "YouTube channel", color: "text-red-500", bg: "bg-red-500/10" },
    { icon: Globe, label: "Personal website", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Code2, label: "Open-source projects", color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: Star, label: "Case studies & work", color: "text-amber-500", bg: "bg-amber-500/10" },
]

const benefits = [
    {
        icon: Layers,
        title: "One link, everything about you",
        description:
            "Instead of sharing five different links in your email signature or bio, send a single Linkits URL that holds them all.",
    },
    {
        icon: Github,
        title: "Mix platforms freely",
        description:
            "Link your GitHub, Dribbble, YouTube, Substack, Notion — anything with a URL is fair game.",
    },
    {
        icon: Star,
        title: "Showcase what you're proud of",
        description:
            "Add sections for personal projects, open-source contributions, writing, or videos. No code, no design skills required.",
    },
]

export default function ForPortfoliosPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="px-6 py-20 md:py-28 text-center border-b border-border">
                    <div className="mx-auto max-w-[720px]">
                        <span className="inline-block mb-4 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            For Portfolios
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                            Your whole identity,{" "}
                            <span className="text-foreground/60">one link.</span>
                        </h1>
                        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-prose mx-auto text-pretty">
                            Developers, designers, and creators use Linkits to build a curated
                            portfolio kit — grouping their LinkedIn, GitHub, projects, videos, and
                            contributions into one shareable collection.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button size="lg" asChild>
                                <Link href="/signup">
                                    Build your portfolio kit
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/discover">See examples</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Link types grid */}
                <section className="px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-[1080px]">
                        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl mb-2">
                            Everything you share, in one kit
                        </h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                            Your portfolio kit can hold any link — across any platform. Add what
                            represents you best.
                        </p>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {linkTypes.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
                                >
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                                        <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="px-6 py-16 md:py-20 bg-muted/30 border-t border-border">
                    <div className="mx-auto max-w-[1080px]">
                        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl mb-12">
                            Why creators use Linkits for their portfolio
                        </h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {benefits.map((b) => (
                                <div key={b.title} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                                        <b.icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">{b.title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="px-6 py-16 md:py-20 border-t border-border">
                    <div className="mx-auto max-w-[720px] text-center">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl mb-10">
                            Up and running in 3 steps
                        </h2>
                        <ol className="space-y-6 text-left">
                            {[
                                { step: "1", title: "Create a collection", desc: "Give it a name like 'My Portfolio 2025' and a short description." },
                                { step: "2", title: "Add your links", desc: "Drop in your LinkedIn, GitHub, YouTube, projects, and anything else that tells your story." },
                                { step: "3", title: "Share one URL", desc: "Make it public and share the single link anywhere — email, Twitter/X bio, résumé, Slack." },
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
                            Ready to build your portfolio kit?
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            It takes less than two minutes to create your first collection and share it
                            with the world.
                        </p>
                        <Button size="lg" className="mt-8" asChild>
                            <Link href="/signup">
                                Get started — it's free
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
