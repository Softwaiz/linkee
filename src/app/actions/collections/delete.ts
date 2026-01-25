"use server";
import { db } from "@db/index";
import { getRequestInfo, serverAction } from "rwsdk/worker";

export const deleteCollection = serverAction(async function (id: string) {
    const { ctx } = getRequestInfo();
    if (!ctx.user) {
        return {
            success: false,
            message: "Please log in first."
        }
    }
    const selected = await db.selectFrom("boards")
        .where("id", "=", id).select(["id", "label", "userId"]).executeTakeFirst();

    if (!selected) {
        return {
            success: false,
            message: "Collection not found."
        }
    }

    if (selected?.userId !== ctx.user.id) {
        return {
            success: false,
            message: "You can't delete this collection."
        }
    }

    await db.deleteFrom("boards")
        .where("id", "=", id).execute();

    return {
        success: true,
        message: `${selected.label} was deleted !`
    }

}, { method: "POST" });