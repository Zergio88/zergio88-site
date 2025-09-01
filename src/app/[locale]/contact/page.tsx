"use client";

import { useTranslations } from "next-intl";

const ContactPage: React.FC = () => {
  const t = useTranslations("contact");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
};

export default ContactPage;
