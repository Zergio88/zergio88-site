import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import { getAbout, urlFor, type AboutDoc, type AboutSkill, type AboutTimelineItem, type AboutFeatured, type AboutFeaturedPost, type AboutFeaturedExternal } from "@/lib/sanity";
import TechCarousel from "@/components/TechCarousel";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations("aboutPage.labels");
  const about: AboutDoc | null = await getAbout(locale);

  if (!about) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Sobre mí</h1>
        <p className="text-muted-foreground">No se pudo cargar el contenido por ahora.</p>
      </div>
    );
  }

  const portableComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="my-5 leading-relaxed text-gray-200">{children}</p>
      ),
      h2: ({ children }) => (
        <h2 className="mt-10 text-2xl font-semibold text-white">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-8 text-xl font-semibold text-white">{children}</h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-6 border-l-4 border-white/30 pl-4 italic text-gray-200">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="my-4 ml-6 list-disc space-y-2 text-gray-200">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="my-4 ml-6 list-decimal space-y-2 text-gray-200">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="pl-2">{children}</li>,
      number: ({ children }) => <li className="pl-2">{children}</li>,
    },
    marks: {
      link: ({ children, value }) => (
        <a
          href={(value as { href?: string })?.href ?? "#"}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-emerald-400 underline decoration-emerald-400/40 underline-offset-4 hover:text-emerald-300"
        >
          {children}
        </a>
      ),
      strong: ({ children }) => <strong className="text-white">{children}</strong>,
      em: ({ children }) => <em className="text-gray-200">{children}</em>,
      underline: ({ children }) => (
        <span className="underline underline-offset-4">{children}</span>
      ),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      {/* Header: title + tagline (full width) */}
      <section>
        <h1 className="text-4xl font-semibold tracking-tight mb-3">
          {about.title}
        </h1>
        {about.heroTagline && (
          <p className="text-lg text-gray-400 max-w-2xl">{about.heroTagline}</p>
        )}
      </section>

      {/* Bio + Portrait side-by-side on desktop */}
      {(about.bio?.length || about.portrait?.asset) && (
        <section className="grid gap-8 md:grid-cols-[1fr_360px] items-start">
          <div>
            {about.bio && about.bio.length > 0 && (
              <div className="max-w-none">
                <PortableText value={about.bio} components={portableComponents} />
              </div>
            )}
          </div>
          {about.portrait?.asset && (
            <div className="justify-self-end w-full max-w-[380px]">
              {(() => {
                const dims = (about.portrait?.asset as { metadata?: { dimensions?: { width?: number; height?: number } } } | undefined)?.metadata?.dimensions;
                const w = dims?.width || 4
                const h = dims?.height || 5
                const aspect = w / h
                return (
                  <div className="relative rounded-lg overflow-hidden bg-neutral-900/60 shadow-lg" style={{ aspectRatio: aspect }}>
                    <Image
                      src={urlFor(about.portrait).width(800).auto('format').fit('clip').url()}
                      alt={"Portrait"}
                      fill
                      className="object-contain"
                      priority
                      sizes="(min-width: 768px) 360px, 80vw"
                    />
                  </div>
                )
              })()}
            </div>
          )}
        </section>
      )}

      {/* Snapshot (after hero with bio) - without contacts duplication */}
      {(about.snapshot?.role || about.snapshot?.location || about.snapshot?.availability) && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-900/50 rounded-lg p-4">
          {about.snapshot?.role && (
            <div>
              <h3 className="text-sm uppercase text-gray-400">{t("role")}</h3>
              <p className="font-medium">{about.snapshot.role}</p>
            </div>
          )}
          {about.snapshot?.location && (
            <div>
              <h3 className="text-sm uppercase text-gray-400">{t("location")}</h3>
              <p className="font-medium">{about.snapshot.location}</p>
            </div>
          )}
          {about.snapshot?.availability && (
            <div>
              <h3 className="text-sm uppercase text-gray-400">{t("availability")}</h3>
              <p className="font-medium">{about.snapshot.availability}</p>
            </div>
          )}
        </section>
      )}

      {/* Skills */}
      {about.skills && about.skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("technologies")}</h2>
          <TechCarousel skills={about.skills as AboutSkill[]} />
        </section>
      )}

      {/* Timeline */}
      {about.timeline && about.timeline.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("experience")}</h2>
          <ol className="relative border-s border-neutral-800 ps-5 space-y-6">
            {(about.timeline ?? []).map((item: AboutTimelineItem, idx: number) => (
              <li key={idx} className="ms-2">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-emerald-400" />
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  {[item.organization, [item.startDate, item.endDate].filter(Boolean).join(" – ")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {item.summary && item.summary.length > 0 && (
                  <div className="prose prose-invert max-w-none mt-2">
                    <PortableText value={item.summary} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Principles */}
      {about.principles && about.principles.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("principles")}</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {about.principles.map((p, i) => (
              <li key={i} className="rounded-md border border-neutral-800 p-4 bg-neutral-950/40">
                <h3 className="font-medium mb-1">{p.title}</h3>
                {p.description && (
                  <div className="prose prose-invert max-w-none text-sm">
                    <PortableText value={p.description} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Featured */}
      {about.featured && about.featured.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("featured")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {about.featured.map((f: AboutFeatured, i: number) => {
              if (f.type === 'post') {
                const post = (f as AboutFeaturedPost).post
                const href = `/${locale}/projectss/${post.slug?.current}`
                return (
                  <a key={`f-${i}`} href={href} className="group rounded-md border border-neutral-800 p-4 bg-neutral-950/40 hover:border-emerald-600/50 transition-colors">
                    <h3 className="font-medium mb-1 group-hover:text-emerald-400">{post.title}</h3>
                    {post.description && <p className="text-sm text-gray-400 line-clamp-3">{post.description}</p>}
                  </a>
                )
              }
              if (f.type === 'external') {
                const ext = f as AboutFeaturedExternal
                return (
                  <a key={`f-${i}`} href={ext.href || '#'} target="_blank" rel="noreferrer noopener" className="group rounded-md border border-neutral-800 p-4 bg-neutral-950/40 hover:border-emerald-600/50 transition-colors">
                    <h3 className="font-medium mb-1 group-hover:text-emerald-400">{ext.title}</h3>
                    {ext.summary && (
                      <div className="prose prose-invert max-w-none text-sm line-clamp-4">
                        <PortableText value={ext.summary} />
                      </div>
                    )}
                  </a>
                )
              }
              return null
            })}
          </div>
        </section>
      )}
    </div>
  )
}
