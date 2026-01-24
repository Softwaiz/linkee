'use client'
import { Layers, Link as LinkIcon, Pencil } from 'lucide-react'
import type { Page } from '@/lib/types'
import { CollectionHeader } from './collection-header'
import { Button } from '@/components/ui/button'
import { SectionPreview } from './section-preview'

const demoCollections: Page[] = [
  {
    id: '1',
    title: 'Design Inspiration',
    description: 'A curated collection of beautiful design resources, tools, and inspiration for UI/UX designers.',
    sections: [
      {
        id: 's1',
        title: 'Design Systems',
        description: 'Best-in-class design system documentation and resources',
        items: [
          { id: 'l1', type: 'link', url: 'https://www.figma.com', title: 'Figma', description: 'The collaborative interface design tool' },
          { id: 'l2', type: 'link', url: 'https://ui.shadcn.com', title: 'shadcn/ui', description: 'Beautifully designed components built with Radix UI and Tailwind CSS' },
          { id: 't1', type: 'text', content: 'These are my go-to resources for building consistent, accessible design systems.' },
        ]
      },
      {
        id: 's2',
        title: 'Color & Typography',
        description: 'Tools for choosing colors and fonts',
        items: [
          { id: 'l3', type: 'link', url: 'https://coolors.co', title: 'Coolors', description: 'The super fast color palette generator' },
          { id: 'l4', type: 'link', url: 'https://fonts.google.com', title: 'Google Fonts', description: 'Free, open-source fonts optimized for the web' },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Frontend Development',
    description: 'Essential tools and resources for modern frontend development.',
    sections: [
      {
        id: 's1',
        title: 'Frameworks',
        description: 'Modern JavaScript frameworks',
        items: [
          { id: 'l1', type: 'link', url: 'https://nextjs.org', title: 'Next.js', description: 'The React Framework for the Web' },
          { id: 'l2', type: 'link', url: 'https://react.dev', title: 'React', description: 'The library for web and native user interfaces' },
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'AI & Machine Learning',
    description: 'Resources for learning about AI, ML, and building intelligent applications.',
    sections: [
      {
        id: 's1',
        title: 'Learning Resources',
        description: 'Courses and tutorials',
        items: [
          { id: 'l1', type: 'link', url: 'https://openai.com', title: 'OpenAI', description: 'AI research and deployment company' },
        ]
      }
    ]
  }
]

interface CollectionViewProps {
  collection: Page;
}

export function CollectionView({ collection }: CollectionViewProps) {
  const totalLinks = collection.sections.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalSections = collection.sections.length

  return (
    <div className="min-h-screen bg-background">
      <CollectionHeader
        collectionId={collection.id}
        title={collection.title} />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Layers className="size-8" />
          </div>
          <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight text-foreground">
            {collection.title || 'Untitled Collection'}
          </h1>
          {collection.description && (
            <p className="mx-auto mb-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              {collection.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <LinkIcon className="size-4" />
              {totalLinks} {totalLinks === 1 ? 'link' : 'links'}
            </span>
            <span className="flex items-center gap-2">
              <Layers className="size-4" />
              {totalSections} {totalSections === 1 ? 'section' : 'sections'}
            </span>
          </div>
        </div>

        {collection.sections.length > 0 ? (
          <div className="space-y-12">
            {collection.sections.map((section) => (
              <SectionPreview key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
              <Layers className="size-6" />
            </div>
            <h3 className="mb-2 font-medium text-foreground">No sections yet</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Start building your collection by adding sections and links
            </p>
            <Button asChild>
              <a href={`/editor/${collection.id}`}>
                <Pencil className="mr-2 size-4" />
                Start Editing
              </a>
            </Button>
          </div>
        )}
        {collection.sections.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent" asChild>
              <a href={`/editor/${collection.id}`}>
                <Pencil className="size-4" />
                Edit this collection
              </a>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
