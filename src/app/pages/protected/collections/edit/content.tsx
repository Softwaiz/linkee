"use client";
import { PageEditor, PageEditorRef } from '@/components/editor/page-editor'
import { Collection, CollectionSettings } from '@db/index'
import { Check, LayersPlus } from 'lucide-react';
import { ContentLayout } from '@/components/page/content-layout';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

export default function EditCollectionPageContent({ collection, settings, tags }: { collection: Collection, settings: CollectionSettings, tags: string[] }) {

    const ref = useRef<PageEditorRef>(null);

    return <ContentLayout
        header={{
            icon: <LayersPlus size={24} />,
            title: `Editing ${collection.label}`,
            actions: <>
                <Button
                    variant="default"
                    onClick={() => ref.current?.save()}>
                    <Check />
                    <span className="hidden md:inline-block">
                        Save changes
                    </span>
                </Button>
            </>
        }}>
        <PageEditor
            ref={ref}
            hasHeader={false}
            collection={collection}
            settings={{
                ...settings
            }}
            tags={tags}
            footer={
                <div className="w-full p-4 bg-yellow-500/10 border border-yellow-200/20 rounded-md">
                    <p className="text-xs text-muted-foreground">
                        If this collection is <strong>public</strong>, this update will take up to 5 minutes to be visible to the public.
                    </p>
                </div>
            } />
    </ContentLayout>
}