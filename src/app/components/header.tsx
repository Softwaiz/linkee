"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { Link } from "./link";
import { useDimensions } from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";

export function Header({ className, sticky = true }: { className?: string, sticky?: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const header = useDimensions(headerRef);

    useEffect(() => {
        if (header.dimensions) {
            document.body.style.setProperty('--app-header-width', header.dimensions.width + "px");
            document.body.style.setProperty('--app-header-height', header.dimensions.height + "px");
        }
    }, [header.dimensions]);

    return (
        <header ref={headerRef} className={
            cn(
                sticky && "sticky top-0 left-0 right-0 z-50",
                "bg-background/80 backdrop-blur-xl border-b border-border",
                className
            )
        }>
            <div className="container mx-auto h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <Logo />
                    Linkits
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Pricing
                    </Link>
                    <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        About
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/signin">
                            Log in
                        </Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/signup">
                            Get Started
                        </Link>
                    </Button>
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
                        <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                        <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </Link>
                        <div className="flex flex-col gap-2 pt-4 border-t border-border">
                            <Button variant="ghost" size="sm" className="justify-start" asChild>
                                <Link href="/signin">
                                    Log in
                                </Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/signup">
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
