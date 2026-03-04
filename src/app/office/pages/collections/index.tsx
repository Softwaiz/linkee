import { RequestInfo } from "rwsdk/worker";
import { db } from "@db/index";
import { CollectionContent } from "./index.content";
import { CollectionResolver } from "@/office/collections/resolvers/collection";

export const CollectionsPage = async (props: RequestInfo) => {
    const url = new URL(props.request.url);
    const filter = url.searchParams.get("filter");

    const {items}  = await CollectionResolver.getCollections({
        onlyPrivate: filter === "private",
        onlyPublic: filter === "public",
        onlyUnlisted: filter === "unlisted"
    });
    
    const title = filter === "private" ? "Private Collections" :
        filter === "public" ? "Public Collections" :
            filter === "unlisted" ? "Unlisted Collections" :
                "All Collections";

    return (
        <div className="flex flex-col flex-1 p-8">
            <title>{`${title} - Linkits Office`}</title>
            <meta name="description" content="Manage Linkits collections" />
            <CollectionContent title={title} items={items} />
        </div>
    );
}