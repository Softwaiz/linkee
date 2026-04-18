'use client'
import type { Page } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Collection } from '@db/index'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Layers } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from '../link'

function timeAgo(date: Date | string) {
    const d = new Date(date);
    const now = new Date();
    const seconds = Math.round((now.getTime() - d.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}


export function PublicCollectionsGrid({ items }: { items: Collection[] }) {
    if (items.length === 0) {
        return <div className="mt-12 text-center">
            <p className="text-muted-foreground">No collections found.</p>
        </div>
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(collection => (
                <Card key={collection.id} className="group relative py-3 flex flex-col overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className='px-3'>
                        <div className="flex items-start justify-between">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                <Layers className="size-5" />
                            </div>
                        </div>
                        <CardTitle className="line-clamp-1 mt-4">{collection.label || 'Untitled'}</CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[2.5em]">
                            {collection.description || 'No description provided'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 px-3">
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="font-normal">
                                {collection.nodes.length} sections
                            </Badge>
                        </div>
                    </CardContent>
                    <CardFooter className="p-3 border-t py-0 [.border-t]:pt-3 text-xs flex flex-row items-center justify-between">
                        <span className="text-muted-foreground">
                            Updated {timeAgo(collection.updatedAt)}
                        </span>
                        <Button size="sm" asChild>
                            <Link href={`/kit/${collection.slug || collection.id}`}>
                                View
                                <ArrowRight />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
