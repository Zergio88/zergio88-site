import type { Metadata } from 'next';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default function AboutLayout({ children }: Props) {
  return <>{children}</>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default as { about?: { title?: string } };
  const title: string = messages?.about?.title ?? (locale === 'es' ? 'Sobre mí' : locale === 'pt' ? 'Sobre mim' : 'About me');
  return { title };
}
