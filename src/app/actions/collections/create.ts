"use server";
import { Page } from "@/lib/types";
import { db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";

export async function createCollection(page: Page) {
    const { ctx } = getRequestInfo();
    if (!ctx.user) {
        return {
            success: false,
            message: "Please log in first."
        }
    }

    const createdItem = await db.insertInto("boards").values({
        id: crypto.randomUUID(),
        userId: ctx.user.id,
        label: page.title,
        description: page.description ?? 'No description provided.',
        nodes: JSON.stringify(page.sections),
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