import { type Migrations } from "rwsdk/db";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/sqlite";

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
            return [
                await db.schema.alterTable("boards")
                    .addColumn("slug", "text")
                    .execute()
            ]
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
    },
    "006_add_social_accounts": {
        async up(db) {
            return [
                await db.schema
                    .createTable("socialAccounts")
                    .ifNotExists()
                    .addColumn("id", "text", (col) => col.primaryKey())
                    .addColumn("type", "text", (col) => col.notNull().defaultTo("google"))
                    .addColumn("fullName", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("firstName", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("lastName", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("email", "text", (col) => col.notNull().unique())
                    .addColumn("userId", "text", (col) => col.references("users.id"))
                    .addColumn("createdAt", "text", (col) => col.notNull())
                    .addColumn("updatedAt", "text", (col) => col.notNull())
                    .execute(),
            ];
        },
        async down(db) {
            await db.schema.dropTable("socialAccounts").ifExists().execute();
        }
    },
    "007_add_board_settings_table": {
        async up(db) {
            return [
                await db.schema
                    .createTable("boardSettings")
                    .ifNotExists()
                    .addColumn("id", "text", (col) => col.primaryKey())
                    .addColumn("boardId", "text", (col) => col.notNull().unique().references("boards.id").onDelete("cascade"))
                    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("public")) // public, private, unlisted
                    .addColumn("createdAt", "text", (col) => col.notNull())
                    .addColumn("updatedAt", "text", (col) => col.notNull())
                    .execute()
            ];
        },
        async down(db) {
            await db.schema.dropTable("boardSettings").ifExists().execute();
        }
    },
    "008_add_board_reactions": {
        async up(db) {
            return [
                await db.schema
                    .createTable("boardReactions")
                    .ifNotExists()
                    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
                    .addColumn("boardId", "text", (col) => col.notNull().references("boards.id").onDelete("cascade"))
                    .addColumn("userId", "text", (col) => col.notNull().references("users.id").onDelete("cascade"))
                    .addColumn("type", "text", (col) => col.notNull()) // 'like' | 'save'
                    .addColumn("createdAt", "text", (col) => col.notNull())
                    .addUniqueConstraint("unique_reaction", ["boardId", "userId", "type"])
                    .execute()
            ];
        },
        async down(db) {
            await db.schema.dropTable("boardReactions").ifExists().execute();
        }
    },
    "009_add_user_roles": {
        async up(db) {
            return [
                await db.schema
                    .alterTable("users")
                    .addColumn("role", "text", (col) => col.notNull().defaultTo("user"))
                    .execute()
            ];
        },
        async down(db) {
            await db.schema.alterTable("users").dropColumn("role").execute();
        }
    },
    "010_add_tags_system": {
        async up(db) {
            return [
                await db.schema
                    .createTable("tags")
                    .ifNotExists()
                    .addColumn("id", "text", (col) => col.primaryKey())
                    .addColumn("canonicalLabelEn", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("canonicalLabelFr", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("synonymsEn", "text", (col) => col.notNull().defaultTo("[]"))
                    .addColumn("synonymsFr", "text", (col) => col.notNull().defaultTo("[]"))
                    .addColumn("createdAt", "text", (col) => col.notNull())
                    .addColumn("updatedAt", "text", (col) => col.notNull())
                    .execute(),

                await db.schema
                    .createTable("boardTags")
                    .ifNotExists()
                    .addColumn("boardId", "text", (col) => col.notNull().references("boards.id").onDelete("cascade"))
                    .addColumn("tagId", "text", (col) => col.notNull().references("tags.id").onDelete("cascade"))
                    .addPrimaryKeyConstraint("boardTags_pk", ["boardId", "tagId"])
                    .execute()
            ];
        },
        async down(db) {
            await db.schema.dropTable("boardTags").ifExists().execute();
            await db.schema.dropTable("tags").ifExists().execute();
        },
    },
    "011_flattened_boards": {
        async up(db) {
            return [
                db.schema
                    .createView("boards_view")
                    .materialized()
                    .ifNotExists()
                    .as(
                        db.selectFrom("boards")
                            .selectAll()
                            .select(
                                ({ eb }) => {
                                    return [
                                        jsonObjectFrom(
                                            eb.selectFrom("users")
                                                .select(["id", "firstName", "lastName", "alias", "email", "createdAt", "updatedAt"])
                                                .whereRef("users.id", "=", "boards.userId")
                                                .limit(1)
                                        )
                                            .as("owner"),
                                        jsonObjectFrom(
                                            eb.selectFrom("boardSettings")
                                                .select(['visibility'])
                                                .whereRef("boardSettings.boardId", "=", "boards.id")
                                                .limit(1)
                                        )
                                            .as("settings"),
                                        jsonArrayFrom(
                                            eb.selectFrom("boardTags")
                                                .innerJoin("tags", "tags.id", "boardTags.tagId")
                                                .select(["tagId", "tags.canonicalLabelEn", "tags.canonicalLabelFr"])
                                                .whereRef("boardTags.boardId", "=", "boards.id")
                                        )
                                            .as("tags")
                                    ]
                                }
                            )
                    )
                    .execute()
            ]
        },
        async down(db) {
            await db.schema.dropView("boards_view").ifExists().execute();
        },
    },
    "012_add_highlighted_collections_cache": {
        async up(db) {
            return [
                await db.schema.alterTable("boards")
                .addColumn("isHighlighted", "integer", (col) => col.notNull().defaultTo(0))
                .execute()
            ];
        },
        async down(db) {
            await db.schema.alterTable("boards").dropColumn("isHighlighted").execute();
        }
    }
} satisfies Migrations;