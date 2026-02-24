"use server";
import { SignupInput } from "@/validations/signup";
import { db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { identityCookie } from "@cookies/index";

export const handleAdminInit = async (data?: SignupInput) => {
    try {
        const info = getRequestInfo();
        const existingAdmin = await db.selectFrom("users").select("id").where("role", "=", "admin").executeTakeFirst();

        if (existingAdmin) {
            return { success: false, error: "An admin already exists." };
        }

        if (info.ctx.user) {
            // User is already logged in, upgrade them
            await db.updateTable("users")
                .set({ role: "admin", updatedAt: new Date().toISOString() })
                .where("id", "=", info.ctx.user.id)
                .execute();
            return info.ctx.hardRedirect({ path: '/office' });
        }

        if (!data) {
            return { success: false, error: "Missing data." };
        }

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
                role: "admin",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .returningAll()
            .executeTakeFirst();

        let signed = jwt.sign({ id: newUser!.id, name: `${newUser?.firstName} ${newUser?.lastName}` }, process.env.SIGNING_KEY!, { expiresIn: '7d' });
        const serialized = identityCookie.set(signed);

        return info.ctx.hardRedirect({
            path: '/office',
            init: {
                status: 302,
                headers: {
                    'Set-Cookie': serialized,
                }
            }
        });

    } catch (err) {
        console.error("Admin init error: ", err);
        return {
            success: false,
            error: "An error occurred during admin init. Please try again later."
        }
    }
}
