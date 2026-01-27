"use server";
import { env } from "cloudflare:workers";
import { getRequestInfo } from "rwsdk/worker";

export async function uploadProfileImage(formData: FormData) {
    const { ctx } = getRequestInfo();

    if (!ctx.user) {
        return {
            success: false,
            message: "Not authenticated"
        }
    }

    const file = formData.get("file") as File;
    if (!file) {
        return {
            success: false,
            message: "No file provided"
        }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
        return {
            success: false,
            message: "Invalid file type. Please upload an image."
        }
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return {
            success: false,
            message: "File size too large. Max 5MB."
        }
    }

    try {
        const key = `users/${ctx.user.id}/${crypto.randomUUID()}-${file.name}`;
        let uploaded = await env.R2.put(key, file.stream(), {
            httpMetadata: {
                contentType: file.type,
            }
        });

        console.log("uploaded ", uploaded);

        const publicUrl = env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${key}` : key;

        return {
            success: true,
            key: key,
            url: publicUrl
        }

    } catch (e) {
        console.error("Upload error:", e);
        return {
            success: false,
            message: "Failed to upload image"
        }
    }
}


export async function uploadCollectionBanner(formData: FormData) {
    const { ctx } = getRequestInfo();

    if (!ctx.user) {
        return {
            success: false,
            message: "Not authenticated"
        }
    }

    const file = formData.get("file") as File;
    if (!file) {
        return {
            success: false,
            message: "No file provided"
        }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
        return {
            success: false,
            message: "Invalid file type. Please upload an image."
        }
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return {
            success: false,
            message: "File size too large. Max 5MB."
        }
    }

    try {
        const key = `banners/${crypto.randomUUID()}-${file.name}`;
        let uploaded = await env.R2.put(key, file.stream(), {
            httpMetadata: {
                contentType: file.type,
            }
        });

        console.log("uploaded ", uploaded);

        const publicUrl = env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${key}` : key;

        return {
            success: true,
            key: key,
            url: publicUrl
        }

    } catch (e) {
        console.error("Upload error:", e);
        return {
            success: false,
            message: "Failed to upload image"
        }
    }
}

export async function uploadCollectionPicture(formData: FormData) {
    const { ctx } = getRequestInfo();

    if (!ctx.user) {
        return {
            success: false,
            message: "Not authenticated"
        }
    }

    const file = formData.get("file") as File;
    if (!file) {
        return {
            success: false,
            message: "No file provided"
        }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
        return {
            success: false,
            message: "Invalid file type. Please upload an image."
        }
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return {
            success: false,
            message: "File size too large. Max 5MB."
        }
    }

    try {
        const key = `collections/${ctx.user.id}/${crypto.randomUUID()}-${file.name}`;
        let uploaded = await env.R2.put(key, file.stream(), {
            httpMetadata: {
                contentType: file.type,
            }
        });

        console.log("uploaded ", uploaded);

        const publicUrl = env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${key}` : key;

        return {
            success: true,
            key: key,
            url: publicUrl
        }

    } catch (e) {
        console.error("Upload error:", e);
        return {
            success: false,
            message: "Failed to upload image"
        }
    }
}

