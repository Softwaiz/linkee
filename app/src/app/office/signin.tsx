import SigninContent from "@/pages/auth/signin/content";
import { db } from "@db/index";
import { RequestInfo } from "rwsdk/worker";

export default async function OfficeSignin(props: RequestInfo) {
    const url = new URL(props.request.url);
    let redirectTo = decodeURIComponent(url.searchParams.get('redirect') ?? '/office');
    const hasAdmin = await db.selectFrom("users").select("id").where("role", "=", "admin").executeTakeFirst();

    if (!hasAdmin) {
        props.ctx.redirect("/office/init", 302);
        return <div className="w-full min-h-dvh"></div>
    }

    return (
        <>
            <title>Sign into your Admin Account - Linkits Office</title>
            <meta name="description" content="Sign into your Linkits Office admin account." />
            <SigninContent redirect={redirectTo} />
        </>
    );
};
