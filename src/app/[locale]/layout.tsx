import {ReactNode} from 'react';
import type { Metadata } from 'next';
import {Analytics} from '@vercel/analytics/react';
import Navbar from '@/components/NavBar';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import { routing } from '@/i18n/routing';

interface Props {
  children: ReactNode;
  // En Next 15, params es async:
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({children, params}: Props) {


  // Ensure that the incoming `locale` is valid
  const {locale} = await params; 
  if (!hasLocale(routing.locales, locale)){
    notFound();
  }

  let messages;
  try {
    // path desde: src/app/[locale]/layout.tsx -> /messages
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

// Dynamic, localized metadata for all routes under this locale segment
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { locale } = await params;
  // Load localized messages to set a localized default (home) title
  const messages = (await import(`@/messages/${locale}.json`)).default as { meta?: { home?: string } };
  const homeTitle: string = messages?.meta?.home
    ?? (locale === 'es' ? 'Portafolio' : locale === 'pt' ? 'Portfólio' : 'Portfolio');

  return {
    title: {
      template: 'zergio88 - %s',
      // Ensure home also shows the brand prefix
      default: `zergio88 - ${homeTitle}`
    }
  };
}