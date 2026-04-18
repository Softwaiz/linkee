import { RequestInfo } from "rwsdk/worker";

export function requireIdentity({ ctx, response, request }: RequestInfo) {
    if (!ctx.user) {
        let url = new URL(request.url);
        let nextPath = url.pathname;
        if (nextPath.startsWith("/api")) {
            return ctx.hardRedirect({ path: "/signin" });
        }
        else {
            nextPath = `${url.pathname}${url.search}${url.hash}`;
        }
        return ctx.hardRedirect({ path: `/signin?redirect=${encodeURIComponent(nextPath)}` });
    }
}