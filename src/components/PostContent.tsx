"use client"

import { useState } from 'react'
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from '@portabletext/react'
import Image from 'next/image'
import type { PortableTextBlock } from '@portabletext/types'
import type { ImageGalleryPortableTextItem, SanityGalleryImage } from '@/lib/sanity'
import ImageGallery from '@/components/ImageGallery'
import Lightbox from '@/components/Lightbox'
import { urlFor } from '@/lib/sanity'

type Props = {
  content?: Array<PortableTextBlock | ImageGalleryPortableTextItem> | null
}

const portableTextComponents: PortableTextComponents = {
  types: {
    imageGallery: ({ value }: { value: ImageGalleryPortableTextItem }) => {
      if (!value?.images?.length) return null
      return <ImageGallery layout={value.layout ?? 'single-column'} images={value.images} onOpen={handleOpenPlaceholder} />
    },
    image: ({ value }: { value: any }) => {
      if (!value || typeof value === 'string' || !('asset' in value)) return null
      return (
        <figure className="my-8 flex flex-col items-center gap-3">
          <Image
            src={urlFor(value).width(1600).fit('max').url()}
            alt={value?.alt || 'Project media'}
            width={1600}
            height={900}
            className="h-auto w-full rounded-xl object-cover shadow-2xl"
          />
          {value?.alt && <figcaption className="text-sm text-muted">{value.alt}</figcaption>}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }) => <h2 className="mt-12 text-3xl font-semibold text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-10 text-2xl font-semibold text-foreground">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-8 text-xl font-semibold text-foreground">{children}</h4>,
    normal: ({ children }) => <p className="my-5 leading-relaxed text-foreground">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 ui-border pl-6 text-lg italic text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 list-disc space-y-2 text-foreground [&_ul]:mt-2 [&_ul]:ml-6 [&_ul]:list-[circle] [&_ul_ul]:list-disc">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal space-y-2 text-foreground [&_ol]:mt-2 [&_ol]:ml-6 [&_ol]:list-[lower-alpha]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-2">{children}</li>,
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<{ _type: string; href?: string }>) => (
      <a
        href={value?.href ?? '#'}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-accent underline decoration-accent underline-offset-4 transition hover:opacity-85"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="font-medium text-foreground">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
  },
}

function handleOpenPlaceholder() {
  // Intentionally no-op here; ImageGallery receives the real handler from PostContent.
}

export default function PostContent({ content }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeImages, setActiveImages] = useState<SanityGalleryImage[]>([])
  const [startIndex, setStartIndex] = useState(0)

  const handleOpen = (images: SanityGalleryImage[], index: number) => {
    const galleryImages = images.filter((image): image is SanityGalleryImage & { asset: { url: string } } => Boolean(image.asset?.url))
    if (!galleryImages.length) return
    setActiveImages(galleryImages)
    setStartIndex(Math.min(index, galleryImages.length - 1))
    setLightboxOpen(true)
  }

  const components: PortableTextComponents = {
    ...portableTextComponents,
    types: {
      ...portableTextComponents.types,
      imageGallery: ({ value }: { value: ImageGalleryPortableTextItem }) => {
        if (!value?.images?.length) return null
        return <ImageGallery layout={value.layout ?? 'single-column'} images={value.images} onOpen={handleOpen} />
      },
    },
  }

  return (
    <div>
      <PortableText value={content as any} components={components as any} />
      {lightboxOpen && (
        <Lightbox
          images={activeImages}
          startIndex={startIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
