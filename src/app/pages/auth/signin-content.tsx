"use client";
import { Link } from "@/components/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SigninInput, SigninSchema } from "@/validations/signin";
import { handleLogin } from "@actions/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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

    return (
        <section className="bg-gray-1 py-10 dark:bg-dark lg:py-10">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                        <Card className="sm:mx-auto sm:w-full sm:max-w-md relative overflow-hidden px-4 py-8 text-center dark:bg-dark-2">
                            <CardContent>
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
                </div>
            </div>
        </section>
    );
};