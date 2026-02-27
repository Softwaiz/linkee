import { LayoutProps } from "rwsdk/router";
import { AppSideBar } from "../components/app-sidebar";
import { getRequestInfo } from "rwsdk/worker";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { IdentityProvider } from "@/providers/identity";
import styles from "./theme.css?url";
import { Collection, db } from "@db/index";
import { ProtectedHeader } from "./protected-header";

export default async function ProtectedLayout(props: LayoutProps) {
    const { ctx, request } = getRequestInfo();
    const url = new URL(request.url);

    if (!ctx.user) {
        let nextPath = `${url.pathname}${url.search ?? ''}${url.hash ?? ''}`;
        ctx.redirect(`/signin?redirect=${encodeURIComponent(nextPath)}`, 302);
        return <div className="w-full min-h-dvh">{props.children}</div>
    }

    let limit = 6;

    const [count, collections] = await Promise.all([
        await db
            .selectFrom("boards")
            .where("userId", "=", props.requestInfo?.ctx.user?.id ?? "")
            .select((eb) => [eb.fn.count("id").as("count")])
            .execute(),
        await db
            .selectFrom("boards")
            .select(["id", "slug", "label", "nodes"])
            .where("userId", "=", props.requestInfo?.ctx.user?.id ?? "")
            .orderBy("createdAt", "desc")
            .limit(limit)
            .execute()
    ]);

    return <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={styles} />
        <IdentityProvider user={ctx.user}>
            <SidebarProvider defaultOpen={false}>
                <div
                    style={{
                        '--sidebar-width': '280px',
                    } as any}
                    className="w-full min-h-dvh flex flex-row items-start justify-start bg-background text-foreground">
                    <div className="fixed top-0 left-0 h-dvh w-(--sidebar-width) hidden md:block">
                        <AppSideBar
                            user={ctx.user!}
                            privateCollections={collections as unknown as Pick<Collection, "id" | "slug" | "label" | "nodes">[]}
                            hasMorePrivateCollections={(count[0].count as number) > limit}
                        />
                    </div>
                    <main className="md:pl-(--sidebar-width) grow pb-16 bg-background text-foreground min-h-screen">
                        {props.children}
                    </main>
                    <Sidebar variant="floating">
                        <AppSideBar
                            user={ctx.user!}
                            privateCollections={collections as unknown as Pick<Collection, "id" | "slug" | "label" | "nodes">[]}
                            hasMorePrivateCollections={(count[0].count as number) > limit}
                        />
                    </Sidebar>
                </div>
            </SidebarProvider>
        </IdentityProvider>
    </>
}