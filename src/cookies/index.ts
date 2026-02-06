import { cookieStorage } from "./storage";

export const identityCookie = cookieStorage("identity", {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax"
});