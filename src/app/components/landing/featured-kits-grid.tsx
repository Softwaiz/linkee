'use client'

import { Collection } from '@db/index'
import { PublicDiscoverCard } from '../discover/discover-card'

interface FeaturedKitsGridProps {
    items: Array<{
        id: string
        href: string
        title: string
        description: string | null
        topicCount: number
        linkCount: number
        category: string
        color: string
        banner?: string | null
        userAlias?: string
        userFullName?: string
        slug?: string | null
        nodes: unknown
    }>
}

export function FeaturedKitsGrid({ items }: FeaturedKitsGridProps) {
    return (
        <>
            {items.map((kit) => {
                // Shape the kit into a Collection-compatible object for the popup
                const collection = {
                    id: kit.id,
                    label: kit.title,
                    description: kit.description,
                    banner: kit.banner ?? null,
                    slug: kit.slug ?? null,
                    nodes: kit.nodes as Collection['nodes'],
                    userAlias: kit.userAlias ?? null,
                    userFullName: kit.userFullName ?? null,
                } as Collection & { userAlias: string | null; userFullName: string | null }

                return (
                    <PublicDiscoverCard
                        key={kit.id}
                        collection={collection}
                        isOwner={false}
                    />
                )
            })}
        </>
    )
}
