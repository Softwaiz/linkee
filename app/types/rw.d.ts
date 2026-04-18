import type { AppContext } from "../src/worker";
import { User } from "@db/index";

declare module "rwsdk/worker" {
  interface DefaultAppContext extends AppContext {
    user?: User;
    redirect(path: string, status?: number): void;
    hardRedirect(args: { path: string, body?: BodyInit, init?: ResponseInit}): Response;
  }
  export type App = typeof import("../src/worker").default;
}