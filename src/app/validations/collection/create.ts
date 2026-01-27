import z from "zod";

const LinkSchema = z.object({
    id: z.string(),
    type: z.enum(['link']),
    url: z.url(),
    title: z.string(),
    description: z.string().optional().default(""),
    favicon: z.string().optional(),
    image: z.string().optional()
});
export type LinkItem = z.infer<typeof LinkSchema>;

const TextSchema = z.object({
    id: z.string(),
    type: z.enum(['text']),
    content: z.string()
});
export type TextItem = z.infer<typeof TextSchema>;

const GroupItem = TextSchema.or(LinkSchema);
export type GroupItem = z.infer<typeof GroupItem>;

const GroupSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional().default(""),
    items: z.array(GroupItem)
})
export type Group = z.infer<typeof GroupSchema>;

export const CreateCollectionSchema = z.object({
    id: z.string().optional(),
    label: z.string(),
    description: z.string().optional().default(""),
    slug: z.string().optional(),
    nodes: z.array(GroupSchema),
});

export type CollectionInput = z.infer<typeof CreateCollectionSchema>;

