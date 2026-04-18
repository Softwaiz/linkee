"use server";
import { CollectionReaction, db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";

export async function toggleReaction(collectionId: string, type: 'like' | 'save') {
    const { ctx } = getRequestInfo();

    if (!ctx.user) {
        return {
            success: false,
            message: "Please log in first."
        }
    }

    const userId = ctx.user.id;

    // Check if reaction exists
    const existing = await db
        .selectFrom("boardReactions")
        .selectAll()
        .where("boardId", "=", collectionId)
        .where("userId", "=", userId)
        .where("type", "=", type)
        .executeTakeFirst();

    if (existing) {
        // Remove reaction
        await db
            .deleteFrom("boardReactions")
            .where("id", "=", existing.id)
            .execute();

        return {
            success: true,
            action: 'removed',
            type
        }
    } else {
        await db
            .insertInto("boardReactions")
            .values({
                boardId: collectionId,
                userId: userId,
                type: type,
                createdAt: new Date().toISOString()
            } as CollectionReaction)
            .execute();

        return {
            success: true,
            action: 'added',
            type
        }
    }
}
