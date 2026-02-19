'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { SanityGalleryImage } from '@/lib/sanity'

type Props = {
  layout: 'two-column' | 'single-column'
  images: SanityGalleryImage[]
}

export default function ImageGallery({ layout, images }: Props) {
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
    layout === 'two-column'
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1'

  const validImages = images.filter((img) => img.asset?.url)

  if (!validImages.length) return null

  return (
    <>
      {/* ── Gallery grid ─────────────────────────────────────────── */}
      <div className={`grid ${gridClass} gap-4 my-8`}>
        {validImages.map((img, i) => {
          const { url } = img.asset!
          const w = img.asset?.metadata?.dimensions?.width ?? 1200
          const h = img.asset?.metadata?.dimensions?.height ?? 800
          const aspectRatio = w / h

          return (
            <button
              key={img._key ?? i}
              type="button"
              onClick={() => setSelected(img)}
              aria-label={img.alt ?? `Open image ${i + 1}`}
              className="group relative overflow-hidden rounded-xl border border-white/10 shadow-md
                         transition-transform duration-300 hover:scale-[1.02]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              {/* Maintain natural aspect ratio without a fixed height */}
              <div
                className="relative w-full"
                style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
              >
                <Image
                  src={url}
                  alt={img.alt ?? `Gallery image ${i + 1}`}
                  fill
                  sizes={
                    layout === 'two-column'
                      ? '(max-width: 768px) 100vw, 50vw'
                      : '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px'
                  }
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
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
