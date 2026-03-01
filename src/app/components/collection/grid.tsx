'use client'
import { Collection } from '@db/index'
import { CollectionCard } from './card'

export function CollectionsMasonry({ items }: { items: Collection[] }) {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(collection => (
                <CollectionCard
                    key={collection.id}
                    layoutId={collection.id}
                    bannerLayoutId={collection.id + "-banner"}
                    collection={collection}
                />
            ))}
        </div>
    )
}
