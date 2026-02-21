import { LinkItem } from "@/validations/collection/create"
import { ExternalLink } from "lucide-react"
import { Badge } from "../ui/badge"
import { useMemo } from "react"

export function LinkCard({
    item,
}: {
    item: LinkItem
}) {
    const url = useMemo(() => {
        try {
            return new URL(item.url);
        } catch (error) {
            return null;
        }
    }, [item]);

    const avatar = useMemo(() => {
        return item.title
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()
    }, [item.title]);

    return (
        <a
            href={item.url}
            title={`Open ${item.title} in a new tab`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
            {/* Avatar placeholder */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                    {avatar}
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                {item.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                {item.description}
            </p>
            {url && <div className="mt-auto pt-4">
                <Badge
                    variant="secondary"
                    className="text-[10px] bg-secondary text-secondary-foreground"
                >
                    <LinkOriginIcon origin={url?.origin} />
                    {url?.origin}
                </Badge>
            </div>}
        </a>
    )
}

export function LinkOriginIcon({ origin }: { origin: string }) {
    if (origin.includes("youtube")) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3 shrink-0"
                aria-hidden="true"
            >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        )
    }
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3 w-3 shrink-0"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
