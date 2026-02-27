"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export function PasswordInput(props: HTMLAttributes<HTMLInputElement> & { value: string, onChange: (value: string) => void }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const passwordVisibility = useDebounce(5000);

    return <div className="w-full relative">
        <Input
            {...props}
            className={cn(
                "pr-[56px]",
                props.className
            )}
            type={passwordVisible ? "text" : "password"}
            value={props.value}
            onChange={props.onChange}
        />
        <motion.button
            type="button"
            title={passwordVisible ? "Hide password" : "Show password"}
            className="absolute top-0 right-0 h-full w-[56px] px-3 overflow-hidden border-l border-input bg-input/30 rounded-r-md"
            onClick={() => {
                setPasswordVisible((prev) => {
                    if (!prev) {
                        passwordVisibility.delay(() => {
                            setPasswordVisible(false);
                        })
                    }
                    return !prev;
                });
            }}>
            <AnimatePresence>
                {
                    passwordVisible ? <motion.span
                        key="eye-off"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0 }}>
                        <EyeOff className="size-4" />
                    </motion.span> : <motion.span
                        key="eye"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0 }}>
                        <Eye className="size-4" />
                    </motion.span>
                }
            </AnimatePresence>
        </motion.button>
    </div>
}