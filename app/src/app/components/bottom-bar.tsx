"use client";
import { AnimatePresence } from "motion/react";
import { Link } from "./link";
import { Heart, Home, Lightbulb, Plus } from "lucide-react";
import { useIdentity } from "@/providers/identity";
import { useMemo } from "react";

export function BottomBar() {
    const { user } = useIdentity();

    const dicebearUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/initials/svg?seed=${user?.firstName[0]}${user?.lastName[0]}`;
    }, [user?.firstName, user?.lastName]);

    const displayImage = useMemo(() => {
        return user?.image ?? dicebearUrl;
    }, [user?.image, dicebearUrl]);


    return <div className="border-t fixed bottom-0 md:bottom-4 left-1/2 -translate-x-1/2 z-50 mx-auto max-w-xl w-full min-h-14 rounded-lg bg-primary-100/60 md:bg-primary-100/20 text-primary-700 md:text-primary-950 shadow-lg backdrop-blur-lg px-4 py-2 flex lg:hidden flex-row items-center justify-between gap-4">
        <AnimatePresence>
            <Link
                href="/home"
                title="Your home"
                className="inline-flex flex-row items-center justify-start gap-2">
                <Home size={21} />
                <span className="hidden md:inline-block text-nowrap text-xs">
                    Home
                </span>
            </Link>
            <Link
                href="/collections/new"
                title="Create a new collection"
                className="inline-flex flex-row items-center justify-start gap-2">
                <Plus size={21} />
                <span className="hidden md:inline-block text-nowrap text-xs">
                    Create
                </span>
            </Link>
            <Link
                href="/discover"
                title="Discover new collections"
                className="inline-flex flex-row items-center justify-start gap-2">
                <Lightbulb size={21} />
                <span className="hidden md:inline-block text-nowrap text-xs">
                    Discover
                </span>
            </Link>
            <Link
                href="/saved"
                title="Saved collections"
                className="inline-flex flex-row items-center justify-start gap-2">
                <Heart size={21} />
                <span className="hidden md:inline-block text-nowrap text-xs">
                    Saved collections
                </span>
            </Link>
            <Link
                href="/profile"
                title="My profile"
                className="inline-flex flex-row items-center justify-start gap-2">
                <img className="size-8 rounded-full" src={displayImage} alt={`${user?.firstName} ${user?.lastName}`} />
                <span className="hidden md:inline-block text-nowrap text-xs">
                    My profile
                </span>
            </Link>
        </AnimatePresence>
    </div>

}