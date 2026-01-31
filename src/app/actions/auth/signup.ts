"use server";
import { SignupInput } from "@/validations/signup";
import { db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { identityCookie } from "../../../cookies";
import { redirect } from "../../../utils/sdk";

export const handleSignup = async (data: SignupInput) => {
    try {
        const user = await db.selectFrom("users").selectAll().where("email", "=", data.email).executeTakeFirst();
        if (user) {
            return {
                success: false,
                error: "Please use another email address."
            }
        }

        let hashedPassword = await bcrypt.hash(data.password, parseInt(process.env.WORK_FACTOR));
        const newUser = await db
            .insertInto("users")
            .values({
                id: crypto.randomUUID(),
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                passwordHash: hashedPassword,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .returningAll()
            .executeTakeFirst();

        let signed = jwt.sign({ id: newUser!.id, name: `${newUser?.firstName} ${newUser?.lastName}` }, process.env.SIGNING_KEY!, { expiresIn: '7d' });

        const serialized = identityCookie.set(signed, {
            maxAge: 60 * 60 * 24 * 7,
        });

        getRequestInfo().response.headers.set("Set-Cookie", serialized);

        return {
            success: true,
            message: `You can now access Linkee as ${newUser?.email}.`,
            redirectTo: "/home"
        }
    } catch (err) {
        console.error("Signup error: ", err);
        return {
            success: false,
            error: "An error occurred during signup. Please try again later."
        }
    }
}