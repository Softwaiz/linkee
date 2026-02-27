"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LogOut, User as UserIcon, ChevronDown, Lightbulb, Home, SquareStack, Plus, ChevronRight, Group, Layers2, Link2, Layers3, ChartNoAxesColumnIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Logo } from "./logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { navigate } from "rwsdk/client";
import { Link } from "./link";
import { Collection } from "@db/index";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    alias?: string | null;
    image?: string | null;
}

interface ProtectedHeaderProps {
    user: User;
    privateCollections: Pick<Collection, "id" | "slug" | "label" | "nodes">[];
    hasMorePrivateCollections: boolean;
}

export function AppSideBar({ user, privateCollections, hasMorePrivateCollections }: ProtectedHeaderProps) {
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const sidebar = useSidebar();

    const dicebearUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/initials/svg?seed=${user?.firstName[0]}${user?.lastName[0]}`;
    }, [user?.firstName, user?.lastName]);

    const displayImage = useMemo(() => {
        return user?.image ?? dicebearUrl;
    }, [user?.image, dicebearUrl]);

    return (
        <>
            <aside className="w-full h-full flex flex-col items-center justify-center border-b bg-sidebar text-sidebar-foreground backdrop-blur-lg">
                <div className="w-full flex px-2 py-1.5">
                    <a className="flex items-center space-x-2" href="/home">
                        <Logo />
                        <span className="font-bold inline-block">Linkits</span>
                    </a>
                </div>
                <hr className="w-full border-sidebar-divider" />
                <div className="w-full grow flex flex-col items-start justify-start gap-2 p-2">
                    <div className="w-full grow flex flex-col items-start justify-start gap-1">
                        <Button
                            className="w-full justify-start hover:bg-secondary-500 hover:text-secondary-100"
                            variant="sidebar-card"
                            asChild>
                            <Link
                                title="Go to home"
                                href="/home"
                                onClick={() => sidebar.setOpenMobile(false)}>
                                <Home />
                                Home
                            </Link>
                        </Button>
                        <Button
                            className="w-full justify-start hover:bg-secondary-500 hover:text-secondary-100"
                            variant="sidebar-card"
                            asChild>
                            <Link
                                title="Discover new collections"
                                href="/discover"
                                onClick={() => sidebar.setOpenMobile(false)}>
                                <Lightbulb />
                                Discover
                            </Link>
                        </Button>
                    </div>
                    <div className="w-full rounded-md bg-sidebar-card text-sidebar-card-foreground shadow-sm flex flex-col items-start justify-start gap-1">
                        <div className="w-full px-2 py-2 flex flex-row items-center justify-start gap-1">
                            <div className="grow flex flex-row items-center justify-start gap-1">
                                <SquareStack className="w-4 h-4" />
                                <h1 className="text-xs font-medium">Your collections</h1>
                            </div>
                            {hasMorePrivateCollections && <button className="text-xs text-sidebar-primary underline">
                                View all
                            </button>}
                        </div>
                        <div className="w-full flex flex-col items-start justify-start">
                            {
                                privateCollections.map((item) => {
                                    const topicCount = item.nodes.length;
                                    const linkCount = item.nodes.reduce((acc, node) => acc + node.items?.length, 0);

                                    return <Link
                                        key={item.id}
                                        href={`/collections/${item.slug || item.id}`}
                                        className="w-full px-2 py-1.5 flex flex-row items-center justify-between cursor-pointer transition-all duration-150 hover:bg-sidebar-primary/10 hover:text-sidebar-primary-foreground gap-2">
                                        <div className="grow flex flex-col items-start justify-start overflow-hidden">
                                            <span className="truncate text-nowrap text-sm font-medium">{item.label}</span>
                                            <div className="opacity-75 gap-1">
                                                <p className="text-xs">
                                                    <b>{topicCount}</b> <Layers3 className="inline size-3" /> | <b>{linkCount}</b> <Link2 className="inline size-3" />
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="size-4" />
                                    </Link>
                                })
                            }
                        </div>
                        <div className="w-full px-1 py-1.5">
                            <Button className="w-full justify-start" variant="default" asChild>
                                <Link title="Create new collection" href="/collections/new">
                                    <Plus />
                                    Create new
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
                <hr className="w-full border-sidebar-divider" />
                <div className="w-full flex items-center gap-2 p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="sidebar-card" className="h-8 w-full px-2 flex items-center gap-2 cursor-pointer hover:bg-background-600">
                                <div className="flex items-center justify-start w-6 h-6 rounded-full overflow-hidden bg-muted border border-border">
                                    <img src={displayImage} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <span className="grow text-left text-xs font-medium">
                                    {user.alias || `${user.firstName} ${user.lastName}`}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    title="View my profile"
                                    href="/profile"
                                    className="flex items-center cursor-pointer"
                                    onClick={() => sidebar.setOpenMobile(false)}>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    sidebar.setOpenMobile(false);
                                    setLogoutDialogOpen(true);
                                }}
                                className="text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
            <LogoutDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} />
        </>
    );
}

function LogoutDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {

    const [isPending, setPending] = useState(false);

    const onConfirm = useCallback(() => {
        setPending(true);
        navigate("/logout");
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to log out?</DialogTitle>
                    <DialogDescription>
                        You will be redirected to the login page.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
                        {isPending ? "Logging out..." : "Log out"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
