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
import { identityCookie } from "./cookies";
import CreateCollectionPage from "@/pages/protected/collections/new";
import DashboardPage from "@/pages/protected/home";
import CollectionPage from "@/pages/protected/collections/single";
import EditCollectionPage from "@/pages/protected/collections/edit";
import ProfilePage from "@/pages/protected/profile";
import mediaResolver from "@/pages/media";
import PublicProfilePage from "@/pages/public/user-profile";
import PublicCollectionPage from "@/pages/public/collection";
import Sitemap from "@/pages/sitemap";
import Robots from "@/pages/robots";
import { extractMetadata } from "@/actions/website/extractMetadata";
import DiscoverPage from "@/pages/protected/discover";
import SavedCollections from "@/pages/protected/saved";
import { PublicLayout } from "@/layouts/public";
import { LinkSocialAccount } from "@/pages/protected/profile/social-accounts/link";
import { HandleGoogleLoginReturn } from "@/pages/auth/google-return";
import { SocialSignin } from "@/pages/auth/social-signin";
import { handleLogout } from "@/pages/auth/logout";
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
  }
}

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, response }) => {
    return verifyUserFromCookie(request, response, ctx);
  },
  async ({ ctx, request, response }) => {
    ctx.redirect = (path: string, statusCode: number = 302) => {
      response.status = statusCode ?? 302;
      response.headers.set('Location', path);
    }

    ctx.hardRedirect = ({ path, body, init }) => {
      const next = new Response(body ?? null, {
        ...init,
        status: 302,
        headers: {
          ...init?.headers,
          'Location': path
        }
      });
      return next;
    }
  },
  render(PublicDocument, [
    layout(PublicLayout, [
      route("/@:alias", PublicProfilePage),
      route("/shared/:id", PublicCollectionPage),
    ])
  ]),
  render(Document, [
    layout(BaseLayout, [
      route("/", Home),
      route("/signin", LoginPage),
      route("/signup", Signup),
      route("/signin/with/:social", SocialSignin),
      route("/signin/after/google", HandleGoogleLoginReturn),
      route("/logout", handleLogout),
      route("/medias/*", mediaResolver),
      route("/sitemap", Sitemap),
      route("/robots.txt", Robots),
      route("/api/metadata", extractMetadata),
      prefix("/", [
        layout(ProtectedLayout, [
          route("home", DashboardPage),
          route("discover", DiscoverPage),
          route("collections/new", CreateCollectionPage),
          route("collections/:id", CollectionPage),
          route("collections/:id/edit", EditCollectionPage),
          route("profile/connect/:social", LinkSocialAccount),
          route("profile", ProfilePage),
          route("saved", SavedCollections)
        ])
      ]),
    ])
  ])
]);
