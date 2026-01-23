import { db } from "@db/index";
import { DefaultAppContext, RequestInfo } from "rwsdk/worker";

export const handleLogin = async ({request}: RequestInfo<any,DefaultAppContext>) => {
    const body = await request.json() as { email: string; password: string };
    const user = await db.selectFrom("users").where("email", "=", body.email).executeTakeFirst();
    if(user) {
        return Response.json({
            message: "Connecté en tant que " + user
        });
    }
    return Response.json({
        error: "Email ou mot de passe invalide."
    });
}