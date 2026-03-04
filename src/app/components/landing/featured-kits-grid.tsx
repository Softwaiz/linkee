'use client'

import { PublicDiscoverCard } from '../discover/discover-card'
import { type HighlightedCollection } from '@/resolvers/collections';

interface FeaturedKitsGridProps {
    items: HighlightedCollection[];
}

export function FeaturedKitsGrid({ items }: FeaturedKitsGridProps) {
    return (
        <>
            {items.map((kit) => {
                return (
                    <PublicDiscoverCard
                        key={kit.id}
                        collection={kit}
                        isOwner={false}
                    />
                )
            })}
        </>
    )
}
