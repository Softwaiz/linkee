import { DefaultAppContext } from "rwsdk/worker";
import ProfileForm from "./form";
import Page from "@/components/page";
import BackButton from "@/components/page/actions/back-button";
import { User } from "lucide-react";
import UserSocialAccounts from "./social-accounts";
import { db } from "@db/index";

export default async function ProfilePage({ ctx }: { ctx: DefaultAppContext }) {
    const user = ctx?.user;
    if (!user) return <div>User not found</div>;

    const socialAccounts = await db
        .selectFrom("socialAccounts")
        .where("userId", "=", ctx.user!.id)
        .selectAll()
        .execute();

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
        </Page.Header.Custom>
        <Page.Content container className="space-y-4">
            <ProfileForm user={user} />
            <UserSocialAccounts accounts={socialAccounts} />
        </Page.Content>
    </Page.Root>
}