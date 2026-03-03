import { CollectionResolver } from "@/office/helpers/collection"
import { getRequestInfo, serverQuery } from "rwsdk/worker";

export const getCollection = serverQuery(async (collectionId: string) => {
    const { ctx } = getRequestInfo();
    if (ctx.user?.role !== "admin") {
        return new Response("Unauthorized", { status: 401 });
    }
    return await CollectionResolver.getCollection(collectionId);
}, { method: "GET" });