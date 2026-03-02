"use client";
import { useState } from "react";
import { ArrowRight, Link as LinkIcon } from "lucide-react";
import { SetupInitialWebring } from "./setup-initial-webring";

export function HeroSection() {
    const [url, setUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            new URL(url);
        } catch {

        }
        localStorage.setItem("landing_pending_drop", url);
        window.location.href = "/signup";
    };


    return (
        <header className="flex flex-col items-center">
            <div className="mx-auto container text-center py-16 px-4">
                <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-[56px] md:leading-[1.1]">
                    Collect. Organize.
                    <br />
                    Share what matters.
                </h1>

                <p className="font-body mx-auto max-w-[520px] text-pretty text-base leading-relaxed text-foreground md:text-lg mt-4 mb-8">
                    Build curated collections of links, videos, tools and resources.
                    Explore what others have already discovered.
                </p>

                <div className="container mx-auto flex flex-col items-center justify-center">
                    <SetupInitialWebring layoutIdPrefix="hero" />
                </div>
            </div>
        </header>
    )
}
