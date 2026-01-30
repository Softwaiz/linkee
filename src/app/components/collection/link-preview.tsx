'use client'

import { ExternalLink } from 'lucide-react'
import type { LinkItem } from '@/lib/types'

interface LinkPreviewProps {
  link: LinkItem
}

export function LinkPreview({ link }: LinkPreviewProps) {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-accent/50 hover:shadow-md hover:shadow-accent/5"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary-100 text-secondary-500 transition-colors group-hover:bg-accent/10 group-hover:text-accent">
        {link.favicon ? (
          <img
            src={link.favicon || "/placeholder.svg"}
            alt=""
            className="size-5 rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <ExternalLink className={`size-4 ${link.favicon ? 'hidden' : ''}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h4 className="truncate font-medium text-foreground transition-colors group-hover:text-accent">
            {link.title || 'Untitled Link'}
          </h4>
          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        {link.description && (
          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
            {link.description}
          </p>
        )}
        <span className="text-xs text-muted-foreground/70">{getDomain(link.url)}</span>
      </div>
    </a>
  )
}
