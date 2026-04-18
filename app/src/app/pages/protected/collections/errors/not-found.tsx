import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";

export function CollectionNotFound() {

    return <div>
        <title>404 - Collection not found</title>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="mb-4 text-2xl font-bold">
                Sorry,<br />the requested collection was not found.
            </h1>
            <p className="mb-8 text-muted-foreground">
                The owner may have removed it, or looking for something that doesn't exist.
            </p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/">
                        Go Home
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/collections/new">
                        Create yours
                    </Link>
                </Button>
            </div>
        </div>
    </div>
}