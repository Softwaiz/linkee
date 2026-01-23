import { RequestInfo } from "rwsdk/worker";
import { redirect } from "../../utils/sdk";

export function requireIdentity({ ctx, response, request }: RequestInfo) {
    if (!ctx.user) {
        return redirect(request.url, "/signin");
    }
}