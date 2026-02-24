import { RequestInfo } from "rwsdk/worker";
import { ShieldCheck } from "lucide-react";

export default function OfficeDashboard(props: RequestInfo) {
    return (
        <div className="flex flex-col flex-1 p-8">
            <title>Admin Dashboard - Linkits Office</title>
            <meta name="description" content="Manage your Linkits application via the office dashboard" />

            <div className="flex flex-col items-center justify-center gap-6 mt-20 text-center">
                <ShieldCheck className="size-16 text-primary" />
                <h1 className="text-3xl font-bold">Welcome to the Admin Office</h1>
                <p className="text-muted-foreground text-lg max-w-md">
                    This is your control center for managing your Linkits instance.
                    You can view dashboard metrics, manage users, and adjust application settings here.
                </p>
                <div className="mt-8 p-6 bg-white dark:bg-zinc-900 rounded-lg border shadow-sm max-w-2xl w-full">
                    <h2 className="text-xl font-medium text-left mb-4">Quick Stats Placeholder</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded flex flex-col items-start justify-center">
                            <span className="text-sm text-muted-foreground mb-1">Total Users</span>
                            <span className="text-2xl font-bold">1</span>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded flex flex-col items-start justify-center">
                            <span className="text-sm text-muted-foreground mb-1">Total Collections</span>
                            <span className="text-2xl font-bold">0</span>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded flex flex-col items-start justify-center">
                            <span className="text-sm text-muted-foreground mb-1">Total Links</span>
                            <span className="text-2xl font-bold">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
