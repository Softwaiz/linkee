import { Collection } from "@db/index"
import { Link } from "../link";
import { ArrowRight } from "lucide-react";

export async function SearchResults({ count, items, query }: { count: number, items: Collection[], query: string }) {
    return <div className="w-full flex flex-col gap-2 text-card-foreground">
        <div className="w-full flex flex-col items-start justify-start gap-2">
            <h4 className="text-xs font-semibold text-muted-foreground">Collections ({count})</h4>
            <div className="w-full flex flex-col items-start justify-start gap-2">
                {items.map((item) => (
                    <Link
                        title={`See collection ${item.label}`}
                        className="group/board w-full flex flex-row items-center justify-start gap-2 p-2 rounded-md transition-all duration-100"
                        key={item.id}
                        href={`/collections/${item.slug ?? item.id}`}>
                        {item.picture && <img className="w-12 h-12 rounded-md" src={item.picture} alt={`Picture ${item.label}`} srcSet="" />}
                        <div className="grow flex flex-col items-start justify-start">
                            <h2 className="text-sm opacity-75">{item.label}</h2>
                            <p className="text-xs opacity-60 truncate">{item.description}</p>
                        </div>
                        <span className="opacity-0 group-hover/board:opacity-100">
                            <ArrowRight className="size-4" />
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    </div>
}