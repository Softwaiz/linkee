"use server";

import { db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";

export async function checkSlugAvailability(slug: string = "", currentId?: string) {
    const { ctx } = getRequestInfo();
    // We might want to allow checking without being logged in? 
    // For now let's assume you need to be logged in to create/edit collections anyway.
    if (!ctx.user) {
        return {
            available: false,
            message: "Please log in first."
        }
    }

    let parsed = slug.replaceAll("/", "-").replaceAll(" ", "-").toLowerCase().replaceAll("_", "-").trim();

    if (!parsed || parsed.trim() === "") {
        return {
            available: false,
            message: "Tag cannot be empty.",
            selected: parsed
        }
    }

    let query = db.selectFrom("boards").selectAll().where("slug", "=", parsed);

    if (currentId) {
        query = query.where("id", "!=", currentId);
    }

    const collision = await query.executeTakeFirst();

    if (collision) {
        return {
            available: false,
            message: "This tag is already taken.",
            selected: parsed
        }
    }

    return {
        available: true,
        message: "Tag is available.",
        selected: parsed
    }
}
