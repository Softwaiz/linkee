"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LinkIcon, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";
import { Form, FormField } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Field, FieldError } from "../ui/field";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useDebounce } from "@/hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";

interface LinkResolution {
    title: string;
    description: string;
    image: string;
    favicon: string;
    url: string;
}

const InitialFormSchema = z.object({
    label: z.string(),
    description: z.string(),
});

export function SetupInitialWebring() {
    const [url, setUrl] = useState("");

    const form = useForm({
        resolver: zodResolver(InitialFormSchema),
        defaultValues: {
            label: "",
            description: "",
        }
    });

    const formValues = useWatch(form);
    const debouncer = useDebounce(1000);

    const [loading, setLoading] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [linkResolution, setLinkResolution] = useState<LinkResolution | undefined>(undefined);

    const resolveLink = useCallback(() => {
        setLoading(true);
        fetch(
            "/api/metadata",
            {
                method: "POST",
                body: JSON.stringify({
                    url: url
                })
            }
        )
            .then((res) => res.json<Omit<LinkResolution, "url">>())
            .then((data) => {
                if (data) {
                    setLinkResolution({ url, ...data });
                    return true;
                }
                return false;
            })
            .then((should) => {
                if (should) {
                    setConfirmationOpen(true);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url]);

    const handleUrlResolution = useCallback(() => {
        if (loading || !url) {
            return;
        }
        if (!linkResolution) {
            resolveLink();
            return;
        }
        if (url != linkResolution.url) {
            resolveLink();
            return;
        }


        localStorage.setItem("landing_pending_drop", url);
        localStorage.setItem("landing_pending_drop_resolution", JSON.stringify(linkResolution));
        setConfirmationOpen(true);

    }, [loading, linkResolution, resolveLink, url]);

    const handleSubmit = useCallback((data: z.infer<typeof InitialFormSchema>) => {
        if (loading) {
            return;
        }
        if (!linkResolution) {
            resolveLink();
            return;
        }
        if (url != linkResolution.url) {
            resolveLink();
            return;
        }

        localStorage.setItem("landing_pending_drop", url);
        localStorage.setItem("landing_pending_drop_resolution", JSON.stringify(linkResolution));
    }, [loading, linkResolution, resolveLink, url]);

    return (
        <header className="flex flex-col items-center">
            <div className="mx-auto container text-center py-16 px-4">
                <div className="w-full flex flex-col items-center justify-start">
                    <div className="w-full max-w-lg rounded-md px-4 py-4 gap-4 flex flex-col items-start justify-start">

                        <div className="w-full flex flex-col items-center justify-between">
                            <h1 className="text-lg font-semibold">Let's start building your webring.</h1>
                            <p className="text-sm text-foreground">We're almost there. Let's get your webring set up.</p>
                        </div>

                        <AnimatePresence>
                            <div className="w-full flex flex-col items-start justify-start gap-2">
                                <motion.div
                                    className="w-full flex flex-row items-center gap-2 rounded-full border border-input bg-input/50 p-1 shadow-sm focus-within:ring-2 focus-within:ring-primary backdrop-blur-sm"
                                    layoutId="resolution">
                                    <div className="flex pl-3 text-muted-foreground">
                                        <LinkIcon className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="url"
                                        required
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUrlResolution();
                                            }
                                        }}
                                        placeholder="Paste your link here..."
                                        className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                                    />
                                    <motion.button
                                        type="button"
                                        layoutId="resolution.button"
                                        onClick={handleUrlResolution}
                                        className="hidden md:flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 hover:bg-primary/90">
                                        {loading ? "Resolving..." : "Save Link"}
                                        {loading ? <Loader2 className="ml-2 size-4 animate-spin" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                                    </motion.button>
                                </motion.div>
                                <motion.button
                                    type="button"
                                    onClick={handleUrlResolution}
                                    className="w-full flex md:hidden h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 hover:bg-primary/90">
                                    {loading ? "Resolving..." : "Save Link"}
                                    {loading ? <Loader2 className="ml-2 size-4 animate-spin" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                                </motion.button>
                            </div>
                            {
                                confirmationOpen && <motion.div
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 40, opacity: 0 }}
                                    className="fixed top-0 left-0 z-50 w-full min-h-screen backdrop-blur-sm">
                                    <motion.form
                                        onSubmit={form.handleSubmit(handleSubmit)}
                                        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 md:w-full max-w-md border border-input bg-card text-card-foreground p-3 md:p-4 lg:p-6 space-y-2 md:space-y-3 lg:space-y-4 gap-2 rounded-xl shadow-lg"
                                        initial={{ y: 40, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 40, opacity: 0 }}
                                    >
                                        <div className="relative w-full flex flex-row items-start justify-start">
                                            <div className="grow flex flex-col items-start justify-between">
                                                <h1 className="text-lg font-semibold text-left">Let's start building your webring.</h1>
                                                <p className="text-xs md:text-sm text-foreground/80 text-left">We're almost there. Let's get your webring set up.</p>
                                            </div>
                                            <button
                                                className="bg-muted hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full"
                                                onClick={() => {
                                                    setConfirmationOpen(false);
                                                }}>
                                                <X className="size-5" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-start justify-start gap-1 bg-card/50 p-2 border border-input rounded-md overflow-hidden">
                                            <span className="text-xs text-left text-muted-foreground line-clamp-1">{linkResolution?.url}</span>
                                            <span className="text-sm font-semibold text-left line-clamp-1">{linkResolution?.title}</span>
                                            <span className="text-xs text-left text-foreground/60 line-clamp-2">{linkResolution?.description}</span>
                                        </div>

                                        <Controller
                                            control={form.control}
                                            name="label"
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <Label>Name your webring</Label>
                                                    <Input placeholder="Name your webring." {...field} />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            control={form.control}
                                            name="description"
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <Label>Description</Label>
                                                    <Textarea
                                                        rows={6}
                                                        placeholder="Describe your webring in a few words."
                                                        {...field}>
                                                    </Textarea>
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                        <div className="w-full flex flex-row items-center justify-end gap-2 lg:gap-4">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm">
                                                <motion.button
                                                    type="button"
                                                    onClick={() => {
                                                        setConfirmationOpen(false);
                                                    }}>
                                                    Cancel
                                                </motion.button>
                                            </Button>
                                            <Button
                                                asChild
                                                size="sm">
                                                <motion.button
                                                    type="submit"
                                                    layoutId="resolution.button">
                                                    Add my webring
                                                </motion.button>
                                            </Button>
                                        </div>
                                    </motion.form>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header >
    )
}
