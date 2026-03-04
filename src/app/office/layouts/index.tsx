import { LayoutProps } from "rwsdk/router";
import { getRequestInfo } from "rwsdk/worker";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider } from "@/components/ui/sidebar";
import { Layers, Users } from "lucide-react";
import { WrappedToaster } from "@/toaster";

export function Appbar() {
    return <Sidebar>
        <SidebarHeader>
            <h1 className="text-lg font-bold px-2">Linkits</h1>
            <span className="text-xs text-foreground/60 px-2">Admin Panel</span>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/office/users">
                                    <Users className="size-4" />
                                    <span>Users</span>
                                </a>
                            </SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <a href="/office/users?filter=has_collection">With collections</a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <a href="/office/users?filter=no_collection">Without collections</a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/office/kits">
                                    <Layers className="size-4" />
                                    <span>Collections</span>
                                </a>
                            </SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <a href="/office/kits?filter=private">Private</a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <a href="/office/kits?filter=public">Public</a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <a href="/office/kits?filter=unlisted">Unlisted</a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <a href="/office/kits/highlighted">Highlighted</a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/office/tags">
                                    <Layers className="size-4" />
                                    <span>Tags</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
}

export default async function OfficeLayout(props: LayoutProps) {
    const { ctx, request } = getRequestInfo();
    const url = new URL(request.url);
    const path = url.pathname;

    if (!ctx.user || ctx.user.role !== "admin") {
        ctx.redirect(`/office/signin?redirect=${encodeURIComponent(path + url.search + url.hash)}`, 302);
        return <div className="w-full min-h-dvh">{props.children}</div>
    }

    return (
        <SidebarProvider>
            <Appbar />
            <div className="w-full min-h-dvh bg-gray-50 flex flex-col">
                {props.children}
            </div>
            <WrappedToaster position="bottom-right" />
        </SidebarProvider>
    );
}
