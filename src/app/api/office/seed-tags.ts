import { RequestInfo } from "rwsdk/worker";
import tags from "../../../seeds/tags-1.json";
import { db } from "@db/index";

export async function seedTags(info: RequestInfo) {
    let count = 0;
    await Promise.all(tags.map(async (tag) => {
        await db
            .insertInto("tags")
            .values({
                id: tag.id,
                canonicalLabelEn: tag.canonical_label_en,
                canonicalLabelFr: tag.canonical_label_fr,
                synonymsEn: JSON.stringify(tag.synonyms_en),
                synonymsFr: JSON.stringify(tag.synonyms_fr),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .execute();
        count += 1;
    }));

    return Response.json({ success: true, message: `Seeded ${count} tags` });
}