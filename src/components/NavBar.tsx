"use client";
import Image from "next/image";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "theme";

const languages = [
  { code: "en-US", label: "English", flag: "us" },
  { code: "es-ES", label: "Español", flag: "es" },
  { code: "pt-BR", label: "Português", flag: "br" },
];

export default function NavBar() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const dataTheme = root.dataset.theme;
    if (dataTheme === "dark" || dataTheme === "light") {
      setTheme(dataTheme);
      return;
    }

    root.dataset.theme = "dark";
    root.style.colorScheme = "dark";
    setTheme("dark");
  }, []);

  function handleSelectOnChange(currentLocale: (typeof routing.locales)[number]) {
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    router.replace({ pathname, query }, { locale: currentLocale });
    setMenuOpen(false); // Close menu when changing language
  }

  function applyTheme(nextTheme: Theme) {
    const root = document.documentElement;
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    setTheme(nextTheme);
  }

  function handleThemeToggle() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  const themeLabel = theme === "dark" ? t("themeDark") : t("themeLight");

  return (
    <nav className="relative w-full border-b ui-border bg-linear-to-b from-background via-surface to-background shadow-md">
      <div className="flex items-center px-4 py-3 md:py-2">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={48}
              height={48}
              className="h-10 w-10 rounded border ui-border transition duration-300 ease-out hover:-rotate-6 hover:brightness-125 md:h-12 md:w-12"
            />
          </Link>
        </div>

        {/* Desktop menu */}
        <ul className="ml-auto hidden items-center space-x-6 text-foreground md:flex">
          <li>
            <Link href="/projectss" className="uppercase decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:underline">
              {t("projects")}
            </Link>
          </li>
          <li>
            <Link href="/contact" className="uppercase decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:underline">
              {t("contact")}
            </Link>
          </li>
          <li>
            <Link href="/about" className="uppercase decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:underline">
              {t("about")}
            </Link>
          </li>
        </ul>

        {/* Language selector desktop */}
        <button
          type="button"
          className="ml-6 hidden rounded-md border ui-border ui-surface px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 ui-focus md:block"
          onClick={handleThemeToggle}
          aria-label={t("themeToggle")}
          aria-pressed={theme === "light"}
          title={`${t("themeToggle")}: ${themeLabel}`}
        >
          {theme === "dark" ? "☀" : "☾"} {themeLabel}
        </button>

        <div className="relative ml-6 hidden md:block">
          <select
            className="rounded-md border ui-border ui-surface px-3 py-2 font-sans font-semibold text-foreground shadow-md transition-all duration-300 hover:bg-surface-2 ui-focus"
            defaultValue={locale}
            onChange={(e) =>
              handleSelectOnChange(e.target.value as (typeof routing.locales)[number])
            }
          >
            {languages.map(({ code, label, flag }) => (
              <option key={code} value={code.slice(0, 2)}>
                {getFlagEmoji(flag)} {label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile right side: language selector + hamburger */}
        <div className="ml-auto flex items-center space-x-3 md:hidden">
          <button
            type="button"
            className="rounded-md border ui-border ui-surface px-2 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-surface-2 ui-focus"
            onClick={handleThemeToggle}
            aria-label={t("themeToggle")}
            aria-pressed={theme === "light"}
            title={`${t("themeToggle")}: ${themeLabel}`}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <select
            className="rounded-md border ui-border ui-surface px-2 py-1 text-sm font-sans font-semibold text-foreground shadow-md transition-all duration-300 hover:bg-surface-2 ui-focus"
            defaultValue={locale}
            onChange={(e) =>
              handleSelectOnChange(e.target.value as (typeof routing.locales)[number])
            }
          >
            {languages.map(({ code }) => (
              <option key={code} value={code.slice(0, 2)}>
                {code.slice(0, 2).toUpperCase()}
              </option>
            ))}
          </select>

          <button
            className="text-muted transition-colors hover:text-foreground ui-focus"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="absolute top-full right-0 z-50 w-40 rounded-b-md border ui-border ui-surface shadow-lg md:hidden">
          <li>
            <Link
              href="/projectss"
              className="block px-4 py-2 text-foreground transition-colors hover:bg-surface-2 hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              {t("projects").toUpperCase()}
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block px-4 py-2 text-foreground transition-colors hover:bg-surface-2 hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              {t("contact").toUpperCase()}
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block px-4 py-2 text-foreground transition-colors hover:bg-surface-2 hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              {t("about").toUpperCase()}
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
