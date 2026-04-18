import { db, User, Collection } from "@db/index";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Link } from "@/components/link";

export default async function HtmlSitemap() {
    // Fetch users who have an alias
    const users = await db.selectFrom("users")
        .where("alias", "is not", null)
        .select(["alias", "firstName", "lastName"])
        .execute();

    // Fetch public collections
    const collections = await db.selectFrom("boards")
        .innerJoin("boardSettings", "boards.id", "boardSettings.boardId")
        .where("boardSettings.visibility", "=", "public")
        .select(["boards.id as id", "slug", "label as name", "description"])
        .execute();

    return (
        <div className="min-h-screen bg-background pb-20">
            <title>Sitemap - Linkits</title>
            <meta name="description" content="Sitemap containing all public profiles and collections on Linkits." />
            <Header />
            <div className="w-full pb-16">
                <section className="bg-card border-b px-4 py-12 md:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            Sitemap
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Explore all public profiles and collections on Linkits.
                        </p>
                    </div>
                </section>

                <main className="mx-auto mt-12 mb-20 max-w-5xl px-4 md:px-8 flex flex-col gap-16">
                    <section>
                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-2xl font-semibold">User Profiles</h2>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map((user) => (
                                <li key={user.alias!}>
                                    <Link
                                        href={`/@${user.alias}`}
                                        className="text-foreground hover:text-primary transition-colors hover:underline block p-2 rounded-md hover:bg-muted/50"
                                    >
                                        {user.firstName} {user.lastName} <span className="text-muted-foreground text-sm">(@{user.alias})</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-2xl font-semibold">Public Kits</h2>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {collections.map((collection) => (
                                <li key={collection.id}>
                                    <Link
                                        href={`/kit/${collection.slug || collection.id}`}
                                        className="text-foreground hover:text-primary transition-colors flex flex-col gap-1 p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border"
                                    >
                                        <span className="font-medium hover:underline">{collection.name}</span>
                                        {collection.description && (
                                            <span className="text-sm text-muted-foreground line-clamp-1">{collection.description}</span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
}
