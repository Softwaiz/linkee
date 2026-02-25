import { RequestInfo } from "rwsdk/worker";
import { TagsContent } from "./index.content";

export const TagsPage = async (props: RequestInfo) => {
    return (
        <div className="flex flex-col flex-1 p-8">
            <title>Tags Management - Linkits Office</title>
            <meta name="description" content="Manage Linkits tags" />
            <TagsContent />
        </div>
    );
};
