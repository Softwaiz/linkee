'use client';
import { PageEditor } from '@/components/editor/page-editor'
import Page from '@/components/page'
import { LayersPlus } from 'lucide-react'

export default function CreateCollectionPage() {

  return <Page.Root>
    <Page.Header.Custom container className="justify-between">
      <div className="grow flex flex-row items-center justify-start gap-1">
        <Page.BackButton />
        <div className="flex flex-row items-center justify-start gap-1">
          <span
            className="p-4">
            <LayersPlus size={21} />
          </span>
          <Page.Title>Create your collection</Page.Title>
        </div>
      </div>
    </Page.Header.Custom>
    <Page.Content container>
      <PageEditor />
    </Page.Content>
  </Page.Root>
}
