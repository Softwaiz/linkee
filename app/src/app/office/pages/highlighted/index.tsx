import { CollectionResolver } from "@/office/collections/resolvers/collection";
import { CollectionContent } from "../collections/index.content";

export async function HighlightedCollections() {
    const highlightedItems = await CollectionResolver.getHighlightedCollections();

    return <div className="w-full flex flex-col flex-1 p-8">
        <title>{`Highlighted kits - Linkits Office`}</title>
        <meta name="description" content="Manage Linkits collections" />
        <CollectionContent title="Highlighted Kits" items={highlightedItems} />
    </div>
}