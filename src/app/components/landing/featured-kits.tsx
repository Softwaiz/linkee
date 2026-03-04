import { Button } from "../ui/button"
import { Link } from "../link"
import { ArrowRight } from "lucide-react"
import { FeaturedKitsGrid } from "./featured-kits-grid"
import { SetupInitialWebring } from "./setup-initial-webring"
import { UserCollectionResolver } from "@/resolvers/collections"

export async function FeaturedKits() {
    
    const items = await UserCollectionResolver.getHighlightedCollectionWithCaching();

    return (
        <section id="kits" className="px-6 py-16 md:py-24 bg-muted/30 border-t border-border" aria-labelledby="featured-kits-heading">
            <div className="w-full max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">Recently added kits</h1>
                <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* CTA card */}
                    <Link
                        title="Create your own collection now."
                        href={"/collections/new"}
                        className="w-full group bg-card/5 border border-card hover:bg-card/50 duration-200 transition-all rounded-md flex flex-col items-center justify-start"
                    >
                        <div className="grow flex flex-col items-start justify-start gap-1 w-full">
                            <img
                                src={"https://fastly.picsum.photos/id/110/600/400.jpg?hmac=SwlqtGTf9bmTozBRccGd3Y8G25aXw4ucHtAegJaFRhk"}
                                alt={"Your collection banner"}
                                className="w-full object-cover object-center rounded-t-md h-46"
                            />
                            <div className="w-full flex flex-col items-start justify-start px-3 py-4">
                                <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-foreground/80">
                                    Your collection name
                                </h3>
                                <p className="mt-1 w-full text-xs leading-relaxed text-muted-foreground">
                                    Your collection description will be here
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Button size="sm" variant="link" asChild>
                                        <Link href="/collections/new">
                                            Create yours <ArrowRight className="ml-0.5 size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <FeaturedKitsGrid items={items} />
                </div>
                <div className="mt-16 mx-auto flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Let's get you started.</h3>
                    <p className="mt-2 text-lg text-muted-foreground">Enter a link to start building your own webring.</p>
                    <SetupInitialWebring layoutIdPrefix="featured-kits" />
                </div>
            </div>
        </section>
    )
}
