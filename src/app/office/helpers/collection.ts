import { db } from "@db/index";

export class CollectionResolver {
    static getCollection(collectionId: string) {
        return db.selectFrom("boards")
            .selectAll()
            .where("id", "=", collectionId)
            .executeTakeFirst();
    }
}