'use client'
import type { Section } from '@/lib/types'
import { LinkPreview } from './link-preview'
import { TextPreview } from './text-preview'

interface SectionPreviewProps {
  section: Section
}

export function SectionPreview({ section }: SectionPreviewProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl text-foreground">
          {section.title || 'Untitled Section'}
        </h3>
        {section.description && (
          <p className="text-sm text-muted-foreground">{section.description}</p>
        )}
      </div>
      {section.items.length > 0 ? (
        <div className="w-full flex flex-col gap-3">
          {section.items.map((item) =>
            item.type === 'link' ? (
              <LinkPreview key={item.id} link={item} />
            ) : (
              <TextPreview key={item.id} text={item} />
            )
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-8 text-center">
          <p className="text-sm text-muted-foreground">No items in this section</p>
        </div>
      )}
    </section>
  )
}
