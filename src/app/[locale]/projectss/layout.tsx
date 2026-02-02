import type { Metadata } from 'next';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default function ProjectsLayout({ children }: Props) {
  return <>{children}</>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default as { projectss?: { title?: string } };
  const title: string = messages?.projectss?.title ?? (locale === 'es' ? 'Proyectos' : locale === 'pt' ? 'Projetos' : 'Projects');
  return { title };
}
