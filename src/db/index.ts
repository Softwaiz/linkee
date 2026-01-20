import { createDb, Database } from "rwsdk/db";
import { migrations } from "./migrations";
import { env } from "cloudflare:workers";

export type AppDatabase = Database<typeof migrations>;

export const db = createDb<AppDatabase>(
    env.DB,
    "linkee"
)