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
import { LogOut, User as UserIcon, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { handleLogout } from "../actions/auth/logout";
import { Input } from "./ui/input";
import { Logo } from "./logo";

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

    // Dicebear fallback
    const dicebearUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName[0]}${user.lastName[0]}`;
    const displayImage = user.image ?? dicebearUrl;

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto flex h-14 items-center justify-between gap-2">
                    <div className="mr-4 flex grow">
                        <a className="mr-6 flex items-center space-x-2" href="/home">
                            <Logo />
                            <span className="font-bold inline-block">Linkee</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search collections..."
                                value={searchQueryDraft}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-64 bg-muted/50 pl-9 focus:bg-background"
                            />
                        </div>
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
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <a href="/profile" className="flex items-center cursor-pointer">
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

            <LogoutDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} />
        </>
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
