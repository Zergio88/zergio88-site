import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from '@portabletext/react';
import { getPostBySlug, getPosts, urlFor } from '@/lib/sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { routing } from '@/i18n/routing';

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

type PortableImageValue = SanityImageSource & {
  alt?: string;
};

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: PortableImageValue }) => {
      if (!value || typeof value === 'string' || !('asset' in value)) return null;
      return (
        <figure className="my-8 flex flex-col items-center gap-3">
          <Image
            src={urlFor(value).width(1600).fit('max').url()}
            alt={value?.alt || 'Project media'}
            width={1600}
            height={900}
            className="h-auto w-full rounded-xl object-cover shadow-2xl"
          />
          {value?.alt && (
            <figcaption className="text-sm text-gray-400">{value.alt}</figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="mt-12 text-3xl font-semibold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-10 text-2xl font-semibold text-white">{children}</h3>,
    normal: ({ children }) => <p className="my-5 leading-relaxed text-gray-200">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-white/30 pl-6 text-lg italic text-gray-200">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 list-disc space-y-2 text-gray-200">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal space-y-2 text-gray-200">{children}</ol>
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
        className="font-medium text-sky-400 underline decoration-sky-400/40 underline-offset-4 transition hover:text-sky-300"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }) => <em className="font-medium text-gray-200">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
  },
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
        <p className="text-xs uppercase tracking-[0.35em] text-gray-500">{locale}</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
        {post.publishedAt && (
          <time className="text-xs uppercase tracking-[0.2em] text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
        {post.description && (
          <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
            {post.description}
          </p>
        )}
        {post.githubUrl && (
          <a
            className="w-fit rounded-md border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
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
        <section className="prose prose-invert prose-lg max-w-none prose-headings:mt-10 prose-h2:text-white prose-h3:text-white prose-a:text-sky-400 prose-strong:text-white prose-hr:border-white/20">
          <PortableText value={post.content} components={portableTextComponents} />
        </section>
      ) : (
        <p className="text-base text-gray-400">
          Aún no se agregó contenido detallado a este proyecto. Próximamente habrá más información.
        </p>
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
