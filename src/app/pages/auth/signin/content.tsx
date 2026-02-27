"use client";
import { Link } from "@/components/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { SigninInput, SigninSchema } from "@/validations/signin";
import { handleLogin } from "@actions/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { PasswordInput } from "@/components/ui/password";

export default function SigninContent(props: { redirect: string }) {

    const [isLoading, setLoading] = useState(false);
    const form = useForm<SigninInput>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const triggerLogin = useCallback(async (data: SigninInput) => {
        setLoading(true);
        handleLogin({ email: data.email, password: data.password, redirectUrl: props.redirect })
            .then((res) => {
                if (!(res instanceof Response)) {
                    if (res.loggedIn) {
                        toast.success(res.message);
                    }
                    else {
                        toast.error(res.message || "Login failed. Please try again.");
                    }
                }
            })
            .finally(() => {
                setLoading(false)
            });
    }, [props.redirect]);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const passwordVisibility = useDebounce(5000);

    return (
        <section className="bg-background text-foreground py-10 lg:py-10 min-h-dvh flex flex-col items-center justify-center">
            <div className="w-full max-w-md flex flex-col items-center justify-center p-2 md:p-4">
                <Card className="w-full relative overflow-hidden py-4 md:py-8 text-center dark:bg-dark-2 rounded-md lg:rounded-lg">
                    <CardContent className="px-3 md:px-6">
                        <CardHeader className="mb-10 text-center md:mb-8">
                            <Logo
                                className="mx-auto h-10 w-10 text-foreground dark:text-foreground"
                                aria-hidden={true}
                            />
                            <div className="flex flex-col items-center justify-center gap-2">
                                <h1 className="text-lg">Linkits</h1>
                                <p className="mt-2 text-center text-sm text-foreground dark:text-foreground opacity-75">
                                    Connect to your account
                                </p>
                            </div>
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
                                render={({ field, fieldState }) => {
                                    return <Field>
                                        <FieldLabel>Your email</FieldLabel>
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                }} />

                            <Controller
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => {
                                    return <Field>
                                        <FieldLabel>Your password</FieldLabel>
                                        <PasswordInput value={field.value} onChange={field.onChange} />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                }} />
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="w-full flex flex-row items-center gap-2"
                            >
                                {
                                    isLoading ? "Signing in..." : "Sign In"
                                }
                                <LogIn size={16} />
                            </Button>
                        </form>
                        <div className="flex flex-row items-center justify-center gap-2 my-4">
                            <hr className="grow" />
                            <span className="opacity-75 text-sm">OR</span>
                            <hr className="grow" />
                        </div>
                        <Button className="w-full" asChild variant="outline">
                            <Link href="/signin/with/google" className="flex flex-row items-center justify-center gap-4">
                                <img className="size-5" src="/icons/google.svg" alt="Google Icon" />
                                <span>Login with Google</span>
                            </Link>
                        </Button>
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
        </section>
    );
};