"use server";
import { getRequestInfo } from "rwsdk/worker";
import { identityCookie } from "../../../cookies";

export async function handleLogout() {
    const { response, request, ctx } = getRequestInfo();

    // Clear the cookie by setting it with maxAge 0
    const serialized = identityCookie.set("", {
        maxAge: 0,
        path: "/",
    });

    response.headers.set("Set-Cookie", serialized);

    ctx.redirect("/signin", 302);

    return {
        success: true
    }
}
