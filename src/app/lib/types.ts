export type LinkItem = {
  id: string
  type: 'link'
  url: string
  title: string
  description?: string
  favicon?: string
}

export type TextItem = {
  id: string
  type: 'text'
  content: string
}

export type SectionItem = LinkItem | TextItem

export type Section = {
  id: string
  title: string
  description?: string
  items: SectionItem[]
}

export type Page = {
  id: string
  label: string
  description?: string
  nodes: Section[]
}
