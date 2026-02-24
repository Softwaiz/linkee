"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupInput, SignupSchema } from "@/validations/signup";
import { handleAdminInit } from "@/actions/office/init";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { ShieldCheck, UserPlus } from "lucide-react";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";

interface AdminInitContentProps {
    user?: { id: string, name?: string, email?: string };
}

export default function AdminInitContent({ user }: AdminInitContentProps) {
    const [loading, setLoading] = useState(false);

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

    const onSubmit = useCallback((data?: SignupInput) => {
        setLoading(true);
        handleAdminInit(data)
            .then((value) => {
                if (!(value instanceof Response)) {
                    if (value.success === false) {
                        toast.error(
                            "Setup failed",
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

    // If user is already logged in, just show a button to upgrade their role
    if (user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
                    <Card className="sm:mx-auto sm:w-full sm:max-w-md">
                        <CardContent className="pt-6">
                            <CardHeader className="mb-6 text-center">
                                <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                                <div className="flex flex-col items-center justify-center mt-4">
                                    <h1 className="text-xl font-medium">Welcome, Office Admin</h1>
                                    <p className="mt-2 text-center text-sm text-muted-foreground">
                                        You are currently signed in as {user.email || 'a user'}.
                                    </p>
                                    <p className="mt-2 text-center text-sm text-muted-foreground">
                                        Since no office admin exists, you can become the first admin.
                                    </p>
                                </div>
                            </CardHeader>
                            <Button
                                className="w-full py-2 font-medium flex flex-row items-center justify-center gap-2"
                                disabled={loading}
                                onClick={() => onSubmit()}
                            >
                                {loading ? "Updating profile..." : "Become Admin"}
                                <ShieldCheck className="size-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
                <Card className="sm:mx-auto sm:w-full sm:max-w-md">
                    <CardContent className="pt-6">
                        <CardHeader className="mb-8 text-center">
                            <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                            <div className="flex flex-col items-center justify-center mt-4">
                                <h1 className="text-xl font-medium">Linkits Office Setup</h1>
                                <p className="mt-2 text-center text-sm text-muted-foreground">
                                    Create the first admin account to access the office dashboard.
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
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>First name</FieldLabel>
                                            <Input placeholder="Admin" {...field} />
                                            <FieldError />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Last name</FieldLabel>
                                            <Input placeholder="User" {...field} />
                                            <FieldError />
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <Controller
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input type="email" placeholder="admin@example.com" {...field} />
                                        <FieldError />
                                    </Field>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Password</FieldLabel>
                                        <Input type="password" {...field} />
                                        <FieldError />
                                    </Field>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Confirm password</FieldLabel>
                                        <Input type="password" {...field} />
                                        <FieldError />
                                    </Field>
                                )}
                            />

                            <Button
                                type="submit"
                                className="mt-6 w-full py-2 font-medium flex flex-row items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Setup Admin"}
                                <UserPlus className="size-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
