import {ReactNode} from 'react';
import type { Metadata } from 'next';
import {Analytics} from '@vercel/analytics/react';
import Navbar from '@/components/NavBar';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import { cookies } from 'next/headers';
import { routing } from '@/i18n/routing';
import './globals.css';

function getThemeBootstrapScript(initialTheme: 'dark' | 'light') {
  return `(() => {
  try {
    const key = 'theme';
    const saved = window.localStorage.getItem(key);
    const cookieMatch = document.cookie.match(/(?:^|; )theme=(dark|light)(?:;|$)/);
    const cookieTheme = cookieMatch ? cookieMatch[1] : null;
    const theme = saved === 'light' || saved === 'dark'
      ? saved
      : (cookieTheme === 'light' || cookieTheme === 'dark' ? cookieTheme : '${initialTheme}');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = '${initialTheme}';
    document.documentElement.style.colorScheme = '${initialTheme}';
  }
})();`;
}

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

  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  const initialTheme: 'dark' | 'light' = cookieTheme === 'light' ? 'light' : 'dark';
  const themeBootstrapScript = getThemeBootstrapScript(initialTheme);

  return (
    <html lang={locale} data-theme={initialTheme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
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