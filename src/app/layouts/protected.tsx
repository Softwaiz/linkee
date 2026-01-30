import { LayoutProps } from "rwsdk/router";
import { AppBar } from "../components/app-bar";
import { getRequestInfo } from "rwsdk/worker";
import { SidebarProvider } from "@/components/ui/sidebar";
import { IdentityProvider } from "@/providers/identity";
import { BottomBar } from "@/components/bottom-bar";

export default async function ProtectedLayout(props: LayoutProps) {
    const { ctx, request } = getRequestInfo();

    return <SidebarProvider defaultOpen={false}>
        <IdentityProvider user={ctx.user}>
            <div className="w-full min-h-dvh">
                <AppBar user={ctx.user!} />
                <main className="pb-16">
                    {props.children}
                </main>
                <BottomBar/>
            </div>
        </IdentityProvider>
    </SidebarProvider>
}