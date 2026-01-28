import { env } from "cloudflare:workers";
import { RequestInfo } from "rwsdk/worker";

export default async function mediaResolver(params: RequestInfo) {
    let path = decodeURI(params.params.$0);
    let file = await env.R2.get(path);
    if (!file || !file.httpMetadata?.contentType) {
        return new Response("Not found", { status: 404 });
    }
    return new Response(
        file?.body,
        {
            status: 200,
            headers: {
                "Content-Type": file?.httpMetadata?.contentType,
            }
        }
    )
}