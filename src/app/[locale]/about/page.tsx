"use client";

import { useTranslations } from "next-intl";

const AboutPage: React.FC = () => {
  const t = useTranslations("about");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
};

export default AboutPage;
