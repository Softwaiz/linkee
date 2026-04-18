import { LayoutProps } from "rwsdk/router";
import { getRequestInfo } from "rwsdk/worker";

export default async function PreventReauthentication(props: LayoutProps) {
    const { ctx, request } = getRequestInfo();

    if (ctx.user) {
        let redirectTo = decodeURIComponent(new URL(request.url).searchParams.get('redirect') ?? '/home');
        ctx.redirect(redirectTo);
        return <div className="w-full min-h-dvh">{props.children}</div>
    }

    return <div className="w-full min-h-dvh">
        {props.children}
    </div>
}