import { layout, prefix, render, route } from "rwsdk/router";
import { DefaultAppContext, defineApp, RequestInfo } from "rwsdk/worker";
import { Document } from "@/Document";
import { PublicDocument } from "@/PublicDocument";
import { setCommonHeaders } from "@/headers";
import LoginPage from "@/pages/auth/signin";
import Home from "@/pages/landing/home";
import Signup from "@/pages/auth/signup";
import BaseLayout from "@/layouts/base";
import { db } from "@db/index";
import jwt from "jsonwebtoken";
import ProtectedLayout from "@/layouts/protected";
import { requireIdentity } from "@/middlewares/authentication";
import { identityCookie } from "./cookies";
import CreateCollectionPage from "@/pages/protected/collections/new";
import DashboardPage from "@/pages/protected/app";
import CollectionPage from "@/pages/protected/collections/single";
import EditCollectionPage from "@/pages/protected/collections/edit";
import ProfilePage from "@/pages/protected/profile";
import mediaResolver from "@/pages/media";
import PublicProfilePage from "@/pages/@/single";
import PublicCollectionPage from "@/pages/shared/single";
import Sitemap from "@/pages/sitemap";
import Robots from "@/pages/robots";
export { Database } from "@db/durableObject";


async function verifyUserFromCookie(request: Request, response: RequestInfo['response'], ctx: DefaultAppContext) {
  try {
    const token = identityCookie.get(request.headers);
    if (!token) {
      return;
    }
    let parsed = jwt.verify(token, process.env.SIGNING_KEY!) as { id: string; name: string; email: string; };

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
  finally {
    console.log(ctx.user?.id);
  }
}

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, response }) => {
    return verifyUserFromCookie(request, response, ctx);
  },
  render(PublicDocument, [
    route("/@:alias", PublicProfilePage),
    route("/shared/:id", PublicCollectionPage),
  ]),
  render(Document, [
    layout(BaseLayout, [

      route("/", Home),
      route("/signin", LoginPage),
      route("/signup", Signup),
      route("/medias/*", mediaResolver),
      route("/sitemap", Sitemap),
      route("/robots.txt", Robots),
      prefix("/", [
        requireIdentity,
        layout(ProtectedLayout, [
          route("home", [DashboardPage]),
          route("collections/new", [CreateCollectionPage]),
          route("collections/:id", [CollectionPage]),
          route("collections/:id/edit", [(props: RequestInfo) => <EditCollectionPage id={props.params.id} />]),
          route("profile", ProfilePage),
        ])
      ]),
    ])
  ])
]);
