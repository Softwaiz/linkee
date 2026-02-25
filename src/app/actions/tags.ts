"use server";
import { db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";

export async function getTagsWithCounts() {
    const records = await db
        .selectFrom("tags")
        .leftJoin("boardTags", "tags.id", "boardTags.tagId")
        .select((eb) => [
            "tags.id",
            "tags.canonicalLabelEn",
            "tags.canonicalLabelFr",
            "tags.synonymsEn",
            "tags.synonymsFr",
            "tags.createdAt",
            "tags.updatedAt",
            eb.fn.count("boardId").as("boardCount"),
        ])
        .groupBy("tags.id")
        .orderBy("tags.createdAt", "desc")
        .execute();

    return records.map(record => ({
        ...record,
        synonymsEn: (record.synonymsEn as unknown as string[]) || [],
        synonymsFr: (record.synonymsFr as unknown as string[]) || [],
        boardCount: Number(record.boardCount)
    }));
}

export async function createTag(data: {
    id: string;
    canonicalLabelEn: string;
    canonicalLabelFr: string;
    synonymsEn: string[];
    synonymsFr: string[];
}) {
    const { ctx } = getRequestInfo();
    if (ctx.user?.role !== "admin") {
        return {
            success: false,
            message: "You are not authorized to create tags."
        }
    }

    const now = new Date().toISOString();
    return db
        .insertInto("tags")
        .values({
            id: data.id,
            canonicalLabelEn: data.canonicalLabelEn,
            canonicalLabelFr: data.canonicalLabelFr,
            synonymsEn: JSON.stringify(data.synonymsEn),
            synonymsFr: JSON.stringify(data.synonymsFr),
            createdAt: now,
            updatedAt: now,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
        .then(() => {
            return {
                success: true,
                message: "Tag created successfully."
            }
        })
        .catch((error) => {
            return {
                success: false,
                message: error.message
            }
        })
}

export async function updateTag(
    id: string,
    data: {
        canonicalLabelEn?: string;
        canonicalLabelFr?: string;
        synonymsEn?: string[];
        synonymsFr?: string[];
    }
) {
    const { ctx } = getRequestInfo();
    if (ctx.user?.role !== "admin") {
        return {
            success: false,
            message: "You are not authorized to update tags."
        }
    }

    const now = new Date().toISOString();
    const updateData: any = { updatedAt: now };

    if (data.canonicalLabelEn !== undefined) updateData.canonicalLabelEn = data.canonicalLabelEn;
    if (data.canonicalLabelFr !== undefined) updateData.canonicalLabelFr = data.canonicalLabelFr;
    if (data.synonymsEn !== undefined) updateData.synonymsEn = JSON.stringify(data.synonymsEn);
    if (data.synonymsFr !== undefined) updateData.synonymsFr = JSON.stringify(data.synonymsFr);

    return db
        .updateTable("tags")
        .set(updateData)
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow()
        .then(() => {
            return {
                success: true,
                message: "Tag updated successfully."
            }
        })
        .catch((error) => {
            return {
                success: false,
                message: error.message
            }
        })
}

export async function deleteTag(id: string) {
    const { ctx } = getRequestInfo();
    if (ctx.user?.role !== "admin") {
        return {
            success: false,
            message: "You are not authorized to delete tags."
        }
    }
    return db
        .deleteFrom("tags")
        .where("id", "=", id)
        .executeTakeFirst()
        .then(() => {
            return {
                success: true,
                message: "Tag deleted successfully."
            }
        })
        .catch((error) => {
            return {
                success: false,
                message: error.message
            }
        })
}
