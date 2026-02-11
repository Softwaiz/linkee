import { CollectionActions } from './collection-actions'

interface CollectionViewProps {
  collection: Collection;
  likesCount?: number;
  savesCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export function CollectionView({ collection, readOnly, likesCount = 0, savesCount = 0, isLiked = false, isSaved = false }: CollectionViewProps & { readOnly?: boolean }) {
  const totalLinks = collection.nodes.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalSections = collection.nodes.length

  const actions = (
    <CollectionActions
      collectionId={collection.id}
      initialLikes={likesCount}
      initialSaves={savesCount}
      initialIsLiked={isLiked}
      initialIsSaved={isSaved}
    />
  )

  return (
    <div className="w-full px-4 lg:px-0 min-h-screen  bg-background">
      <div data-has-left={Boolean(collection.banner || collection.picture)} className="w-full max-w-2xl px-4 data-[has-left=true]:px-0 data-[has-left=true]:container mx-auto grid grid-cols-12 py-4 gap-4">
        {!(collection.banner || collection.picture) && <div className="col-span-12">
          <h1 className="text-2xl">{collection.label}</h1>
          <p className='text-base'>
            {collection.description}
          </p>
          {readOnly && actions}
        </div>}
        <div className="col-span-12 lg:col-span-4">
          {(collection.banner || collection.picture) && <div className="w-full lg:sticky lg:top-20 lg:left-0 space-y-4">
            <CollectionProfile
              readOnly={readOnly}
              collection={collection}>
              {collection.nodes.length > 0 && !readOnly && (
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="lg" className="gap-2 bg-transparent" asChild>
                    <Link href={`/collections/${collection.slug ?? collection.id}/edit`}>
                      <Pencil className="size-4" />
                      Edit this collection
                    </Link>
                  </Button>
                </div>
              )}
              {readOnly && actions}
            </CollectionProfile>
          </div>
          }
        </div>

        <div data-has-left={Boolean(collection.banner || collection.picture)} className="col-span-12 lg:col-span-8 lg:data-[has-left=false]:col-span-12">
          {collection.nodes.length > 0 ? (
            <div className="space-y-12">
              {collection.nodes.map((section) => (
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
                {readOnly ? 'This collection is empty.' : 'Start building your collection by adding sections and links'}
              </p>
              {!readOnly && (
                <Button asChild>
                  <Link href={`/collections/${collection.slug ?? collection.id}/edit`}>
                    <Pencil className="mr-2 size-4" />
                    Start Editing
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
