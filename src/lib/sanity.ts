import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-09-12',   // la fecha de hoy es suficiente
  useCdn: false,               // true = datos cacheados, false = siempre frescos
})

const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)

const FALLBACK_LOCALES = ['es', 'en', 'pt'] as const

function normalizeLocale(locale: string): (typeof FALLBACK_LOCALES)[number] {
  const lower = locale.toLowerCase()
  const base = lower.split('-')[0]
  const match = FALLBACK_LOCALES.find((lang) => lang === lower || lang === base)
  return match ?? FALLBACK_LOCALES[0]
}

function buildFallbackCoalesce(field: string) {
  const fallbacks = FALLBACK_LOCALES.map((lang) => `${field}.${lang}`).join(', ')
  return `coalesce(${field}[$locale], ${fallbacks})`
}

export async function getPosts(locale: string = 'es') {
  const safeLocale = normalizeLocale(locale)
  const query = `*[_type == "post"]|order(publishedAt desc){
    _id,
    slug,
    githubUrl,
    coverImage,
    "title": ${buildFallbackCoalesce('title')},
    "description": ${buildFallbackCoalesce('description')}
  }`
  try {
    console.log("Sanity: fetching posts...", safeLocale)       // 👈 log inicial
    const posts = await sanityClient.fetch(query, { locale: safeLocale })
    console.log("Sanity: posts fetched:", posts)   // 👈 revisar qué llega
    return posts
  } catch (err) {
    console.error("Sanity: error fetching posts", err) // 👈 revisar errores
    return []                                       // 👈 evitar que falle la página
  }
}

export async function getPostBySlug(slug: string, locale: string = 'es') {
  const safeLocale = normalizeLocale(locale)
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    "title": ${buildFallbackCoalesce('title')},
    slug,
    githubUrl,
    coverImage,
  "description": ${buildFallbackCoalesce('description')},
  "content": ${buildFallbackCoalesce('content')},
    publishedAt
  }`
  try {
    console.log("Sanity: fetching post by slug...", slug, safeLocale)
    return await sanityClient.fetch(query, { slug, locale: safeLocale })
  } catch (err) {
    console.error("Sanity: error fetching post", err)
    return null
  }
}

