"use client";

import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] 
      px-6 text-[#c0c0c0] font-mono">

      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
        {t("menu")}
      </h1>

      <p className="text-lg md:text-xl text-center max-w-xl leading-relaxed text-[#a0a0a0]">
        {t("welcome")}
      </p>
    </div>
  );
}

