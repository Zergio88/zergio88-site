import {ReactNode} from 'react';
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