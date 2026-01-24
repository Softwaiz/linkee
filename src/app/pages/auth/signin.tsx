"use client";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SigninInput, SigninSchema } from "@/validations/signin";
import { handleLogin } from "@actions/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { navigate } from "rwsdk/client";
import { toast } from "sonner";

export default function Signin() {
    const [isLoading, setLoading] = useState(false);
    const form = useForm<SigninInput>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const triggerLogin = useCallback((data: SigninInput) => {
        setLoading(true);
        handleLogin({ email: data.email, password: data.password })
            .then((res) => {
                if(res.success) {
                    toast.success(res.message);
                    navigate(res.redirectTo || "/home");
                }
                else {
                    toast.error(res.message || "Login failed. Please try again.");
                }
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    return (
        <section className="bg-gray-1 py-10 dark:bg-dark lg:py-10">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                        <Card className="relative mx-auto max-w-131.25 overflow-hidden px-4 py-8 text-center dark:bg-dark-2">
                            <CardContent>
                                <CardHeader className="mb-10 text-center md:mb-16">
                                    <Logo
                                        className="mx-auto h-10 w-10 text-foreground dark:text-foreground"
                                        aria-hidden={true}
                                    />
                                    <h3 className="mt-2 text-center text-lg font-bold text-foreground dark:text-foreground">
                                        Connect to your account
                                    </h3>
                                </CardHeader>
                                <form
                                className="w-full space-y-4"
                                 onSubmit={(ev) => {
                                    ev.preventDefault();
                                    form.handleSubmit(triggerLogin)(ev);
                                }}>
                                    <Controller
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => {
                                            return <Field>
                                                <FieldLabel>Your email</FieldLabel>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </Field>
                                        }} />

                                    <Controller
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => {
                                            return <Field>
                                                <FieldLabel>Your password</FieldLabel>
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    placeholder="Your password"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </Field>
                                        }} />

                                    <div className="mb-10">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full cursor-pointer rounded-md border border-primary bg-primary px-4 py-2 text-base font-medium text-neutral-600 transition hover:bg-opacity-90 flex flex-row items-center justify-center gap-2"
                                        >
                                            {
                                                isLoading ? "Signing in..." : "Sign In"
                                            }
                                            <LogIn size={16}/>
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                        <p className="mt-6 text-center text-sm text-muted-foreground dark:text-muted-foreground">
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                    >
                        Sign up
                    </a>
                </p>
                    </div>
                </div>
            </div>
        </section>
    );
};