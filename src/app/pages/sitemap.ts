import { env } from "cloudflare:workers";
import { db } from "@db/index";
import { RequestInfo } from "rwsdk/worker";

export default async function Sitemap(params: RequestInfo) {
    const collections = await db.selectFrom("boards")
        .select("id")
        // We might want to filter for public collections only if there's a visibility flag.
        // For now, assuming all boards are potentially shareable if they have an ID.
        // In a real scenario, we should check for a 'public' flag or similar if it existed.
        // Based on current schema, we don't have a specific visibility flag, 
        // but the requirements imply listing "all the collection we have".
        .execute();

    const baseUrl = new URL(params.request.url).origin;

    const urls = collections.map(c => `
    <url>
        <loc>${baseUrl}/shared/${c.slug ?? c.id}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    `).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/discover</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    ${urls}
</urlset>`;

    console.log(baseUrl);

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600"
        }
    });
}
