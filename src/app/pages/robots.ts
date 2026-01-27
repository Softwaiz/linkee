import { RequestInfo } from "rwsdk/worker";

export default async function Robots(params: RequestInfo) {
    const baseUrl = new URL(params.request.url).origin;

    const robotsTxt = `User-agent: *
Disallow: /home
Disallow: /collections
Disallow: /profile
Allow: /

Sitemap: ${baseUrl}/sitemap`;

    return new Response(robotsTxt, {
        headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=3600"
        }
    });
}
