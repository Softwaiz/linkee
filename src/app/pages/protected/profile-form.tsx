"use client";
import { uploadProfileImage } from "@/actions/upload";
import { updateUser } from "@/actions/user/update";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@db/index";
import { Camera, Loader2 } from "lucide-react";
import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export default function ProfileForm({ user }: { user: User }) {
    const [isPending, startTransition] = useTransition();
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [alias, setAlias] = useState(user.alias || "");
    const [image, setImage] = useState(user.image || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Dicebear fallback
    const dicebearUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName}${user.lastName}`;
    }, [user.firstName, user.lastName]);

    const displayImage = useMemo(() => {
        return image ?? dicebearUrl;
    }, [image, dicebearUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadProfileImage(formData);
            if (result.success && result.url) {
                setImage(result.url);
                toast.success("Image uploaded. Remember to save changes.");
            } else {
                toast.error(result.message || "Upload failed");
            }
        } catch (error) {
            toast.error("An error occurred during upload");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateUser({
                firstName,
                lastName,
                alias,
                image
            });

            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            <form onSubmit={onSubmit} className="space-y-8">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-border">
                        <img
                            src={displayImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        {uploading && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || isPending}
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isPending}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isPending}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="alias">Alias (Optional)</Label>
                        <Input
                            id="alias"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="Display name"
                            disabled={isPending}
                        />
                        <p className="text-xs text-muted-foreground">This name will be displayed on your header instead of your full name.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending || uploading}>
                        {isPending ? "Saving..." : "Save Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
