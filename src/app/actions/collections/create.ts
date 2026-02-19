"use server";
import { CreateCollectionSchema, CollectionSettingsInput, CollectionSettingsSchema } from "@/validations/collection/create";
import { Collection, db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import z from "zod";

export async function createCollection(page: Partial<Collection> & { settings?: CollectionSettingsInput }) {
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

    let { settings, ...data } = validated.data;

    if (data.slug) {
        const existing = await db.selectFrom("boards").select("id").where("slug", "=", data.slug).executeTakeFirst();
        if (existing) {
            return {
                success: false,
                message: "This tag is already taken."
            }
        }
    }

    const createdItem = await db.insertInto("boards").values({
        id: crypto.randomUUID(),
        userId: ctx.user.id,
        label: data.label,
        slug: data.slug,
        description: data.description ?? 'No description provided.',
        picture: data.picture,
        banner: data.banner,
        nodes: JSON.stringify(data.nodes),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })
        .returningAll()
        .executeTakeFirst();

    if (createdItem) {
        await db.insertInto("boardSettings").values({
            ...settings as any,
            id: crypto.randomUUID(),
            boardId: createdItem.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).execute();
    }

    return {
        success: true,
        message: `Collection ${createdItem?.label} created !`,
        path: `/collections/${createdItem?.slug || createdItem?.id}`,
        created: createdItem
    }

}