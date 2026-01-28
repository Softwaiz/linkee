'use client'
import { useState } from 'react'
import { DiscoverCard } from '@/components/discover/discover-card'
import type { Page } from '@/lib/types'
import { Collection } from '@db/index'
import { CollectionInput } from '@/validations/collection/create'

const DISCOVER_COLLECTIONS: CollectionInput[] = [
  {
    id: 'africa-people-2026',
    label: 'Africa - Key people to watch out in 2026',
    description: "A curated list of top entrepreneurs to watch in africa. This list is not ranked. I've just listed them so don't take the order on which they appear into consideration.",
    nodes: [
      {
        id: 's1',
        title: 'Tech Founders',
        description: '',
        items: [
          { id: 'l1', type: 'link', url: 'https://example.com', title: 'Founder 1', description: '' },
          { id: 'l2', type: 'link', url: 'https://example.com', title: 'Founder 2', description: '' },
          { id: 'l3', type: 'link', url: 'https://example.com', title: 'Founder 3', description: '' },
        ],
      },
      {
        id: 's2',
        title: 'Investors',
        description: '',
        items: [
          { id: 'l4', type: 'link', url: 'https://example.com', title: 'Investor 1', description: '' },
        ],
      },
    ],
  },
  {
    id: 'peter-pistorius',
    label: 'Peter Pistorius',
    description: 'Peter pistorius is a software engineer from South Africa, currently living in Berlin. This curated links collection showcases his work and projects.',
    banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    nodes: [
      {
        id: 's1',
        title: 'Projects',
        description: '',
        items: [
          { id: 'l1', type: 'link', url: 'https://example.com', title: 'Project 1', description: '' },
        ],
      },
    ],
  },
  {
    id: 'ivory-coast-news',
    label: "Cote d'Ivoire - Government Updates",
    description: 'Official government announcements, policy updates, and ministerial communications from the Republic of Ivory Coast.',
    banner: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&q=80',
    nodes: [
      {
        id: 's1',
        title: 'Ministry Updates',
        description: '',
        items: [
          { id: 'l1', type: 'link', url: 'https://example.com', title: 'Update 1', description: '' },
          { id: 'l2', type: 'link', url: 'https://example.com', title: 'Update 2', description: '' },
        ],
      },
      {
        id: 's2',
        title: 'Press Releases',
        description: '',
        items: [
          { id: 'l3', type: 'link', url: 'https://example.com', title: 'Press 1', description: '' },
        ],
      },
    ],
  },
  {
    id: 'design-resources',
    label: 'Design Resources for 2026',
    description: 'A comprehensive collection of design tools, inspiration sites, and learning resources for modern UI/UX designers.',
    banner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    nodes: [
      {
        id: 's1',
        title: 'Tools',
        description: "",
        items: [
          { id: 'l1', type: 'link', url: 'https://figma.com', title: 'Figma', description: "" },
          { id: 'l2', type: 'link', url: 'https://framer.com', title: 'Framer', description: "" },
        ],
      },
    ],
  },
  {
    id: 'ai-tools',
    label: 'AI Tools Directory',
    description: 'The ultimate collection of AI-powered tools for productivity, creativity, and development.',
    nodes: [
      {
        id: 's1',
        title: 'Writing',
        description: "",
        items: [
          { id: 'l1', type: 'link', url: 'https://example.com', title: 'Tool 1', description: '' },
          { id: 'l2', type: 'link', url: 'https://example.com', title: 'Tool 2', description: "" },
          { id: 'l3', type: 'link', url: 'https://example.com', title: 'Tool 3', description: "" },
        ],
      },
      {
        id: 's2',
        title: 'Image Generation',
        description: "",
        items: [
          { id: 'l4', type: 'link', url: 'https://example.com', title: 'Tool 4', description: '' },
          { id: 'l5', type: 'link', url: 'https://example.com', title: 'Tool 5', description: "" },
        ],
      },
      {
        id: 's3',
        title: 'Coding',
        description: "",
        items: [
          { id: 'l6', type: 'link', url: 'https://example.com', title: 'Tool 6', description: '' },
        ],
      },
    ],
  },
  {
    id: 'startup-reading',
    label: 'Essential Startup Reading List',
    description: 'Must-read articles, books, and resources for founders building their first startup.',
    banner: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&q=80',
    nodes: [
      {
        id: 's1',
        title: 'Books',
        description: '',
        items: [
          { id: 'l1', type: 'link', url: 'https://example.com', title: 'Book 1', description: '' },
          { id: 'l2', type: 'link', url: 'https://example.com', title: 'Book 2', description: '' },
        ],
      },
    ],
  },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCollections = DISCOVER_COLLECTIONS.filter(
    (collection) =>
      collection.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#e8f5e9]">

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Discover Collections</h1>
          <p className="mt-1 text-muted-foreground">
            Explore curated collections from creators around the world
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filteredCollections.map((collection) => (
            <div key={collection.id} className="mb-5 break-inside-avoid">
              <DiscoverCard collection={collection as unknown as Collection} />
            </div>
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No collections found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  )
}
