import { LayoutProps } from "rwsdk/router";
import { ProtectedHeader } from "../components/protected-header";
import { getRequestInfo } from "rwsdk/worker";
import { SidebarProvider } from "@/components/ui/sidebar";
import { IdentityProvider } from "@/providers/identity";

export default async function ProtectedLayout(props: LayoutProps) {
    const { ctx, request } = getRequestInfo();

    return <SidebarProvider defaultOpen={false}>
        <IdentityProvider user={ctx.user}>
            <div className="w-full min-h-dvh">
                <ProtectedHeader user={ctx.user!} />
                <main>
                    {props.children}
                </main>
            </div>
        </IdentityProvider>
    </SidebarProvider>
}