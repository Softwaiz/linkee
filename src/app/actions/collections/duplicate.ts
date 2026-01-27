"use server"
import { db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import { serverAction } from "rwsdk/worker"

export const duplicate = serverAction(async function (id: string) {
    const { ctx } = getRequestInfo();
    if (!ctx.user) {
        return {
            success: false,
            message: "Please log in first."
        }
    }
    const selected = await db.selectFrom("boards")
        .where("id", "=", id).selectAll().executeTakeFirst();

    if (!selected) {
        return {
            success: false,
            message: "Collection not found."
        }
    }

    if (selected?.userId !== ctx.user.id) {
        return {
            success: false,
            message: "You can't duplicate this collection."
        }
    }

    console.log("duplicating ", selected);

    const collection = await db.insertInto("boards").values({
        ...selected,
        nodes: JSON.stringify(selected.nodes),
        id: crypto.randomUUID(),
        label: `${selected.label} (copy)`,
        sourceId: selected.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }).returning(["id"]).executeTakeFirst();

    return {
        success: true,
        message: `${selected.label} was cloned.`,
        clone: collection
    }
})