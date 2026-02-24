import { RequestInfo } from "rwsdk/worker";
import AdminInitContent from "./content";
import { db } from "@db/index";

export default async function AdminInitPage(props: RequestInfo) {
    const hasAdmin = await db.selectFrom("users").select("id").where("role", "=", "admin").executeTakeFirst();

    if (hasAdmin) {
        props.ctx.redirect("/office/signin", 302);
        return <div className="w-full min-h-dvh"></div>
    }

    return (
        <>
            <title>Initialize Admin - Linkits</title>
            <meta name="description" content="Set up the first admin account on Linkits" />
            <AdminInitContent user={props.ctx.user} />
        </>
    );
}
