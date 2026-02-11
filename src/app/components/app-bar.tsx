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
import { LogOut, User as UserIcon, ChevronDown, Search, Lightbulb, Home, SquareStack } from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Logo } from "./logo";
import { useWindowLocation } from "@/hooks/useWindowLocation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { navigate } from "rwsdk/client";
import { Link } from "./link";
import { useDebounce } from "@/hooks/useDebounce";

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
    initialQuery?: string;
    search?: React.ReactNode;
}

export function AppBar({ initialQuery, user, search }: ProtectedHeaderProps) {
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const sidebar = useSidebar();

    const dicebearUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/initials/svg?seed=${user?.firstName[0]}${user?.lastName[0]}`;
    }, [user?.firstName, user?.lastName]);

    const displayImage = useMemo(() => {
        return user?.image ?? dicebearUrl;
    }, [user?.image, dicebearUrl]);

    return (
        <section className="w-full flex flex-col items-start justify-start">
            <header className="hidden lg:flex min-h-16 w-full flex-col items-center justify-center border-b bg-primary-950 text-primary-100 backdrop-blur-lg">
                <div className="container mx-auto flex h-14 items-center justify-between gap-2">
                    <div className="mr-4 flex">
                        <a className="mr-6 flex items-center space-x-2" href="/home">
                            <Logo />
                            <span className="font-bold inline-block">Linkee</span>
                        </a>
                    </div>
                    <div id="home-search-container" className="h-full grow flex flex-col items-center justify-center">
                        {search}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Button size="sm" variant="ghost" asChild>
                            <Link title="Go to home" href="/home">
                                <Home />
                                Home
                            </Link>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                            <Link title="Discover new collections" href="/discover">
                                <Lightbulb />
                                Discover
                            </Link>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                            <Link title="Create your collection" href="/collections/new">
                                <SquareStack />
                                Create yours
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-auto px-2 flex items-center gap-2">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-muted border border-border">
                                        <img src={displayImage} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm font-medium hidden md:inline-block">
                                        {user.alias || `${user.firstName} ${user.lastName}`}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link title="View my profile" href="/profile" className="flex items-center cursor-pointer">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)} className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <LogoutDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} />

            <Sidebar className="bg-neutral-100" collapsible="offcanvas" variant="floating" side="left">
                <SidebarHeader>
                    <div className="flex flex-row items-center justify-start gap-2">
                        <Logo />
                        <span>Linkee</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem
                                onClick={() => {
                                    sidebar.setOpenMobile(false);
                                    navigate("/home");
                                }}>
                                <SidebarMenuButton>
                                    <Home />
                                    Home
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem
                                onClick={() => {
                                    sidebar.setOpenMobile(false);
                                    navigate("/discover");
                                }}>
                                <SidebarMenuButton>
                                    <Lightbulb />
                                    Discover
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenuItem className="flex flex-row items-center justify-start gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="w-full flex flex-row items-center justify-center px-4">
                                    <img
                                        className="size-10 object-cover"
                                        src={displayImage}
                                        alt={`${user?.firstName} ${user?.lastName}`}
                                    />
                                    <div className="grow flex flex-col items-start justify-start">
                                        <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                                        <span className="text-xs opacity-75">{user?.email}</span>
                                    </div>
                                    <div>
                                        <ChevronDown />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        My Profile
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarFooter>
            </Sidebar >
        </section>
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
