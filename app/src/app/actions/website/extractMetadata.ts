import { RequestInfo } from "rwsdk/worker";

export async function extractMetadata(info: RequestInfo) {
    let body = await info.request.json() as { url: string };
    try {
        if (!body.url) {
            return Response.json({
                success: false,
                message: "URL is required"
            }, { status: 404 });
        }

        const response = await fetch(body.url, {
            headers: {
                "User-Agent": "Linkits-Metadata-Fetcher/1.0"
            }
        });

        if (!response.ok) {
            return Response.json({
                success: false,
                message: "Failed to fetch URL"
            }, { status: 404 });
        }

        const html = await response.text();

        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
        const descriptionMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
        const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) || html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);

        const iconMatch = html.match(/<link\s+rel="icon"\s+href="([^"]+)"/i) || html.match(/<link\s+rel="shortcut icon"\s+href="([^"]+)"/i);

        let title = titleMatch ? (titleMatch[1] || "") : "";
        let description = descriptionMatch ? (descriptionMatch[1] || "") : "";
        let image = imageMatch ? (imageMatch[1] || "") : "";
        let favicon = iconMatch ? (iconMatch[1] || "") : "";

        const baseUrl = new URL(body.url);
        if (favicon && !favicon.startsWith("http")) {
            favicon = new URL(favicon, baseUrl).toString();
        } else if (!favicon) {
            favicon = new URL("/favicon.ico", baseUrl).toString();
        }

        if (image && !image.startsWith("http")) {
            image = new URL(image, baseUrl).toString();
        }

        const decode = (str: string) => str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec)).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

        return Response.json({
            success: true,
            title: decode(title),
            description: decode(description),
            image,
            favicon
        }, { status: 200 });

    } catch (error) {
        console.error("Metadata extraction error:", error);
        return Response.json({
            success: false,
            message: "Failed to extract metadata"
        }, { status: 500 });
    }
}
