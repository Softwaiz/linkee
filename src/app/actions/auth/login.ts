"use server";
import { db } from "@db/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { getRequestInfo } from "rwsdk/worker";
import { identityCookie } from "../../../cookies";

interface LoginData {
    email: string;
    password: string;
}

export async function handleLogin(data: LoginData) {
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

    let isEqual = bcrypt.compareSync(data.password, user?.passwordHash || "");

    if (!isEqual) {
        return {
            loggedIn: false,
            message: "Wrong email or password."
        }
    }

    let signed = jwt.sign({ id: user!.id, name: `${user?.firstName} ${user?.lastName}` }, process.env.SIGNING_KEY!, { expiresIn: '7d' });

    const serialized = identityCookie.set(signed, {
        maxAge: 60 * 60 * 24 * 7,
    });

    getRequestInfo().response.headers.set("Set-Cookie", serialized);

    return {
        success: true,
        message: `Connected as ${user?.email}.`,
        redirectTo: "/app"
    }
}