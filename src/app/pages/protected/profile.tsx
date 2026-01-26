import { DefaultAppContext } from "rwsdk/worker";
import ProfileForm from "./profile-form";

export default async function ProfilePage({ ctx }: { ctx: DefaultAppContext }) {
    const user = ctx?.user;
    if (!user) return <div>User not found</div>;

    return <div>
        <ProfileForm user={user} />
    </div>
}