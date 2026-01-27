import { Group } from "@/validations/collection/create";

declare module "@db/index" {
    export interface Collection extends Omit<AppDatabase['boards'], 'nodes'> {
        nodes: Group[];
        /**
         * The original collection this collection is duplicated from
         */
        sourceId?: string;
    }
}