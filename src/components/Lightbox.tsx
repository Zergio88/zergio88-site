"use client"

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import type { SanityGalleryImage } from '@/lib/sanity'

type Props = {
  images: SanityGalleryImage[]
  startIndex: number
  onClose: () => void
}

export default function Lightbox({ images, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex)
  const startX = useRef<number | null>(null)

  useEffect(() => setIndex(startIndex), [startIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, images.length - 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  if (!images?.length) return null

  const prev = () => setIndex((i) => Math.max(i - 1, 0))
  const next = () => setIndex((i) => Math.min(i + 1, images.length - 1))

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return
    const delta = e.touches[0].clientX - startX.current
    // simple threshold
    if (delta > 60) {
      prev()
      startX.current = null
    } else if (delta < -60) {
      next()
      startX.current = null
    }
  }

  const img = images[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {/* Close button slightly inset for mobile */}
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-10 w-10 rounded-full bg-black/40 text-white text-lg md:h-12 md:w-12 md:text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Prev / Next */}
        <button
          aria-label="Previous image"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/30 text-white md:h-16 md:w-16 md:text-3xl"
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/30 text-white md:h-16 md:w-16 md:text-3xl"
        >
          ›
        </button>

        <div className="relative w-full h-[75vh] mx-auto flex items-center justify-center">
          <Image
            src={img.asset!.url}
            alt={img.alt ?? 'Gallery image'}
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-contain rounded-xl shadow-2xl"
            priority
          />
        </div>

        <div className="mt-3 text-center text-sm text-gray-300">{index + 1} / {images.length}</div>
      </div>
    </div>
  )
}
