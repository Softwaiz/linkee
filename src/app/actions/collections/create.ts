"use server";
import { CreateCollectionSchema } from "@/validations/collection/create";
import { Collection, db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import z from "zod";

export async function createCollection(page: Partial<Collection>) {
    const { ctx } = getRequestInfo();
    if (!ctx.user) {
        return {
            success: false,
            message: "Please log in first."
        }
    }

    const validated = CreateCollectionSchema.safeParse(page);

    if(!validated.success) {
        return {
            success: false,
            message: "Your collection seems incorrect.",
            errors: z.treeifyError(validated.error)
        }
    }

    let data = validated.data;

    const createdItem = await db.insertInto("boards").values({
        id: crypto.randomUUID(),
        userId: ctx.user.id,
        label: data.label,
        description: data.description ?? 'No description provided.',
        nodes: JSON.stringify(data.nodes),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })
        .returningAll()
        .executeTakeFirst();

    return {
        success: true,
        message: `Collection ${createdItem?.label} created !`,
        created: createdItem
    }

}