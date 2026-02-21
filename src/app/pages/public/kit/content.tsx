"use client"
import { useState, useMemo, useRef, useEffect } from "react"
import { Search, ArrowUp, Link2, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getAllOrigins } from "@/lib/collection-data"
import { cn } from "@/lib/utils"
import { Collection } from "@db/index"
import { TextPreview } from "@/components/collection/text-preview"
import { LinkCard, LinkOriginIcon } from "@/components/collection/link-card"
import { useDebounce } from "@/hooks/useDebounce"

export function CollectionContent({ collection }: { collection: Collection }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryDraft, setSearchQueryDraft] = useState("");

    const searchDebounce = useDebounce(250);

    const [activeOrigins, setActiveOrigins] = useState<string[]>([])
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

    const allOrigins = useMemo(() => getAllOrigins(collection.nodes), [collection.nodes]);

    const totalLinks = useMemo(() => collection.nodes.reduce((acc, section) => acc + section.items.filter((item) => item.type === "link").length, 0), [collection.nodes]);
    const totalSections = useMemo(() => collection.nodes.length, [collection.nodes]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleOrigin = (origin: string) => {
        setActiveOrigins((prev) =>
            prev.includes(origin)
                ? prev.filter((o) => o !== origin)
                : [...prev, origin]
        )
    }

    const filteredSections = useMemo(() => {
        return collection.nodes
            .map((section) => {
                const filteredItems = section.items.filter((item) => {
                    if (item.type === "link") {
                        try {
                            let origin = new URL(item.url).origin;
                            const matchesSearch =
                                searchQuery === "" ||
                                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                item.description.toLowerCase().includes(searchQuery.toLowerCase())
                            const matchesOrigin =
                                activeOrigins.length === 0 || activeOrigins.includes(origin)
                            return matchesSearch && matchesOrigin
                        } catch (error) {
                            return false
                        }
                    }
                })
                return { ...section, items: filteredItems }
            })
            .filter((section) => section.items.length > 0)
    }, [collection.nodes, searchQuery, activeOrigins])

    const totalFiltered = filteredSections.reduce(
        (acc, s) => acc + s.items.length,
        0
    )

    const scrollToSection = (title: string) => {
        setActiveSection(title)
        const el = sectionRefs.current[title]
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 140
            window.scrollTo({ top, behavior: "smooth" })
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <header className="relative overflow-hidden border-b border-border">

                <div className="w-full">
                    <img
                        className="w-full h-40 sm:h-50 md:h-60 lg:h-80 object-cover object-center"
                        src={collection.banner || "https://picsum.photos/1280/920"}
                        alt={`Image of ${collection.label}`}
                    />
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.06,transparent_70%)]" />
                <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 text-muted-foreground text-sm mb-4">
                        <Link2 className="h-4 w-4" />
                        <span>Shared Collection</span>
                    </div>
                    <div className="flex flex-col items-start justify-center">
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
                            {collection.label}
                        </h1>
                        <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed lg:text-lg">
                            {collection.description}
                        </p>
                    </div>
                    <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Link2 className="h-3.5 w-3.5 text-primary" />
                            {totalLinks} links
                        </span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-primary" />
                            {totalSections} sections
                        </span>
                    </div>
                </div>
            </header>

            {/* Sticky toolbar */}
            <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
                <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search topics..."
                            value={searchQueryDraft}
                            onChange={(e) => {
                                setSearchQueryDraft(e.target.value);
                                searchDebounce.delay(() => {
                                    setSearchQuery(e.target.value)
                                })
                            }}
                            className="h-10 pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground shadow-sm"
                        />
                    </div>

                    {/* Section pills */}
                    {collection.nodes.length > 1 && <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">
                            Sections
                        </span>
                        {collection.nodes.map((section) => (
                            <button
                                key={section.title}
                                onClick={() => scrollToSection(section.title)}
                                className={cn(
                                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                                    activeSection === section.title
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
                                )}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                    }
                    {/* Origin filter badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">
                            Origins
                        </span>
                        {allOrigins.map((origin) => {
                            const isActive = activeOrigins.includes(origin)
                            return (
                                <button
                                    key={origin}
                                    onClick={() => toggleOrigin(origin)}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                                        isActive
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
                                    )}
                                >
                                    <LinkOriginIcon origin={origin} />
                                    {origin}
                                </button>
                            )
                        })}
                        {activeOrigins.length > 0 && (
                            <button
                                onClick={() => setActiveOrigins([])}
                                className="text-xs text-primary hover:underline ml-1"
                            >
                                Clear filters
                            </button>
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">
                            {totalFiltered} result{totalFiltered !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                {filteredSections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Search className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-foreground">
                            No channels found
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-14">
                        {filteredSections.map((section) => (
                            <section
                                key={section.title}
                                ref={(el) => {
                                    sectionRefs.current[section.title] = el
                                }}
                            >
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                                        {section.title}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                        {section.description}
                                    </p>
                                    <span className="mt-2 inline-block text-xs text-muted-foreground">
                                        {section.items.length} channel
                                        {section.items.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {section.items.map((item) => {
                                        if (item.type === "link") {
                                            return <LinkCard key={item.id} item={item} />
                                        }
                                        return <TextPreview key={item.id} text={item} />
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {/* Scroll to top */}
            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-secondary"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}