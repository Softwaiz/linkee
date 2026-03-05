"use client"
import { useState } from "react"
import { LogIn, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "../link"
import { Logo } from "../logo"
import { Searchbar } from "../search/layout"

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <nav
            className="sticky top-0 z-50 border-b border-border bg-card/20 backdrop-blur-md"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2" aria-label="Linkits home">
                    <Logo />
                    <span className="text-xl font-semibold tracking-tight text-foreground">
                        Linkits
                    </span>
                </Link>
                <div className="hidden lg:block w-full max-w-lg">
                    <Searchbar />
                </div>
                <div className="hidden md:block">
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        asChild
                    >
                        <Link href="/signin" className="flex flex-row items-center gap-2">
                            Get Started
                            <LogIn className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <button
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? (
                        <X className="h-5 w-5 text-foreground" />
                    ) : (
                        <Menu className="h-5 w-5 text-foreground" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-border bg-background px-6 pb-6 pt-4 md:hidden">
                    <div className="flex flex-col gap-4">
                        <Button
                            size="sm"
                            className="mt-2 w-full bg-foreground text-background hover:bg-foreground/90"
                            asChild
                        >
                            <Link href="/signin">
                                Sign In
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    )
}
