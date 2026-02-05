import { GoogleAuth } from "@/lib/google";
import { PasswordModule } from "@/lib/password";
import { db } from "@db/index";
import { RequestInfo } from "rwsdk/worker";
import { SocialAccountType as SocialAccountType } from "../../lib/shared";
import jwt from "jsonwebtoken";
import { identityCookie } from "@cookies/index";
import { redirect } from "../../../utils/sdk";

export async function HandleGoogleLoginReturn(args: RequestInfo) {
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

      let userAccount = await db
        .selectFrom("users")
        .where("email", "=", profile.email)
        .selectAll()
        .executeTakeFirst();

      if (!socialAccount) {
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
      }

      if (!userAccount) {
        userAccount = await (db
          .insertInto("users")
          .values({
            id: crypto.randomUUID(),
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            alias: profile.name.replaceAll(" ", ""),
            image: JSON.parse(profile.picture ?? '{}')?.url,
            passwordHash: PasswordModule.randomize(12),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .returningAll()
          .execute() as Promise<any>);
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

      let nextUrl = new URL(args.request.url);
      nextUrl.pathname = "/signin";
      nextUrl.hash = '';
      nextUrl.search = '';

      console.log("next: ", nextUrl.toString());
      args.ctx.user = userAccount;
      console.log("redirecting now !")

      /*args.response.status = 302;
      args.response.headers = new Headers({
        'Set-Cookie': serialized,
        'Location': nextUrl.toString()
      });*/

      args.response.headers.set('Set-Cookie', serialized);
      args.response.status = 200;

      return new Response("Ok bro", args.response);

      /*return new Response(
        "ok bro",
        {
          //status: 302,
          status: 200,
          headers: {
            'Set-Cookie': serialized,
          }
        }
      )*/

    }
  }

  console.log("redirecting to home");
  return redirect(args.request.url, "/home");
};