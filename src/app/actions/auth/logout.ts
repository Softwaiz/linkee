"use server";

import { getRequestInfo } from "rwsdk/worker";
import { identityCookie } from "../../../cookies";
import { redirect } from "../../../utils/sdk";

export async function handleLogout() {
    const { response, request } = getRequestInfo();

    // Clear the cookie by setting it with maxAge 0
    const serialized = identityCookie.set("", {
        maxAge: 0,
        path: "/",
    });

    response.headers.set("Set-Cookie", serialized);

    return redirect(request.url, "/signin");
}
