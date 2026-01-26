import { LayoutProps } from "rwsdk/router";
import { ProtectedHeader } from "../components/protected-header";
import { getRequestInfo } from "rwsdk/worker";
import { redirect } from "../../utils/sdk";

export default async function ProtectedLayout(props: LayoutProps) {
    const { ctx, request } = getRequestInfo();

    return <>
        <ProtectedHeader user={ctx.user!} />
        <main>
            {props.children}
        </main>
    </>
}