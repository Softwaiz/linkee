"use server";
import { db } from "@db/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getRequestInfo } from "rwsdk/worker";
import { identityCookie } from "@cookies/index";

interface LoginData {
    email: string;
    password: string;
    redirectUrl?: string;
}

export type SigninResponse = {
    loggedIn: false,
    message: "Wrong email or password."
} | {
    loggedIn: false,
    message: "Wrong email or password."
};

export async function handleLogin(data: LoginData): Promise<Response | SigninResponse> {
    let info = getRequestInfo();

    const user = await db
        .selectFrom("users")
        .selectAll()
        .where("email", "=", data.email)
        .executeTakeFirst();

    if (!user) {
        return {
            loggedIn: false,
            message: "Wrong email or password."
        }
    }

    if (!bcrypt.compareSync(data.password, user?.passwordHash || "")) {
        return {
            loggedIn: false,
            message: "Wrong email or password."
        }
    }

    let signed = jwt.sign({ id: user!.id, name: `${user?.firstName} ${user?.lastName}` }, process.env.SIGNING_KEY!, { expiresIn: '7d' });

    const serialized = identityCookie.set(signed);

    info.response.headers.set("Set-Cookie", serialized);

    if (data.redirectUrl) {
        return info.ctx.hardRedirect({path: data.redirectUrl});
    }

    return info.ctx.hardRedirect({path: "/home"});
}