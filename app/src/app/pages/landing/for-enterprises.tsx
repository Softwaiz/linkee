import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/link"
import {
    ArrowRight,
    Globe,
    Github,
    Newspaper,
    Users,
    Briefcase,
    MessageSquare,
    CheckCircle2,
    Building2,
    Layers,
} from "lucide-react"

const linkTypes = [
    { icon: Globe, label: "Company website", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Github, label: "GitHub organisation", color: "text-foreground", bg: "bg-foreground/10" },
    { icon: Briefcase, label: "Products & services", color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: Newspaper, label: "Blog & press articles", color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: Users, label: "Team & careers page", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: MessageSquare, label: "Community & forums", color: "text-rose-500", bg: "bg-rose-500/10" },
]

const benefits = [
    {
        icon: Building2,
        title: "One official directory",
        description:
            "Skip the outdated Linktree. Create a structured, on-brand collection that lists every official resource your brand publishes.",
    },
    {
        icon: Layers,
        title: "Organised by topic",
        description:
            "Separate sections for products, engineering articles, open-source work, job openings, and community links — all under one URL.",
    },
    {
        icon: Users,
        title: "Amplify your community",
        description:
            "Include Discord servers, Slack workspaces, forums, newsletters, and social channels to drive users to your community.",
    },
]

const examples = [
    "Acme Inc. — official resources",
    "Our engineering blog & open-source projects",
    "Community & developer resources",
    "Press kit & media mentions",
]

export default function ForEnterprisesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <title>Linkits for Enterprises - One place for everything your brand shares</title>
            <meta name="description" content="Build a public-facing directory of your company website, GitHub, products, articles, and community links in one shareable collection." />
            <meta name="keywords" content="enterprise link directory, company link in bio, brand resources hub, corporate links collection, official company links, Linkits for business" />
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="px-6 py-20 md:py-28 text-center border-b border-border">
                    <div className="mx-auto max-w-[720px]">
                        <span className="inline-block mb-4 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            For Enterprises
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                            One place for everything{" "}
                            <span className="text-foreground/60">your brand shares.</span>
                        </h1>
                        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-prose mx-auto text-pretty">
                            Companies use Linkits to build a public-facing directory of their website,
                            GitHub profile, products, articles, and community links — all maintained in
                            one shareable collection.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button size="lg" asChild>
                                <Link href="/signup">
                                    Create your enterprise kit
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/discover">Browse examples</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Link types grid */}
                <section className="px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-[1080px]">
                        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl mb-2">
                            Every link your company ever shares
                        </h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                            From your homepage to your engineering blog, everything belongs in one kit.
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
                                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="px-6 py-16 md:py-20 bg-muted/30 border-t border-border">
                    <div className="mx-auto max-w-[1080px]">
                        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl mb-12">
                            Why companies choose Linkits
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

                {/* Example kit names */}
                <section className="px-6 py-16 md:py-20 border-t border-border">
                    <div className="mx-auto max-w-[720px]">
                        <div className="flex items-center gap-3 mb-8">
                            <Layers className="h-6 w-6 text-foreground/50" />
                            <h2 className="text-xl font-semibold text-foreground">Kit ideas for your company</h2>
                        </div>
                        <ul className="space-y-3">
                            {examples.map((ex) => (
                                <li key={ex} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                                    <Building2 className="h-4 w-4 shrink-0 text-foreground/60" aria-hidden="true" />
                                    {ex}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* How it works */}
                <section className="px-6 py-16 md:py-20 bg-muted/30 border-t border-border">
                    <div className="mx-auto max-w-[720px] text-center">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl mb-10">
                            Set up in minutes
                        </h2>
                        <ol className="space-y-6 text-left">
                            {[
                                { step: "1", title: "Create a company collection", desc: "Name it after your brand and add a description of what you do." },
                                { step: "2", title: "Add every official link", desc: "Website, GitHub, docs, blog, job board, community channels — all in one place." },
                                { step: "3", title: "Share & keep it updated", desc: "Embed the kit URL in your README, bio, or email footer. Update it as you grow." },
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
                            Give your brand a home on the web
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Create a free company kit today. Public collections are always free — no credit card required.
                        </p>
                        <Button size="lg" className="mt-8" asChild>
                            <Link href="/signup">
                                Create your company kit
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
