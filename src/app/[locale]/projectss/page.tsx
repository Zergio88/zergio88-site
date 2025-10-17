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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="mb-8">{t("description")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/${locale}/projectss/${post.slug.current}`}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            {post.coverImage && (
              <Image
                src={urlFor(post.coverImage).width(600).height(360).url()}
                alt={post.title}
                width={600}
                height={360}
                className="h-48 w-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
            <div className="p-4">
              <h2 className="font-bold text-lg">{post.title}</h2>
              <p className="mt-2 text-sm">{post.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
