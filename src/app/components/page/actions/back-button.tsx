"use client";
import { ArrowLeft } from "lucide-react";
import { navigate } from "rwsdk/client";

export default function BackButton() {
    return <button
        className="p-3 opacity-60 flex flex-row items-center justify-center gap-1"
        title="Go to the previous page"
        onClick={() => {
            document.startViewTransition(() => {
                if (window.history.length > 0) {
                    window.history.back();
                }
                else {
                    navigate("/home");
                }
            })
        }}>
        <ArrowLeft size={18} />
    </button>
}