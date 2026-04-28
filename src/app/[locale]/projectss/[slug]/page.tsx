import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPostBySlug, getPosts, urlFor } from '@/lib/sanity';
import PostContent from '@/components/PostContent';
import { routing } from '@/i18n/routing';

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};



export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: 'projectss' });

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-4 text-balance">
        <p className="text-xs uppercase tracking-[0.35em] text-muted">{locale}</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
        {post.publishedAt && (
          <time className="text-xs uppercase tracking-[0.2em] text-muted">
            {new Date(post.publishedAt).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
        {post.description && (
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            {post.description}
          </p>
        )}
        {post.githubUrl && (
          <a
            className="w-fit rounded-md border ui-border px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-2"
            href={post.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t('viewCode')}
          </a>
        )}
      </header>

      {post.coverImage && (
        <Image
          src={urlFor(post.coverImage).width(1600).fit('max').url()}
          alt={post.title}
          width={1600}
          height={900}
          className="h-auto w-full rounded-2xl object-cover shadow-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
        />
      )}

      {post.content ? (
        <section className="prose prose-lg max-w-none prose-headings:mt-10 prose-headings:text-foreground prose-p:text-foreground prose-a:text-accent prose-strong:text-foreground prose-hr:border-border">
          <PostContent content={post.content} />
        </section>
      ) : (
        <p className="text-base text-muted">
          Aún no se agregó contenido detallado a este proyecto. Próximamente habrá más información.
        </p>
      )}

      {post.githubUrl && (
        <footer className="rounded-2xl border ui-border ui-surface p-5 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.25em] text-muted">{t('footerTitle')}</p>
              <p className="text-sm leading-relaxed text-muted">{t('footerDescription')}</p>
            </div>
            <a
              className="w-fit rounded-md border ui-border px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-2"
              href={post.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t('viewCode')}
            </a>
          </div>
        </footer>
      )}
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  const validSlugs = posts.filter((post) => post.slug?.current);
  return routing.locales.flatMap((locale) =>
    validSlugs.map((post) => ({ locale, slug: post.slug.current }))
  );
}

// Set dynamic, localized page title based on the project title
export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  // Fall back to the section title if not found
  if (!post) {
    const messages = (await import(`@/messages/${locale}.json`)).default as { projectss?: { title?: string } };
    const fallback = messages?.projectss?.title ?? 'Projects';
    return { title: fallback };
  }
  return { title: post.title };
}
