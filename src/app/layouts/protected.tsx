import { LayoutProps } from "rwsdk/router";
import { AppBar } from "../components/app-bar";
import { getRequestInfo } from "rwsdk/worker";
import { SidebarProvider } from "@/components/ui/sidebar";
import { IdentityProvider } from "@/providers/identity";
import { BottomBar } from "@/components/bottom-bar";
import styles from "./theme.css?url";
import { SearchQuery } from "@/components/search/query";
import { SearchLayout } from "@/components/search/layout";

export default async function ProtectedLayout(props: LayoutProps) {
    const { ctx, request } = getRequestInfo();
    const url = new URL(request.url);

    if (!ctx.user) {
        let nextPath = `${url.pathname}${url.search ?? ''}${url.hash ?? ''}`;
        ctx.redirect(`/signin?redirect=${encodeURIComponent(nextPath)}`, 302);
        return <div className="w-full min-h-dvh">{props.children}</div>
    }

    const searchQuery = url.searchParams.get("q") ?? '';

    return <SidebarProvider defaultOpen={false}>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={styles} />

        <IdentityProvider user={ctx.user}>
            <div className="w-full min-h-dvh">
                <AppBar
                    initialQuery={searchQuery}
                    user={ctx.user!}
                    search={
                        <SearchLayout initialQuery={searchQuery}>
                            <SearchQuery query={searchQuery} />
                        </SearchLayout>
                    }
                />
                <main className="pb-16">
                    {props.children}
                </main>
                <BottomBar />
            </div>
        </IdentityProvider>
    </SidebarProvider >
}