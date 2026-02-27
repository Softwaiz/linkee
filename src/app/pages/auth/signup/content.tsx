"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupInput, SignupSchema } from "@/validations/signup";
import { handleSignup } from "@/actions/auth/signup";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { UserPlus } from "lucide-react";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { Link } from "@/components/link";
import { PasswordInput } from "@/components/ui/password";


export default function SignupContent() {

    const [loading, setLoading] = useState(false);

    const passwordVisible = usePasswordVisibility();
    const confirmPasswordVisible = usePasswordVisibility();

    const form = useForm({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptNewsletter: false
        }
    });

    const onSubmit = useCallback((data: SignupInput) => {
        setLoading(true);
        handleSignup(data)
            .then((value) => {
                if (!(value instanceof Response)) {
                    if (value.success) {
                        toast.success(
                            "Signup successful",
                            {
                                description: "You can now sign in with your new account."
                            }
                        );
                    }
                    else {
                        toast.error(
                            "Signup failed. Please try again.",
                            {
                                description: value.error
                            }
                        );
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <section className="bg-background text-foreground py-10 lg:py-10 min-h-dvh flex flex-col items-center justify-center">
            <div className="w-full max-w-lg flex flex-col items-center justify-center p-2 md:p-4">
                <Card className="w-full relative overflow-hidden py-4 md:py-8 text-center dark:bg-dark-2 rounded-md lg:rounded-lg">
                    <CardContent className="px-3 md:px-6">
                        <CardHeader className="mb-10 text-center md:mb-8">
                            <Logo
                                className="mx-auto h-10 w-10 text-foreground dark:text-foreground"
                                aria-hidden={true}
                            />
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-lg">Linkits</h1>
                                <p className="mt-2 text-center text-sm text-foreground dark:text-foreground opacity-75">
                                    Create your account
                                </p>
                            </div>
                        </CardHeader>
                        <form onSubmit={(ev) => {
                            ev.preventDefault();
                            form.handleSubmit(onSubmit)(ev);
                        }} className="space-y-2 w-full flex flex-col">
                            <FieldGroup className="flex flex-row gap-4">
                                <Controller
                                    control={form.control}
                                    name="firstName"
                                    render={({ field, fieldState }) => {
                                        return <Field>
                                            <FieldLabel
                                                className="text-sm font-medium text-foreground dark:text-foreground"
                                            >
                                                First name
                                            </FieldLabel>
                                            <Input
                                                type="text"
                                                placeholder={"John"}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    }}
                                />

                                <Controller
                                    control={form.control}
                                    name="lastName"
                                    render={({ field, fieldState }) => {
                                        return <Field>
                                            <FieldLabel
                                                className="text-sm font-medium text-foreground dark:text-foreground"
                                            >
                                                Last name
                                            </FieldLabel>
                                            <Input
                                                type="text"
                                                placeholder={"DOE"}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    }}
                                />
                            </FieldGroup>

                            <Controller
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => {
                                    return <Field>
                                        <FieldLabel
                                            className="text-sm font-medium text-foreground dark:text-foreground"
                                        >
                                            Email
                                        </FieldLabel>
                                        <Input
                                            type="email"
                                            placeholder={"johndoe@gmail.com"}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                }}
                            />

                            <Controller
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => {
                                    return <Field>
                                        <FieldLabel
                                            className="text-sm font-medium text-foreground dark:text-foreground"
                                        >
                                            Enter your password
                                        </FieldLabel>
                                        <PasswordInput
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                }}
                            />

                            <Controller
                                control={form.control}
                                name="confirmPassword"
                                render={({ field, fieldState }) => {
                                    return <Field>
                                        <FieldLabel
                                            className="text-sm font-medium text-foreground dark:text-foreground"
                                        >
                                            Confirm your password
                                        </FieldLabel>
                                        <PasswordInput
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                }}
                            />

                            <Controller
                                control={form.control}
                                name="acceptNewsletter"
                                render={({ field }) => {
                                    return <Field className="w-full mt-2 flex flex-row items-center justify-start space-x-1">
                                        <Checkbox
                                            id="newsletter-checkbox"
                                            className="size-4!"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <FieldLabel
                                            id="newsletter-checkbox"
                                            className="text-sm leading-6 text-muted-foreground dark:text-muted-foreground"
                                        >
                                            Sign up to our newsletter
                                        </FieldLabel>
                                    </Field>
                                }}
                            />

                            <Button
                                type="submit"
                                className="mt-4 w-full py-2 font-medium  flex flex-row items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Create my account"}
                                <UserPlus />
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
                                <span>Signup with Google</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <p className="mt-6 text-center text-sm text-muted-foreground dark:text-muted-foreground">
                    Already have an account?{" "}
                    <a
                        href="/signin"
                        className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </section>
    );
}