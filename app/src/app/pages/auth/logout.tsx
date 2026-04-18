"use server";
import { getRequestInfo, RequestInfo, serverAction } from "rwsdk/worker";
import { identityCookie } from "@cookies/index";

export const handleLogout = async (params: RequestInfo) => {

    const serialized = identityCookie.set("unset", {
        maxAge: 0,
        path: "/",
    });

    return params.ctx.hardRedirect({
        path: "/signin",
        init: {
            headers: {
                'Set-Cookie': serialized
            }
        }
    });
}