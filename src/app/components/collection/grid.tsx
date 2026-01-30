'use client'
import { Collection } from '@db/index'
import { CollectionCard } from './card'

export function CollectionsMasonry({ items }: { items: Collection[] }) {
    return (
        <div className="w-full items-center columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {items.map(collection => (
                <div key={collection.id} className="mb-4">
                    <CollectionCard
                        collection={collection}
                    />
                </div>
            ))}
        </div>
    )
}
