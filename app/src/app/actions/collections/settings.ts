"use server";
import { CollectionSettingsSchema } from "@/validations/collection/create";
import { CollectionSettings, db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import z from "zod";

export async function updateCollectionSettings(collectionId: string, settings: Partial<CollectionSettings>) {
    const { ctx } = getRequestInfo();
    if (!ctx.user) {
        return {
            success: false,
            message: "Please log in first."
        }
    }

    // Verify ownership
    const collection = await db.selectFrom("boards")
        .select("userId")
        .where("id", "=", collectionId)
        .executeTakeFirst();

    if (!collection) {
        return {
            success: false,
            message: "Collection not found."
        }
    }

    if (collection.userId !== ctx.user.id) {
        return {
            success: false,
            message: "You cannot edit these settings."
        }
    }

    const validated = CollectionSettingsSchema.safeParse(settings);

    if (!validated.success) {
        return {
            success: false,
            message: "Invalid settings.",
            errors: z.treeifyError(validated.error)
        }
    }

    const data = validated.data;

    const existingSettings = await db.selectFrom("boardSettings")
        .select("id")
        .where("boardId", "=", collectionId)
        .executeTakeFirst();

    let result;
    if (existingSettings) {
        result = await db.updateTable("boardSettings")
            .set({
                ...data,
                updatedAt: new Date().toISOString()
            })
            .where("boardId", "=", collectionId)
            .returningAll()
            .executeTakeFirst();
    } else {
        result = await db.insertInto("boardSettings")
            .values({
                id: crypto.randomUUID(),
                boardId: collectionId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...CollectionSettingsSchema.parse({}), // Apply default values
                ...data
            })
            .returningAll()
            .executeTakeFirst();
    }

    return {
        success: true,
        message: "Settings updated.",
        settings: result
    }
}
