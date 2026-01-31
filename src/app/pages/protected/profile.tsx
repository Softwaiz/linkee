import { DefaultAppContext } from "rwsdk/worker";
import ProfileForm from "./profile-form";
import Page from "@/components/page";
import PageHeader from "@/components/page/page-header";
import BackButton from "@/components/page/actions/back-button";
import PageTitle from "@/components/page/title";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/link";
import Device from "@/components/device";

export default async function ProfilePage({ ctx }: { ctx: DefaultAppContext }) {
    const user = ctx?.user;
    if (!user) return <div>User not found</div>;

    return <Page.Root>
        <Page.Header.Custom container className="justify-between">
            <div className="grow flex flex-row items-center justify-start gap-2">
                <BackButton />
                <Page.Title className="flex flex-row items-center justify-start gap-4">
                    <span className="inline">
                        <User size={21} />
                    </span>
                    My profile
                </Page.Title>
            </div>
            <div>
                <Button
                    variant="outline"
                    size="icon-sm" asChild>
                    <Link href="/collections/new">
                        <Plus />
                    </Link>
                </Button>
            </div>
        </Page.Header.Custom>
        <Page.Content>
            <ProfileForm user={user} />
        </Page.Content>
    </Page.Root>
}