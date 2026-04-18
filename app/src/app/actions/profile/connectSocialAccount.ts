"use server";
import { getRequestInfo, serverAction } from "rwsdk/worker";
import { SocialAccountType } from "../../lib/shared";

export const connectSocialAccount = serverAction(async (platform: SocialAccountType) => {
    const { request, ctx } = getRequestInfo();
    console.log(platform);
    if (platform === SocialAccountType.GOOGLE) {
        let nextPath = `/social/link?preferred=${platform}`;
        //ctx.redirect(nextPath);
        return {
            success: true,
            message: "Using Google authentication mechanism"
        }
    }

    return {
        success: false,
        message: "Social platform unknown. Please use google or discord."
    }
})