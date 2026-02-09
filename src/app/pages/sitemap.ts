import { db } from "@db/index";
import { RequestInfo } from "rwsdk/worker";

export default async function Sitemap(params: RequestInfo) {
    const collections = await db.selectFrom("boards")
        .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
        .where("boardSettings.visibility", "=", "public")
        .select(["id", "slug"])
        .execute();

    const baseUrl = new URL(params.request.url).origin;
    const urls = collections.map(c =>
        `
<url>
    <loc>${baseUrl}/shared/${c.slug ?? c.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
</url>
    `).join("\n");

    const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
     <url>
        <loc>${baseUrl}/discover</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    ${urls}
</urlset>
`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        }
    });
}