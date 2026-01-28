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
import { LogOut, User as UserIcon, ChevronDown, Search, Lightbulb, Home, SquareStack, Menu } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { handleLogout } from "../actions/auth/logout";
import { Input } from "./ui/input";
import { Logo } from "./logo";
import { useWindowLocation } from "@/hooks/useWindowLocation";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { navigate } from "rwsdk/client";
import { useIdentity } from "@/providers/identity";

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
}

export function ProtectedHeader({ user }: ProtectedHeaderProps) {
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryDraft, setSearchQueryDraft] = useState('');


    const location = useWindowLocation();

    const handleSearchChange = (query: string) => {
        setSearchQueryDraft(query);
    };

    const handleSearchSubmit = () => {
        setSearchQuery(searchQueryDraft);
    };

    const timerRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            handleSearchSubmit();
        }, 2500);
    }, [searchQueryDraft]);

    const dicebearUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName[0]}${user.lastName[0]}`;
    }, [user.firstName, user.lastName]);

    const displayImage = useMemo(() => {
        return user.image ?? dicebearUrl;
    }, [user.image, dicebearUrl]);

    const sidebar = useSidebar();

    return (
        <section className="w-full flex flex-col items-start justify-start">
            <header className="hidden lg:flex min-h-20 w-full flex-col items-center justify-center border-b bg-primary-950 text-primary-100 backdrop-blur-lg">
                <div className="container mx-auto flex h-14 items-center justify-between gap-2">
                    <div className="mr-4 flex">
                        <a className="mr-6 flex items-center space-x-2" href="/home">
                            <Logo />
                            <span className="font-bold inline-block">Linkee</span>
                        </a>
                    </div>
                    <div className="flex items-center justify-center gap-3 grow">
                        <div className="relative w-full max-w-2/3 text-muted">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder="Search collections..."
                                value={searchQueryDraft}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full border-0 bg-muted/10 pl-9 focus:bg-background placeholder:text-inherit"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Button size="sm" variant="ghost" asChild>
                            <a title="Go to home" href="/home">
                                <Home />
                                Home
                            </a>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                            <a title="Discover new collections" href="/discover">
                                <Lightbulb />
                                Discover
                            </a>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                            <a title="Create your collection" href="/collections/new">
                                <SquareStack />
                                Create yours
                            </a>
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
                                    <a title="View my profile" href="/profile" className="flex items-center cursor-pointer">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </a>
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

            <header className="sticky top-0 left-0 z-50 w-full min-h-14 border-b bg-primary-900 text-primary-50 backdrop-blur-lg px-2 py-2 flex lg:hidden flex-row items-center justify-start gap-2">
                <button
                    onClick={() => {
                        sidebar.setOpenMobile(true);
                    }}
                    className="aspect-square p-1.5 rounded-md flex flex-col items-start justify-center gap-1.5">
                    <span className="h-0.5 w-6 rounded-lg bg-primary-200"></span>
                    <span className="h-0.5 w-4 rounded-lg bg-primary-50"></span>
                    <span className="h-0.5 w-8 rounded-lg bg-neutral-100"></span>
                </button>

                <div className="grow flex flex-col items-start justify-start gap-1">
                    <AnimatePresence>
                        <motion.a
                            key="header.home"
                            href="/home"
                            className="inline-flex flex-row items-center justify-start gap-2">
                            <span className="text-base font-heading">
                                Linkee
                            </span>
                        </motion.a>
                    </AnimatePresence>
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
                                    <a href="/profile">
                                        My Profile
                                    </a>
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
    const [isPending, startTransition] = useTransition();

    const onConfirm = () => {
        startTransition(async () => {
            await handleLogout();
        });
    };

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
