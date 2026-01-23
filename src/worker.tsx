import { layout, prefix, render, route } from "rwsdk/router";
import { DefaultAppContext, defineApp } from "rwsdk/worker";
import { Document } from "@/Document";
import { setCommonHeaders } from "@/headers";
import LoginPage from "@/pages/auth/signin";
import Home from "@/pages/landing/home";
import Signup from "@/pages/auth/signup";
import BaseLayout from "@/layouts/base";
import * as cookie from "cookie";
import { db } from "@db/index";
import jwt from "jsonwebtoken";
import AppHomePage from "@/pages/protected/app";
import ProtectedLayout from "@/layouts/protected";
import { requireIdentity } from "@/middlewares/authentication";
export { Database } from "@db/durableObject";

async function verifyUserFromCookie(request: Request, ctx: DefaultAppContext) {
  try {
    const identityCookie = cookie.parse(request.headers.get("cookie") || '').identity;
    if (!identityCookie) {
      return;
    }
    let parsed = jwt.verify(identityCookie, process.env.SIGNING_KEY!) as { id: string; name: string; email: string; };

    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", parsed.id)
      .executeTakeFirst();

    if (user) {
      ctx.user = user;
    }
  }
  catch (err) {
    console.log("Error verifying user from cookie:", err);
  }
}

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, response }) => {
    await verifyUserFromCookie(request, ctx);
  },
  render(Document, [
    layout(BaseLayout, [
      route("/", Home),
      route("/signin", LoginPage),
      route("/signup", Signup),

      prefix("/app",
        [
          layout(ProtectedLayout, [
            route("/", [requireIdentity,AppHomePage])
          ])
        ])
    ])
  ]),
]);
