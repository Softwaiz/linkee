"use client"
import { useState } from "react"
import { ChevronDown, LogIn, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "../link"
import { Logo } from "../logo"
import { Searchbar } from "../search/layout"
import { AnimatePresence } from "motion/react"
import { motion } from "motion/react";
import { useEscapeEffect } from "@/hooks/useEscapeEffect"
import { useScrollLockerEffect } from "@/hooks/useScrollLocker"
import { Portal } from "../portal"

const useCaseLinks = [
    { label: "For Portfolios", href: "/for/portfolio" },
    { label: "For Bloggers", href: "/for/blogger" },
    { label: "For Open-Source", href: "/for/open-source" },
    { label: "For Enterprises", href: "/for/enterprise" },
]

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [useCasesOpen, setUseCasesOpen] = useState(false)

    useEscapeEffect(mobileOpen, () => {
        setMobileOpen(false);
    });
    useScrollLockerEffect(mobileOpen);

    return (
        <motion.nav
            className="sticky top-0 z-50 border-b border-border bg-card/20 backdrop-blur-md"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2" aria-label="Linkits home">
                    <Logo />
                    <span className="text-xl font-semibold tracking-tight text-foreground">
                        Linkits
                    </span>
                </Link>
                <div className="hidden lg:block w-full max-w-sm">
                    <Searchbar />
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex flex-row items-start justify-start">
                        {useCaseLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-2 text-sm text-muted-foreground text-nowrap hover:text-foreground hover:bg-muted/50 transition-colors rounded-md"
                                onClick={() => setUseCasesOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
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
                <motion.button
                    layoutId="mobile-menu-button"
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Open menu"
                    aria-expanded={mobileOpen}

                >
                    <Menu className="h-5 w-5 text-foreground" />
                </motion.button>
            </div>

            <Portal container="body">
                <AnimatePresence>
                    {
                        mobileOpen && <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setMobileOpen(false);
                            }}
                            className="fixed top-0 left-0 z-99 w-screen h-screen bg-black/20 backdrop-blur-lg">

                        </motion.div>
                    }
                    {mobileOpen && (
                        <motion.div
                            initial={{ translateY: '100%', opacity: 0 }}
                            animate={{ translateY: '-50%', opacity: 1 }}
                            exit={{ translateY: '100%', opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed z-99 top-1/2 left-1/2 -translate-x-1/2 w-[80%] min-h-[40%] max-h-[80%] border border-border bg-background rounded-md overflow-auto p-4">
                            <motion.button
                                layoutId="mobile-menu-button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close menu"
                                aria-expanded={mobileOpen}
                                className="absolute top-4 right-4">
                                <X className="h-5 w-5 text-foreground" />
                            </motion.button>
                            <div className="">
                                <div className="flex flex-col gap-4">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Use cases</p>
                                    {useCaseLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="text-sm text-foreground hover:text-foreground/70 transition-colors"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <Button
                                        size="sm"
                                        className="mt-2 w-full bg-foreground text-background hover:bg-foreground/90"
                                        asChild
                                    >
                                        <Link href="/signin">
                                            Get started
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Portal>
        </motion.nav>
    )
}
