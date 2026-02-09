"use server";
import { CollectionSettingsInput, CreateCollectionSchema } from "@/validations/collection/create";
import { Collection, db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import z from "zod";

export async function updateCollection(id: string, page: Partial<Collection> & { settings: CollectionSettingsInput }) {
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

    if (data.slug && data.slug !== candidate.slug) {
        const existing = await db
            .selectFrom("boards")
            .select("id")
            .where("slug", "=", data.slug)
            .where("id", "!=", id)
            .executeTakeFirst();
        if (existing) {
            return {
                success: false,
                message: "This tag is already taken."
            }
        }
    }

    const updatedItem = await db.updateTable("boards")
        .set({
            ...candidate,
            id: candidate.id,
            userId: ctx.user.id,
            label: data.label,
            description: data.description ?? candidate.description,
            slug: data.slug ?? candidate.slug,
            picture: data.picture ?? candidate.picture,
            banner: data.banner ?? candidate.banner,
            nodes: JSON.stringify(data.nodes),
            createdAt: candidate.createdAt,
            updatedAt: new Date().toISOString()
        })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirst();

    let existentSettings = await db
        .selectFrom("boardSettings")
        .selectAll()
        .where("boardId", "=", candidate.id)
        .executeTakeFirst();

    if (existentSettings) {
        await db.updateTable("boardSettings")
            .set({
                ...settings,
                updatedAt: new Date().toISOString(),
            })
            .where("id", "=", existentSettings.id)
            .execute()
    }
    else {
        await db
            .insertInto("boardSettings")
            .values({
                ...settings as any,
                id: crypto.randomUUID(),
                boardId: candidate.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .execute();
    }

    return {
        success: true,
        message: `Collection ${updatedItem?.label} was updated !`,
        updated: updatedItem
    }

}