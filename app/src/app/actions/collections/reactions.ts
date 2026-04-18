"use server";

import { db } from "@db/index";
import { getRequestInfo, serverQuery } from "rwsdk/worker";

export const getMyReactions = serverQuery(async (collectionId: string) => {
    const { ctx } = getRequestInfo();
    if (!ctx.user) {
        return undefined;
    }
    const reactions = await db
        .selectFrom("boardReactions")
        .where("boardReactions.boardId", "=", collectionId)
        .where("userId", "=", ctx.user.id)
        .select(["boardReactions.type"])
        .execute();

    return {
        isLiked: reactions.reduce((acc, r) => r.type === "like" ? acc + 1 : acc, 0) > 0,
        isLoved: reactions.reduce((acc, r) => r.type === "love" ? acc + 1 : acc, 0) > 0,
        isSaved: reactions.reduce((acc, r) => r.type === "save" ? acc + 1 : acc, 0) > 0
    }
})