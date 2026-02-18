import { Collection, db } from "@db/index";
import { RequestInfo } from "rwsdk/worker";
import { CollectionsMasonry } from "@/components/collection/grid";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/link";
import Page from "@/components/page";
import PageHeader from "@/components/page/page-header";
import BackButton from "@/components/page/actions/back-button";
import PageTitle from "@/components/page/title";
import PageContent from "@/components/page/content";

export default async function SavedCollections(props: RequestInfo) {

    const collections = await db
        .selectFrom("boards")
        .innerJoin("boardReactions", "boards.id", "boardReactions.boardId")
        .selectAll("boards")
        .where("boardReactions.userId", "=", props.ctx.user!.id)
        .where("boardReactions.type", "=", "save")
        .execute();

    return <Page.Root>
        <Page.Header.Custom container className="justify-between">
            <div className="grow flex flex-row items-center justify-start gap-2 overflow-hidden">
                <BackButton />
                <div className="grow flex flex-row items-center justify-start gap-1 overflow-hidden">
                    <span className="inline">
                        <Heart size={21} />
                    </span>
                    <PageTitle>
                        Collections you saved
                    </PageTitle>
                </div>
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
        <Page.Content container>
            <CollectionsMasonry items={collections as unknown as Collection[]} />
        </Page.Content>
    </Page.Root>
}