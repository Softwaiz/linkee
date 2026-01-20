"use client";
import { Sparkles, Zap, LayoutGrid, Lock, DollarSign, Users } from "lucide-react";

const features = [
    {
        icon: Sparkles,
        title: "The Digital Garden for Your Interests",
        description:
            "The era of mindless consumption is over. Today, curation is about cultivating taste and uncovering unexpected connections. Stop dropping your audience into \"soulless\" vertical lists.",
        size: "large",
    },
    {
        icon: Zap,
        title: "Curation at the Speed of Thought",
        description:
            "Built on the RedwoodSDK and Cloudflare Workers, Linkee delivers sub-second page loads globally. Whether it's a list of 50 Daily Podcasts or 100 African Entrepreneurs, your content reaches your audience without the \"lag\" that kills emotional momentum.",
        size: "medium",
    },
    {
        icon: LayoutGrid,
        title: "Multimodal by Design",
        description:
            "Seamlessly embed audio players, high-res design assets, and live social feeds directly into your layout.",
        size: "small",
    },
    {
        icon: Sparkles,
        title: "Automated Intelligence",
        description:
            "Let our smart capture tools handle the metadata, so you can focus on the narrative.",
        size: "small",
    },
    {
        icon: Lock,
        title: "Privacy-First",
        description:
            "Effortlessly toggle between a private \"second brain\" and a public \"thought leadership\" hub.",
        size: "small",
    },
];

export function FeaturesBento() {
    return (
        <section className="px-6 py-24">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">Features</p>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                        The &ldquo;Bento Box&rdquo; for Your Digital Identity
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ditch the &ldquo;grocery list&rdquo; aesthetic. Organize your world in responsive, branded bento grids.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Large card spanning 2 columns */}
                    <div className="md:col-span-2 p-8 rounded-2xl border border-border bg-card hover:border-accent/50 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                            <Sparkles className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">The Digital Garden for Your Interests</h3>
                        <p className="text-muted-foreground leading-relaxed">The era of mindless consumption is over. Today, curation is about cultivating taste and uncovering unexpected connections. Stop dropping your audience into \"soulless\" vertical lists.</p>
                        <p className="mt-4 text-foreground">
                            Linkee gives your interests a home that feels like a creative studio for your mind—designed to turn fragmented scraps of knowledge into meaningful insight.
                        </p>
                    </div>

                    {/* Speed card */}
                    <div className="p-8 rounded-2xl border border-border bg-card hover:border-accent/50 transition-colors group row-span-2">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                            <Zap className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Curation at the Speed of Thought</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">Built on the RedwoodSDK and Cloudflare Workers, Linkee delivers sub-second page loads globally. Whether it's a list of 50 Daily Podcasts or 100 African Entrepreneurs, your content reaches your audience without the \"lag\" that kills emotional momentum.</p>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-accent">{"<"}100ms</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Global page load time</p>
                        </div>
                    </div>

                    {/* Three smaller cards */}
                    {features.slice(2).map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl border border-border bg-card hover:border-accent/50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                                <feature.icon className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
