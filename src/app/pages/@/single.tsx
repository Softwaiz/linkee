import { db, User, Collection } from "@db/index";
import { PublicCollectionsGrid } from "@/components/common/public-collections-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RequestInfo } from "rwsdk/worker";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";


export default async function PublicProfilePage({ params }: RequestInfo) {
    const alias = params.alias;

    // 1. Fetch user
    const user = await db.selectFrom("users")
        .selectAll()
        .where("alias", "=", alias)
        .executeTakeFirst();

    if (!user) {
        return <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="text-2xl font-bold">User not found</h1>
            <p className="text-muted-foreground">The user @{alias} does not exist.</p>
        </div>
    }

    // 2. Fetch public collections
    // Assuming all collections are public for now as per previous context, 
    // or we filter by validity.
    const collections = await db.selectFrom("boards")
        .selectAll()
        .where("userId", "=", user.id)
        .execute() as unknown as Collection[];


    return <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="w-full py-16">
            <header className="bg-card border-b px-4 py-12 md:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                            <AvatarImage src={user.image || ""} alt={user.firstName} />
                            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {user.firstName} {user.lastName}
                            </h1>
                            {user.alias && (
                                <p className="text-lg text-muted-foreground">@{user.alias}</p>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <main className="mx-auto mt-12 mb-20 max-w-5xl px-4 md:px-8">
                <div className="mb-8 border-b pb-4">
                    <h2 className="text-xl font-semibold">Collections</h2>
                </div>
                <PublicCollectionsGrid items={collections} />
            </main>
        </main>

        <Footer />
    </div>
}
