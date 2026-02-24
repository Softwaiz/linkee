import { RequestInfo } from "rwsdk/worker";
import { db } from "@db/index";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { UsersPageContent } from "./index.content";

export default async function UsersPage(props: RequestInfo) {
    const url = new URL(props.request.url);
    const filter = url.searchParams.get("filter");

    let query = db.selectFrom("users")
        .select(["id", "firstName", "lastName", "email", "role", "createdAt"]);

    if (filter === "has_collection") {
        query = query.where(({ exists, selectFrom }) =>
            exists(
                selectFrom("boards")
                    .select("boards.id")
                    .whereRef("boards.userId", "=", "users.id")
            )
        );
    } else if (filter === "no_collection") {
        query = query.where(({ not, exists, selectFrom }) =>
            not(exists(
                selectFrom("boards")
                    .select("boards.id")
                    .whereRef("boards.userId", "=", "users.id")
            ))
        );
    }

    const users = await query.orderBy("createdAt", "desc").execute();

    const title = filter === "has_collection" ? "Users with Collections" :
        filter === "no_collection" ? "Users without Collections" :
            "All Users";

    return (
        <div className="flex flex-col flex-1 p-8">
            <title>{title} - Linkits Office</title>
            <meta name="description" content="Manage Linkits users" />

            <UsersPageContent title={title} items={users} />
        </div>
    );
}