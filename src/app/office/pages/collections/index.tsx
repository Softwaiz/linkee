import { RequestInfo } from "rwsdk/worker";
import { db } from "@db/index";
import { CollectionContent } from "./index.content";

export const CollectionsPage = async (props: RequestInfo) => {
    const url = new URL(props.request.url);
    const filter = url.searchParams.get("filter");

    let query = db.selectFrom("boards")
        .innerJoin("users", "users.id", "boards.userId")
        .leftJoin("boardSettings", "boardSettings.boardId", "boards.id")
        .select([
            "boards.id",
            "boards.label",
            "boards.createdAt",
            "users.firstName",
            "users.lastName",
            "users.email",
            "boardSettings.visibility"
        ]);

    if (filter === "private") {
        query = query.where("boardSettings.visibility", "=", "private");
    } else if (filter === "public") {
        query = query.where((eb) => eb.or([
            eb("boardSettings.visibility", "=", "public"),
            eb("boardSettings.visibility", "is", null)
        ]));
    } else if (filter === "unlisted") {
        query = query.where("boardSettings.visibility", "=", "unlisted");
    }

    const collections = await query.orderBy("boards.createdAt", "desc").execute();

    const title = filter === "private" ? "Private Collections" :
        filter === "public" ? "Public Collections" :
            filter === "unlisted" ? "Unlisted Collections" :
                "All Collections";

    return (
        <div className="flex flex-col flex-1 p-8">
            <title>{title} - Linkits Office</title>
            <meta name="description" content="Manage Linkits collections" />
            <CollectionContent title={title} items={collections} />
        </div>
    );
}