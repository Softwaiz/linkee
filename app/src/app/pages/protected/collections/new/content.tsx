'use client';
import { PageEditor, PageEditorRef } from '@/components/editor/page-editor'
import { Link } from '@/components/link';
import { ContentLayout } from '@/components/page/content-layout';
import { Button } from '@/components/ui/button';
import { LayersPlus, Plus } from 'lucide-react'
import { useMemo, useRef } from 'react'

export default function CreateCollectionPageContent(props: { prefillLink?: string }) {

    const prefillLink = useMemo(() => {
        if (!props.prefillLink) return undefined
        try {
            return JSON.parse(decodeURIComponent(props.prefillLink)) as {
                url: string
                title: string
                description?: string
                image?: string
                favicon?: string
            }
        } catch {
            return undefined
        }
    }, [props.prefillLink])


    const ref = useRef<PageEditorRef>(null);

    return <ContentLayout
        header={{
            className: "sticky top-0 left-0",
            icon: <LayersPlus className='size-7' />,
            title: "Create your collection",
            actions: <>
                <Button
                    variant="default"
                    onClick={() => ref.current?.save()}>
                    <Plus />
                    <span className="hidden md:inline-block">
                        Save changes
                    </span>
                </Button>
            </>
        }}>
        <PageEditor
            ref={ref}
            hasHeader={false}
            settings={{ visibility: 'public' }}
            prefillLink={prefillLink}
        />
    </ContentLayout>
}
