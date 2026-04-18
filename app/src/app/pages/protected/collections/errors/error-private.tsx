import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";

export function CollectionIsPrivate() {

    return <div>
        <title>This collection is private</title>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="mb-4 text-2xl font-bold">
                Sorry,<br />the requested collection is not public.
            </h1>
            <p className="mb-8 text-muted-foreground">
                The owner explicitely marked this collection private, you won't be able to see it until he explicitely grants it.
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