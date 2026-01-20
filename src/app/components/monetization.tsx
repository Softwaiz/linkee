import { DollarSign, Shield, TrendingUp } from "lucide-react";

export function Monetization() {
    return (
        <section className="px-6 py-24 bg-card/50">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">Monetization</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-6">
                            Keep the Lion&apos;s Share
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Most platforms act as middlemen, taking the majority of your value.
                            We believe your taste is a professional asset that deserves a fair return.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                    <DollarSign className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">65% Creator Payout</h3>
                                    <p className="text-muted-foreground">
                                        We distribute the majority of ad revenue directly to you.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Trust over Algorithms</h3>
                                    <p className="text-muted-foreground">
                                        Monetize your expertise and build a lasting brand legacy without the noise of corporate-first advertising.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-3xl border border-border bg-card p-8 flex flex-col justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Your earnings</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-bold text-accent">65%</span>
                                    <span className="text-2xl text-muted-foreground">of revenue</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">You</span>
                                    <span className="font-semibold text-accent">65%</span>
                                </div>
                                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                                    <div className="h-full w-[65%] bg-accent rounded-full" />
                                </div>

                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-muted-foreground">Platform</span>
                                    <span className="font-semibold">35%</span>
                                </div>
                                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                                    <div className="h-full w-[35%] bg-foreground/30 rounded-full" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <div className="flex items-center gap-2 text-accent">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="font-medium">Industry-leading creator share</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
