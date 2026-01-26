"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="container mx-auto h-16 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <Logo />
                    Linkee
                </a>

                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </a>
                    <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Pricing
                    </a>
                    <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        About
                    </a>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" size="sm">
                        Log in
                    </Button>
                    <Button size="sm">Get Started</Button>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="sr-only">Toggle menu</span>
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <nav className="flex flex-col p-6 gap-4">
                        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </a>
                        <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </a>
                        <div className="flex flex-col gap-2 pt-4 border-t border-border">
                            <Button variant="ghost" size="sm" className="justify-start">
                                Log in
                            </Button>
                            <Button size="sm">Get Started</Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
