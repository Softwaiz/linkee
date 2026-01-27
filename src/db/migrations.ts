import { type Migrations } from "rwsdk/db";

export const migrations = {
    "001_initial_schema": {
        async up(db) {
            return [
                await db.schema
                    .createTable("users")
                    .ifNotExists()
                    .addColumn("id", "text", (col) => col.primaryKey())
                    .addColumn("firstName", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("lastName", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("email", "text", (col) => col.notNull().unique())
                    .addColumn("passwordHash", "text", (col) => col.notNull())
                    .addColumn("createdAt", "text", (col) => col.notNull())
                    .addColumn("updatedAt", "text", (col) => col.notNull())
                    .execute(),

                await db.schema
                    .createTable("boards")
                    .ifNotExists()
                    .addColumn("id", "text", (col) => col.primaryKey())
                    .addColumn("label", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("description", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("userId", "text", (col) => col.notNull().references("users.id"))
                    .addColumn("nodes", "text", (col) => col.notNull().defaultTo("[]"))
                    .addColumn("createdAt", "text", (col) => col.notNull())
                    .addColumn("updatedAt", "text", (col) => col.notNull())
                    .execute()
            ];
        },

        async down(db) {
            await db.schema.dropTable("users").ifExists().execute();
            await db.schema.dropTable("boards").ifExists().execute();
        },
    },
    "002_add_alias_to_users": {
        async up(db) {
            return [
                await db.schema
                    .alterTable("users")
                    .addColumn("alias", "text")
                    .execute()
            ];
        },
        async down(db) {
            await db.schema.alterTable("users").dropColumn("alias").execute();
        }
    },
    "003_add_image_to_users": {
        async up(db) {
            return [
                await db.schema
                    .alterTable("users")
                    .addColumn("image", "text")
                    .execute()
            ];
        },
        async down(db) {
            await db.schema.alterTable("users").dropColumn("image").execute();
        }
    },
    "004_add_tags_to_collections": {
        async up(db) {
            await db.schema.alterTable("boards")
                .addColumn("slug", "text")
                .execute()
        },
        async down(db) {
            await db.schema.alterTable("boards").dropColumn("slug").execute()
        }
    },
    "005_add_collection_images": {
        async up(db) {
            return [
                await db.schema
                    .alterTable("boards")
                    .addColumn("picture", "text")
                    .execute(),
                await db.schema
                    .alterTable("boards")
                    .addColumn("banner", "text")
                    .execute(),
                await db.schema
                    .alterTable("boards")
                    .addColumn("sourceId", "text")
                    .execute()
            ];
        },
        async down(db) {
            await db.schema.alterTable("boards").dropColumn("picture").execute();
            await db.schema.alterTable("boards").dropColumn("banner").execute();
            await db.schema.alterTable("boards").dropColumn("sourceId").execute();
        }
    }
} satisfies Migrations;