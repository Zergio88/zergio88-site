'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { SanityGalleryImage } from '@/lib/sanity'

type Props = {
  layout?: 'two-column' | 'single-column' | 'three-column'
  images: SanityGalleryImage[]
  onOpen?: (images: SanityGalleryImage[], index: number) => void
}

export default function ImageGallery({ layout, images, onOpen }: Props) {
  const [selected, setSelected] = useState<SanityGalleryImage | null>(null)

  const close = useCallback(() => setSelected(null), [])

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const gridClass =
    layout === 'three-column'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : layout === 'two-column'
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1'

  // Keep thumbnails contained and avoid the "zoomed crop" feel in previews.
  const thumbHeightClass =
    layout === 'three-column'
      ? 'h-44 sm:h-48 lg:h-44'
      : layout === 'two-column'
        ? 'h-48 sm:h-56 md:h-52'
        : 'h-52 sm:h-60 md:h-64'

  const validImages = images.filter((img) => img.asset?.url)

  if (!validImages.length) return null

  return (
    <>
      {/* ── Gallery grid ─────────────────────────────────────────── */}
      <div className={`grid ${gridClass} gap-4 my-8`}>
        {validImages.map((img, i) => {
          const { url } = img.asset!

          return (
            <button
              key={img._key ?? i}
              type="button"
              onClick={() => onOpen ? onOpen(validImages, i) : setSelected(img)}
              aria-label={img.alt ?? `Open image ${i + 1}`}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-md
                         transition-colors duration-200 hover:border-white/25
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <div className={`relative w-full ${thumbHeightClass}`}>
                <Image
                  src={url}
                  alt={img.alt ?? `Gallery image ${i + 1}`}
                  fill
                  sizes={
                    layout === 'three-column'
                      ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw'
                      : layout === 'two-column'
                        ? '(max-width: 768px) 100vw, 50vw'
                        : '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px'
                  }
                  className="object-contain scale-[1.10] p-0.5"
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Lightbox modal ───────────────────────────────────────── */}
      {selected?.asset?.url && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={close}
        >
          {/* Stop clicks on the image area from closing the modal */}
          <div
            className="relative w-full max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="absolute -top-10 right-0 z-10 flex h-8 w-8 items-center justify-center
                         rounded-full text-white/70 transition hover:bg-white/10 hover:text-white
                         text-xl leading-none"
            >
              ✕
            </button>

            {/* Image — preserves natural aspect ratio, never overflows viewport */}
            <div
              className="relative w-full"
              style={{
                aspectRatio: `${selected.asset.metadata?.dimensions?.width ?? 16} / ${selected.asset.metadata?.dimensions?.height ?? 9}`,
                maxHeight: '85vh',
              }}
            >
              <Image
                src={selected.asset.url}
                alt={selected.alt ?? 'Gallery image'}
                fill
                sizes="(max-width: 768px) 100vw, 90vw"
                className="rounded-xl object-contain shadow-2xl"
                priority
              />
            </div>

            {/* Optional caption */}
            {selected.alt && (
              <p className="mt-3 text-center text-sm text-gray-400">{selected.alt}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
