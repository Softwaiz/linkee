"use server";
import { CreateCollectionSchema } from "@/validations/collection/create";
import { Collection, db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import z from "zod";

export async function updateCollection(id: string, page: Partial<Collection>) {
    const { ctx } = getRequestInfo();
    if (!ctx.user) {
        return {
            success: false,
            message: "Please log in first."
        }
    }

    const validated = CreateCollectionSchema.safeParse(page);

    if (!validated.success) {
        return {
            success: false,
            message: "Your collection seems incorrect.",
            errors: z.treeifyError(validated.error)
        }
    }

    let data = validated.data;

    const candidate = await db
        .selectFrom("boards")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();



    if (!candidate) {
        return {
            success: false,
            message: "Collection not found."
        }
    }

    if (candidate.userId !== ctx.user.id) {
        return {
            success: false,
            message: "You cannot edit this collection."
        }
    }

    const updatedItem = await db.updateTable("boards")
        .set({
            ...candidate,
            id: candidate.id,
            userId: ctx.user.id,
            nodes: JSON.stringify(data.nodes),
            createdAt: candidate.createdAt,
            updatedAt: new Date().toISOString()
        })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirst();

    return {
        success: true,
        message: `Collection ${updatedItem?.label} was updated !`,
        updated: updatedItem
    }

}