"use client";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import "../app/[locale]/globals.css";
import Link from "next/link";
import { useState } from "react";

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

  function handleSelectOnChange(currentLocale: (typeof routing.locales)[number]) {
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    router.replace({ pathname, query }, { locale: currentLocale });
    setMenuOpen(false); // Cerrar menú al cambiar idioma
  }

  return (
    <nav className="relative w-full bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] shadow-md">
      <div className="flex items-center py-3 md:py-2 px-4">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href={`/${locale}`}>
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-10 w-10 md:h-12 md:w-12 border border-white rounded hover:brightness-125 transition duration-300"
            />
          </Link>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center space-x-6 ml-auto">
          <li>
            <Link href={`/${locale}/projectss`} className="uppercase">
              {t("projects")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/contact`} className="uppercase">
              {t("contact")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/about`} className="uppercase">
              {t("about")}
            </Link>
          </li>
        </ul>

        {/* Language selector desktop */}
        <div className="hidden md:block relative ml-6">
          <select
            className="px-3 py-2 rounded-md bg-[#f0f0f0]/10 text-[#c0c0c0] font-sans font-semibold shadow-md hover:bg-[#f0f0f0]/20 transition-all duration-300"
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
        <div className="flex items-center md:hidden ml-auto space-x-4">
          <select
            className="px-2 py-1 rounded-md bg-[#f0f0f0]/10 text-[#c0c0c0] font-sans font-semibold shadow-md hover:bg-[#f0f0f0]/20 transition-all duration-300 text-sm"
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
            className="text-gray-400 hover:text-white focus:outline-none"
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
        <ul className="md:hidden absolute top-full right-0 w-40 bg-[#1a1a1a] rounded-b-md shadow-lg z-50">
          <li>
            <Link
              href={`/${locale}/projectss`}
              className="block px-4 py-2 text-white hover:bg-[#333]"
              onClick={() => setMenuOpen(false)}
            >
              {t("projects").toUpperCase()}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/contact`}
              className="block px-4 py-2 text-white hover:bg-[#333]"
              onClick={() => setMenuOpen(false)}
            >
              {t("contact").toUpperCase()}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/about`}
              className="block px-4 py-2 text-white hover:bg-[#333]"
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
