import type { Metadata } from 'next';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default function ContactLayout({ children }: Props) {
  return <>{children}</>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default as { contact?: { title?: string } };
  const title: string = messages?.contact?.title ?? (locale === 'es' ? 'Contacto' : locale === 'pt' ? 'Contato' : 'Contact');
  return { title };
}
