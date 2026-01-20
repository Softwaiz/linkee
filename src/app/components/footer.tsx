export function Footer() {
    return (
        <footer className="px-6 py-16 border-t border-border">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <a href="/" className="text-xl font-bold tracking-tight">
                            Linkee
                        </a>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Transform the beautiful mess of the internet into high-fidelity knowledge assets.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Changelog
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Linkee. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Built on the Edge with zero latency.
                    </p>
                </div>
            </div>
        </footer>
    );
}
