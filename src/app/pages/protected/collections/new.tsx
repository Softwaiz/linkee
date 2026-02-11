'use client';
import { PageEditor } from '@/components/editor/page-editor'
import Page from '@/components/page'
import { LayersPlus } from 'lucide-react'

export default function CreateCollectionPage() {

  return <Page.Root>
    <Page.Content container>
      <PageEditor
        header={
          <div className="w-full flex flex-row items-center justify-start gap-1">
            <Page.BackButton />
            <div className="flex flex-row items-center justify-start gap-1 text-foreground">
              <span
                className="p-4">
                <LayersPlus size={21} />
              </span>
              <span className="text-lg">Create your collection</span>
            </div>
          </div>
        }
        settings={{
          visibility: 'public',
        }}
      />
    </Page.Content>
  </Page.Root>
}
