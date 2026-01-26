"use server";
import { db } from "@db/index";
import { getRequestInfo } from "rwsdk/worker";
import jwt from "jsonwebtoken";
import { identityCookie } from "../../../cookies";

interface UpdateUserData {
    firstName: string;
    lastName: string;
    alias?: string;
    image?: string;
}

export async function updateUser(data: UpdateUserData) {
    const { ctx, response } = getRequestInfo();

    if (!ctx.user) {
        return {
            success: false,
            message: "Not authenticated"
        }
    }

    try {
        const updatedUser = await db
            .updateTable("users")
            .set({
                firstName: data.firstName,
                lastName: data.lastName,
                alias: data.alias || null,
                image: data.image || null,
                updatedAt: new Date().toISOString()
            })
            .where("id", "=", ctx.user.id)
            .returningAll()
            .executeTakeFirst();

        if (updatedUser) {
            // Update the session cookie with new name
            let signed = jwt.sign(
                { id: updatedUser.id, name: `${updatedUser.firstName} ${updatedUser.lastName}` },
                process.env.SIGNING_KEY!,
                { expiresIn: '7d' }
            );

            const serialized = identityCookie.set(signed, {
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });

            response.headers.set("Set-Cookie", serialized);

            // Revalidate to update UI
            //revalidatePath("/(protected)/(.*)");

            return {
                success: true,
                message: "Profile updated successfully"
            }
        } else {
            return {
                success: false,
                message: "Failed to update profile"
            }
        }

    } catch (e) {
        console.error("Update user error", e);
        return {
            success: false,
            message: "An error occurred while updating profile"
        }
    }
}
