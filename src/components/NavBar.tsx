"use client";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import "../app/[locale]/globals.css";
import Link from "next/link";

const languages = [
  { code: "pt-BR", label: "Português", flag: "br"},
  { code: "en-US", label: "English", flag: "us"},
  { code: "es-ES", label: "Español", flag: "es"},  
];


export default function NavBar() {
const router = useRouter(); // allows you to change the URL without reloading the page
  const locale = useLocale(); // current language (example: "es")
  const pathname = usePathname(); // current path

  // translation hook
  const t = useTranslations("navbar");

  function handleSelectOnChange(currentLocale: (typeof routing.locales)[number]){
    const query = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );
    // change the URL without refreshing
    router.replace({ pathname, query }, { locale: currentLocale });
  }

  return (
    <div className="w-full flex items-center py-4 px-4 
      bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">

      {/* Logo on the left */}
      <div className="flex items-center space-x-2">
        <Link href={`/${locale}`}>   
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </Link>
      </div>

      {/* Links and language selector on the right */}
      <div className="flex items-center space-x-6 ml-auto">
        <ul className="flex space-x-6">
          <li>
            <Link href={`/${locale}/projectss`}>
              {t("projects")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/contact`}>
              {t("contact")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/about`}>
              {t("about")}
            </Link>
          </li>
        </ul>
        </div>

        <div className="relative ml-6">
          <select 
            className="px-3 py-2 rounded-md bg-[#f0f0f0]/10 text-[#c0c0c0] 
            font-mono font-semibold shadow-md hover:bg-[#f0f0f0]/20 transition-all duration-300"
            defaultValue={locale}
            onChange={(e) => handleSelectOnChange(e.target.value as (typeof routing.locales)[number])}
          >
            {routing.locales.map((currentLocale) => (
              <option key={currentLocale} value={currentLocale}>
                {currentLocale}
              </option>
            ))}
          </select>

        </div>
    </div>
  );
}