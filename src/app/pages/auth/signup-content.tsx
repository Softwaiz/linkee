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
import { navigate } from "rwsdk/client";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { UserPlus } from "lucide-react";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";


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
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
                <Card className="sm:mx-auto sm:w-full sm:max-w-md">
                    <CardContent>
                        <CardHeader className="mb-10 text-center md:mb-8">
                            <Logo
                                className="mx-auto h-10 w-10 text-foreground dark:text-foreground"
                                aria-hidden={true}
                            />
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-lg">Linkee</h1>
                                <p className="mt-2 text-center text-sm text-foreground dark:text-foreground opacity-75">
                                    Create your account
                                </p>
                            </div>
                        </CardHeader>
                        <form onSubmit={(ev) => {
                            ev.preventDefault();
                            form.handleSubmit(onSubmit)(ev);
                        }} className="space-y-4 w-full flex flex-col">
                            <FieldGroup className="flex flex-row gap-4">
                                <Controller
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => {
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
                                            <FieldError />
                                        </Field>
                                    }}
                                />

                                <Controller
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => {
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
                                            <FieldError />
                                        </Field>
                                    }}
                                />
                            </FieldGroup>

                            <Controller
                                control={form.control}
                                name="email"
                                render={({ field }) => {
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
                                        <FieldError />
                                    </Field>
                                }}
                            />

                            <Controller
                                control={form.control}
                                name="password"
                                render={({ field }) => {
                                    return <Field>
                                        <FieldLabel
                                            className="text-sm font-medium text-foreground dark:text-foreground"
                                        >
                                            Enter your password
                                        </FieldLabel>
                                        <Input
                                            type="password"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        <FieldError />
                                    </Field>
                                }}
                            />

                            <Controller
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => {
                                    return <Field>
                                        <FieldLabel
                                            className="text-sm font-medium text-foreground dark:text-foreground"
                                        >
                                            Confirm your password
                                        </FieldLabel>
                                        <Input
                                            type="password"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        <FieldError />
                                    </Field>
                                }}
                            />

                            <Controller
                                control={form.control}
                                name="acceptNewsletter"
                                render={({ field }) => {
                                    return <Field className="w-full mt-2 flex flex-row items-center justify-start space-x-2">
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
        </div>
    );
}