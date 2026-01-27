import { createDb, Database } from "rwsdk/db";
import { migrations } from "./migrations";
import { env } from "cloudflare:workers";

export type AppDatabase = Database<typeof migrations>;
export type User = AppDatabase['users'];
export type Collection = AppDatabase['boards'];

export const db = createDb<AppDatabase>(env.DATABASE);