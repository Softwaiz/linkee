"use server";
import { CollectionResolver } from "@/office/collections/resolvers/collection"
import { getRequestInfo, serverQuery } from "rwsdk/worker";

export const highlightCollection = serverQuery(async (collectionId: string) => {
    const { ctx } = getRequestInfo();
    if (ctx.user?.role !== "admin") {
        throw new Response("Unauthorized", { status: 401 });
    }
    try {
        return await CollectionResolver.highlightCollection(collectionId)
        .then(items => {
            return {
                success: true,
                message: "Collection marked as top pick",
                items
            }
        });
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred"
        }
    }
}, { method: "GET" });

export type HighlightResult = Awaited<ReturnType<typeof highlightCollection>>;


export const downPlayCollection = serverQuery(async (collectionId: string) => {
    const { ctx } = getRequestInfo();
    if (ctx.user?.role !== "admin") {
        throw new Response("Unauthorized", { status: 401 });
    }
    try {
        return await CollectionResolver.downplayCollection(collectionId)
        .then(items => {
            return {
                success: true,
                message: "Collection marked as not highlighted",
                items
            }
        });
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred"
        }
    }
}, { method: "GET" });

export type DownplayResult = Awaited<ReturnType<typeof downPlayCollection>>;