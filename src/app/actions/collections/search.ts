"use server";
import { db } from "@db/index";
import { getRequestInfo, serverQuery } from "rwsdk/worker";

export const searchCollections = serverQuery(async (search: string = "") => {
    const { ctx: { user } } = getRequestInfo();
    if (!user) return {
        items: []
    }
    const collections = await db.selectFrom("boards")
        .select(["id", "label", "description"])
        .where("userId", "=", user.id)
        .where("label", "like", `%${search}%`)
        .execute();

    return { items: collections };
}, { method: "GET" });
