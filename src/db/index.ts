import { createDb, Database } from "rwsdk/db";
import { migrations } from "./migrations";
import { env } from "cloudflare:workers";

export type AppDatabase = Database<typeof migrations>;
export type User = AppDatabase['users'];
export type SocialAccount = AppDatabase['socialAccounts'];
export type CollectionSettings = AppDatabase['boardSettings'];
export type CollectionReaction = AppDatabase['boardReactions'];
export type Tag = AppDatabase['tags'];
export type BoardTag = AppDatabase['boardTags'];
export const db = createDb<AppDatabase>(env.DATABASE);