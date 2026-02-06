import { GoogleAuth } from "@/lib/google";
import { PasswordModule } from "@/lib/password";
import { db } from "@db/index";
import { RequestInfo } from "rwsdk/worker";
import { SocialAccountType as SocialAccountType } from "@/lib/shared";
import jwt from "jsonwebtoken";
import { identityCookie } from "@cookies/index";

export async function HandleGoogleLoginReturn(args: RequestInfo) {
  let { request } = args;
  let destination = new URL(request.url);
  let code = destination.searchParams.get("code");
  let accountType = SocialAccountType.GOOGLE;

  if (!code) {
    return args.ctx.hardRedirect({
      path: "/signin"
    });
  }

  let url = process.env.GOOGLE_AUTH_RETURN_URL || "/oauth/google";
  const data = await GoogleAuth.exchangeCodeForToken(url, code);
  if (data?.access_token) {
    let profile = await GoogleAuth.userInfo(data.access_token);
    let socialAccount = await db
      .selectFrom("socialAccounts")
      .where((eb) => (eb.and([
        eb("email", "=", profile.email),
        eb("type", "=", accountType)
      ])))
      .selectAll()
      .executeTakeFirst();

    let userAccount = await db
      .selectFrom("users")
      .where("email", "=", profile.email)
      .selectAll()
      .executeTakeFirst();

    if (!userAccount) {
      userAccount = await (db
        .insertInto("users")
        .values({
          id: crypto.randomUUID(),
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          alias: profile.name.replaceAll(" ", ""),
          image: profile.picture,
          passwordHash: await PasswordModule.hash(PasswordModule.randomize(12)),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .returningAll()
        .executeTakeFirst());
    }

    if (!socialAccount) {
      socialAccount = await db
        .insertInto("socialAccounts")
        .values({
          id: crypto.randomUUID(),
          firstName: profile.given_name,
          lastName: profile.family_name,
          fullName: profile.name,
          type: accountType,
          userId: userAccount?.id!,
          email: profile?.email!,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .returningAll()
        .executeTakeFirst();
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
    const serialized = identityCookie.set(signed);
    args.ctx.user = userAccount;

    return args.ctx.hardRedirect({
      path: '/home',
      init: {
        headers: {
          'Set-Cookie': serialized
        }
      }
    })
  }


};