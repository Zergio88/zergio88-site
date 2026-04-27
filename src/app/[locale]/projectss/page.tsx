"use client"
import { useTranslations, useLocale } from "next-intl"
import { getPosts, urlFor } from "@/lib/sanity"
import type { PostSummary } from "@/lib/sanity"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ProjectsPage() {
  const t = useTranslations("projectss")
  const locale = useLocale()
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts(locale)
        setPosts(data)
      } catch (err) {
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [locale]) // vuelve a traer si cambia el idioma

  if (loading) return <p>Cargando...</p>

  return (
    <div className="mx-auto max-w-6xl px-6 pt-8 pb-12">
      <h1 className="mb-3 text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mb-8 text-muted">{t("description")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.filter((p) => !!p.slug?.current).map((post) => (
          <Link
            key={post._id}
            href={`/${locale}/projectss/${post.slug.current}`}
            className="project-card group rounded-lg border ui-border ui-surface shadow-lg hover:border-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {post.coverImage && (
              <div className="project-card-media">
                <Image
                  src={urlFor(post.coverImage).width(600).height(360).url()}
                  alt={post.title}
                  width={600}
                  height={360}
                  className="project-card-image h-48 w-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="project-card-content p-4">
              <h2 className="project-card-title font-bold text-lg">{post.title}</h2>
              <p className="project-card-description mt-2 text-sm">{post.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
