"use client";
import { ToasterProps } from "sonner";
import { Toaster } from "./components/ui/sonner";

export function WrappedToaster(props: ToasterProps) {
    return <Toaster position="top-right" {...props} />;
}