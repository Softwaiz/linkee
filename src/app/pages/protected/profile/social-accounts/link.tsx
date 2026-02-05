import { RequestInfo } from "rwsdk/worker";
import { SocialAccountType } from "../../../../lib/shared";
import { stringify } from "node:querystring";
import { GoogleAuth } from "@/lib/google";
import { db } from "@db/index";
import { redirect } from "../../../../../utils/sdk";
import jwt from "jsonwebtoken";
import { User } from "@db/index";
import { identityCookie } from "@cookies/index";

export async function handleGoogleConnectionWithAlreadyConnectedProfile(args: RequestInfo) {
    let { request } = args;
    let destination = new URL(request.url);
    let code = destination.searchParams.get("code");

    let accountType = SocialAccountType.GOOGLE;

    if (code) {
        let url = process.env.GOOGLE_AUTH_RETURN_URL || "/oauth/google";
        const data = await GoogleAuth.exchangeCodeForToken(url, code);
        if (data?.access_token) {
            let profile = await GoogleAuth.userInfo(data.access_token);

            let socialAccount = await db
                .selectFrom("socialAccounts")
                .selectAll()
                .where("id", "=", profile.id)
                .where("type", "=", accountType)
                .executeTakeFirst();

            if (socialAccount) {
                return redirect(args.request.url, "/home");
            }

            let userAccount: User | undefined = args.ctx.user;

            if (!args.ctx.user) {
                return redirect(args.request.url, "/signin");
            }

            socialAccount = await db
                .insertInto("socialAccounts")
                .values({
                    id: profile.id,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    fullName: profile.name,
                    type: accountType,
                    userId: userAccount?.id!,
                    email: userAccount?.email!,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
                .returningAll()
                .execute() as any;

            if (args.ctx.user) {
                return redirect(args.request.url, "/profile");
            }

            let signed = jwt.sign(
                {
                    id: userAccount?.id,
                    name: `${userAccount?.firstName} ${userAccount?.lastName}`
                },
                process.env.SIGNING_KEY!,
                {
                    expiresIn: '7d'
                }
            );

            const serialized = identityCookie.set(signed, {
                maxAge: 60 * 60 * 24 * 7,
            });

            let response = redirect(args.request.url, "/profile")
            response.headers.set('Set-Cookie', serialized);

            return response;
        }
    }

    return redirect(args.request.url, "/home");
};

export async function LinkSocialAccount(props: RequestInfo) {
    const preferredSocial = (props.params.social ?? SocialAccountType.GOOGLE) as SocialAccountType;
    let destination = new URL(props.request.url);
    let code = destination.searchParams.get("code");

    if (preferredSocial === SocialAccountType.GOOGLE && !code) {

        let authParams = stringify({
            client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
            redirect_uri: process.env.GOOGLE_CONNECT_RETURN_URL,
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

    await handleGoogleConnectionWithAlreadyConnectedProfile(props);

    return <>

    </>
}