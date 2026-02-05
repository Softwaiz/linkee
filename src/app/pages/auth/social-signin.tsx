import { RequestInfo } from "rwsdk/worker";
import { stringify } from "node:querystring";
import { SocialAccountType } from "@/lib/shared";

export async function SocialSignin(props: RequestInfo) {
    const preferredSocial = props.params.social as SocialAccountType ?? SocialAccountType.GOOGLE;

    if (preferredSocial === SocialAccountType.GOOGLE) {

        let authParams = stringify({
            client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
            redirect_uri: process.env.GOOGLE_AUTH_RETURN_URL,
            scope: [
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile",
            ].join(" "),
            response_type: "code",
            access_type: "offline",
            prompt: "consent",
        });

        const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams}`;

        return Response.redirect(googleLoginUrl, 302);
    }

    return <>
    
    </>
}