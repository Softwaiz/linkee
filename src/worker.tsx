import { render, route } from "rwsdk/router";
import { DefaultAppContext, defineApp, RequestInfo } from "rwsdk/worker";
import { Document } from "@/Document";
import { setCommonHeaders } from "@/headers";
import LoginPage from "@pages/login";
import Home from "@/pages/landing/home";
export { Database } from "@db/durableObject";


export default defineApp([
  setCommonHeaders(),
  ({ ctx, request, response }) => {
  },
  render(Document, [
    route("/", Home),
    route("/login", LoginPage)
  ]),
]);
