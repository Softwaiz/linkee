import { Collection, db } from "@db/index"
import { Link } from "../link";

export async function SearchResults({ count, items, query }: { count: number, items: Collection[], query: string }) {
    return <div className="w-full flex flex-col gap-2 bg-card text-card-foreground">
        <div className="w-full flex flex-col items-start justify-start gap-2">
            <h4 className="text-xs font-semibold text-muted-foreground">Collections ({count})</h4>
            <div className="flex flex-row items-center">
                {items.map((item) => (
                    <Link key={item.id} href={`/collections/${item.id}`}>
                        {item.picture && <img className="w-12 h-12 rounded-md" src={item.picture} alt={`Picture ${item.label}`} srcSet="" />}
                        <div className="flex flex-col items-start justify-start gap-2">
                            <h2 className="text-base font-semibold">{item.label}</h2>
                            <p className="text-xs text-muted truncate">{item.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
}