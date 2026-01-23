import { getRequestInfo } from "rwsdk/worker";

export default function AppHomePage() {
    const info = getRequestInfo().ctx;

    return (
        <section className="bg-gray-1 py-10 dark:bg-dark lg:py-10">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">
                            Welcome to your App Dashboard
                        </h1>
                        <pre>
                            {
                                JSON.stringify({ user: info.user }, null, 2)
                            }
                        </pre>
                        <p className="mt-4 text-lg text-foreground dark:text-foreground">
                            This is a protected area of the application.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}