import { type Migrations } from "rwsdk/db";

export const migrations = {
    "001_initial_schema": {
        async up(db) {
            return [
                await db.schema
                    .createTable("users")
                    .addColumn("id", "text", (col) => col.primaryKey())
                    .addColumn("firstName", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("lastName", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("createdAt", "text", (col) => col.notNull())
                    .addColumn("updatedAt", "text", (col) => col.notNull())
                    .execute(),

                await db.schema
                    .createTable("boards")
                    .addColumn("id", "text", (col) => col.primaryKey())
                    .addColumn("label", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("description", "text", (col) => col.notNull().defaultTo(""))
                    .addColumn("userId", "text", (col) => col.notNull().references("users.id"))
                    .addColumn("nodes", "JSONB", (col) => col.notNull().defaultTo("[]"))
                    .addColumn("createdAt", "text", (col) => col.notNull())
                    .addColumn("updatedAt", "text", (col) => col.notNull())
                    .execute(),
            ];
        },

        async down(db) {

        },
    },
} satisfies Migrations;