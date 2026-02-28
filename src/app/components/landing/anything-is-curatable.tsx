import { ArrowRight } from "lucide-react";
import { Link } from "../link";
import { Button } from "../ui/button";

export function AnythingIsCuratable() {
    return (
        <section id="anything-is-curatable" className="px-6 py-16 md:py-20" aria-labelledby="anything-is-curatable-heading">
            <div className="mx-auto max-w-[1080px] flex flex-col items-center justify-center">
                <h2
                    id="anything-is-curatable-heading"
                    className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
                >
                    Anything worth sharing is curatable.
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground text-center">
                    Whether it's a collection of your favorite articles,
                    a list of tools you use daily,
                    your portfolio,
                    or anything else you want to share with the world.
                </p>
                <Button asChild>
                    <Link className="mt-4" href="/collections/new">
                        Create your first collection
                        <ArrowRight />
                    </Link>
                </Button>
            </div>
        </section>
    )
}