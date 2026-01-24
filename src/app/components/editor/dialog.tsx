'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Section, LinkItem, TextItem } from '@/lib/types'

interface SectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section?: Section | null
  onSave: (data: { title: string; description: string }) => void
}

export function SectionDialog({
  open,
  onOpenChange,
  section,
  onSave,
}: SectionDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (section) {
      setTitle(section.title)
      setDescription(section.description || '')
    } else {
      setTitle('')
      setDescription('')
    }
  }, [section, open])

  const handleSave = () => {
    onSave({ title, description })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{section ? 'Edit Section' : 'Add Section'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="section-title">Title</Label>
            <Input
              id="section-title"
              placeholder="e.g., Design Resources"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-description">Description (optional)</Label>
            <Textarea
              id="section-description"
              placeholder="A brief description of this section..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{section ? 'Save' : 'Add Section'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface LinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  link?: LinkItem | null
  onSave: (data: { url: string; title: string; description: string }) => void
}

export function LinkDialog({
  open,
  onOpenChange,
  link,
  onSave,
}: LinkDialogProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (link) {
      setUrl(link.url)
      setTitle(link.title)
      setDescription(link.description || '')
    } else {
      setUrl('')
      setTitle('')
      setDescription('')
    }
  }, [link, open])

  const handleSave = () => {
    onSave({ url, title, description })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{link ? 'Edit Link' : 'Add Link'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-title">Title</Label>
            <Input
              id="link-title"
              placeholder="Link title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-description">Description (optional)</Label>
            <Textarea
              id="link-description"
              placeholder="A brief description of this link..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!url}>
            {link ? 'Save' : 'Add Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface TextDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  text?: TextItem | null
  onSave: (data: { content: string }) => void
}

export function TextDialog({
  open,
  onOpenChange,
  text,
  onSave,
}: TextDialogProps) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (text) {
      setContent(text.content)
    } else {
      setContent('')
    }
  }, [text, open])

  const handleSave = () => {
    onSave({ content })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{text ? 'Edit Text' : 'Add Text'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="text-content">Content</Label>
            <Textarea
              id="text-content"
              placeholder="Write your text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!content}>
            {text ? 'Save' : 'Add Text'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
