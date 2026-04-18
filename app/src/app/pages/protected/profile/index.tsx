import { DefaultAppContext } from "rwsdk/worker";
import ProfileForm from "./form";
import { User } from "lucide-react";
import UserSocialAccounts from "./social-accounts";
import { db } from "@db/index";
import { ContentLayout } from "@/components/page/content-layout";

export default async function ProfilePage({ ctx }: { ctx: DefaultAppContext }) {
    const user = ctx?.user;
    if (!user) return <div>User not found</div>;

    const socialAccounts = await db
        .selectFrom("socialAccounts")
        .where("userId", "=", ctx.user!.id)
        .selectAll()
        .execute();

    return <ContentLayout
        header={{
            icon: <User size={21} />,
            title: "My profile",
        }}>
        <div className="w-full grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4">
                <div className="w-full border border-border bg-card/20 text-card-foreground rounded-md">
                    <UserSocialAccounts accounts={socialAccounts} />
                </div>
            </div>
            <div className="col-span-12 lg:col-span-8 border border-border bg-card/20 text-card-foreground rounded-md p-4">
                <ProfileForm user={user} />
            </div>
        </div>
    </ContentLayout>
}