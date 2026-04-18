import { useEscapeEffect } from "@/hooks/useEscapeEffect";
import { useScrollLockerEffect } from "@/hooks/useScrollLocker";
import { AnimatePresence } from "motion/react";
import { PropsWithChildren } from "react"
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PopupProps {
    layoutId?: string;
    backdropLayoutId?: string;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    backdropClassName?: string;
}

export function Popup({
    layoutId = "collection",
    backdropLayoutId = "banner",
    isOpen,
    onClose,
    className,
    backdropClassName,
    children
}: PropsWithChildren<PopupProps>) {

    useEscapeEffect(isOpen, onClose);
    useScrollLockerEffect(isOpen);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        layoutId={backdropLayoutId}
                        className={cn("fixed inset-0 z-40 bg-black/60 backdrop-blur-sm", backdropClassName)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    <motion.div
                        key="popup"
                        layoutId={layoutId}
                        className={cn(
                            'fixed z-50 inset-x-4 top-[50%] -translate-y-[50%]',
                            'mx-auto max-w-2xl',
                            'bg-background border border-border rounded-2xl shadow-2xl',
                            'flex flex-col overflow-hidden',
                            'h-full max-h-[90vh]',
                            "overflow-y-auto",
                            className
                        )}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {children}
                    </motion.div>*
                </>
            )}
        </AnimatePresence>
    )
}
