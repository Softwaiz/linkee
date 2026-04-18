"use client";
import { Searchbar } from "@/components/search/layout";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export function ProtectedHeader() {
    const sidebar = useSidebar();

    return <div className="w-full flex flex-col items-start justify-start">
        <div className="w-full h-full border-b px-2 py-2 flex flex-row items-center justify-start gap-2 @container/header">
            <Button className="block @md/header:hidden rounded-full aspect-square" onClick={() => sidebar.setOpenMobile(true)}>
                <Menu />
            </Button>
            <div className="grow">
                <h1 className="text-xl font-bold @md/header:hidden">Linkits</h1>
            </div>
            <div className="grow">
                <Searchbar />
            </div>
        </div>
    </div>
}