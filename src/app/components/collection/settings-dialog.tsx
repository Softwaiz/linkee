import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState, useEffect, PropsWithChildren } from "react"
import { CollectionSettingsInput } from "@/validations/collection/create"
import { Collection } from "@db/index"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Eye } from "lucide-react"

interface SettingsAreaProps {
    collection?: Collection
    settings: CollectionSettingsInput
    onSettingsUpdate: (settings: CollectionSettingsInput) => void
    hasDangerZone: boolean;
    onDeleteCollection?(): void;
}

export function SettingsArea({ children, hasDangerZone, collection, settings: initialSettings, onSettingsUpdate, onDeleteCollection }: PropsWithChildren<SettingsAreaProps>) {
    const [settings, setSettings] = useState<CollectionSettingsInput>(initialSettings)

    useEffect(() => {
        setSettings(initialSettings)
    }, [initialSettings])

    const handleSave = async (newSettings: Partial<CollectionSettingsInput>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        onSettingsUpdate(updated);
    }

    const updateField = (field: keyof CollectionSettingsInput, value: any) => {
        handleSave({ [field]: value });
    }

    return (
        <div className="w-full bg-card border p-4 rounded-md">
            <div className="flex-1 space-y-4">
                <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Visibility & Access</h4>

                    <div className="flex flex-col items-start justify-start gap-4 rounded-lg">
                        <div className="space-y-0.5">
                            <div className="flex flex-row items-center justify-start gap-1">
                                <Eye className="size-4" />
                                <Label>Visibility</Label>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Who can see this collection?
                            </div>
                        </div>
                        <RadioGroup
                            value={settings.visibility}
                            onValueChange={(val) => updateField('visibility', val)}
                            className="flex flex-col items-start justify-start gap-4"
                        >
                            <div className="flex flex-row items-start justify-start gap-2">
                                <RadioGroupItem id="public" value="public" />
                                <Label
                                    htmlFor="public"
                                    className="flex flex-col items-start justify-start gap-1"
                                >
                                    <span className="font-semibold">Public</span>
                                    <p className="text-sm font-normal text-muted-foreground">
                                        The collection is public. Anyone can see it. It may appear as a discoverable collection.
                                    </p>
                                </Label>
                            </div>
                            <div className="flex flex-row items-start justify-start gap-2">
                                <RadioGroupItem id="unlisted" value="unlisted" />
                                <Label
                                    htmlFor="unlisted"
                                    className="flex flex-col items-start justify-start gap-1">
                                    <span className="font-semibold">Unlisted</span>
                                    <p className="text-sm font-normal text-muted-foreground">
                                        The collection is neither private nor discoverable. But anyone with a valid link can see it.
                                    </p>
                                </Label>
                            </div>
                            <div className="flex flex-row items-start justify-start gap-2">
                                <RadioGroupItem id="private" value="private" />
                                <Label
                                    htmlFor="private"
                                    className="flex flex-col items-start justify-start gap-1">
                                    <span className="font-semibold">Private</span>
                                    <p className="text-sm font-normal text-muted-foreground">
                                        The collection is not public nor discoverable. Nobody can see it but it can be shared with specific users.
                                    </p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {children}
                {hasDangerZone && onDeleteCollection && <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <h4 className="font-medium text-destructive mb-4">Danger Zone</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Delete Collection</Label>
                                <div className="text-sm text-muted-foreground">
                                    Permanently delete this collection and all its contents.
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    onDeleteCollection();
                                }}>
                                Delete Collection
                            </Button>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}
