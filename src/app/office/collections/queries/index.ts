"use server";
import { CollectionResolver } from "@/office/collections/resolvers/collection"
import { getRequestInfo, serverQuery } from "rwsdk/worker";

export const getCollection = serverQuery(async (collectionId: string) => {
    const { ctx } = getRequestInfo();
    if (ctx.user?.role !== "admin") {
        throw new Response("Unauthorized", { status: 401 });
    }
    return await CollectionResolver.getCollection(collectionId);
}, { method: "GET" });

export type GetCollectionResult = Awaited<ReturnType<typeof getCollection>>;