"use server";
import { db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import { Group, LinkItem } from "@/validations/collection/create";

export async function addLinkToCollection(
    collectionId: string,
    sectionId: string | null,
    link: { url: string; title: string; description?: string; image?: string; favicon?: string },
    newSectionTitle?: string
) {
    const { ctx } = getRequestInfo();
    if (!ctx.user) {
        return { success: false, message: "Please log in first." };
    }

    const board = await db
        .selectFrom("boards")
        .selectAll()
        .where("id", "=", collectionId)
        .executeTakeFirst();

    if (!board) {
        return { success: false, message: "Collection not found." };
    }

    if (board.userId !== ctx.user.id) {
        return { success: false, message: "You cannot edit this collection." };
    }

    const nodes: Group[] = (board.nodes as unknown as Group[]) || [];

    const newLink: LinkItem = {
        id: crypto.randomUUID().replace(/-/g, "").slice(0, 13),
        type: "link",
        url: link.url,
        title: link.title || link.url,
        description: link.description || "",
        image: link.image,
        favicon: link.favicon,
    };

    if (newSectionTitle) {
        // Create a new section and add the link to it
        const newSection: Group = {
            id: crypto.randomUUID().replace(/-/g, "").slice(0, 13),
            title: newSectionTitle,
            description: "",
            items: [newLink],
        };
        nodes.push(newSection);
    } else if (sectionId) {
        // Add to existing section
        const section = nodes.find((s) => s.id === sectionId);
        if (!section) {
            return { success: false, message: "Section not found in this collection." };
        }
        section.items.push(newLink);
    } else {
        return { success: false, message: "Please select a section or create a new one." };
    }

    await db
        .updateTable("boards")
        .set({
            nodes: JSON.stringify(nodes),
            updatedAt: new Date().toISOString(),
        })
        .where("id", "=", collectionId)
        .execute();

    return {
        success: true,
        message: `Link added to collection "${board.label}"!`,
    };
}
