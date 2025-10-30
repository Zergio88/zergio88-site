"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Script from "next/script";

// Simple, accessible Contact page with a basic form.
// Notes:
// - Copy uses next-intl with the "contact" namespace (see messages/*.json).
// - For now, submission is handled client-side only (no email sending yet).
// - We'll later plug this into a server action or API route using Resend,
//   and add a CAPTCHA widget (reCAPTCHA/hCaptcha) where indicated below.
const ContactPage: React.FC = () => {
  const t = useTranslations("contact");

  // Local UI state for form fields and submission feedback.
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "limit">("idle");
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaWidgetId, setCaptchaWidgetId] = useState<number | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize reCAPTCHA v2 Checkbox
  useEffect(() => {
    if (!siteKey) return;
    const init = () => {
      const g = typeof window !== 'undefined' ? window.grecaptcha : undefined;
      if (!g) return;
      if (captchaWidgetId !== null) return; // already rendered in this lifecycle
      const container = recaptchaContainerRef.current;
      if (!container) return;
      // If the container already has children (iframe), avoid rendering again
      if (container.childElementCount > 0) return;
      const id = g.render(container, {
        sitekey: siteKey,
        callback: (token: string) => {
          setCaptchaToken(token);
          setErrors((e) => {
            const { captcha, ...rest } = e;
            return rest;
          });
        },
        "expired-callback": () => {
          setCaptchaToken(null);
        },
        theme: "light",
        size: "normal",
      });
      setCaptchaWidgetId(id);
    };

    // If grecaptcha already loaded, init immediately; otherwise set onload handler once
    const g = typeof window !== 'undefined' ? window.grecaptcha : undefined;
    if (g) {
      init();
    } else {
      if (typeof window !== 'undefined') {
        window.onRecaptchaLoad = () => init();
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.onRecaptchaLoad = undefined;
      }
    };
  }, [siteKey, captchaWidgetId]);

  // Basic client-side validation. We'll also validate on the server later.
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = t("validation.name_required");
    if (!form.email.trim()) newErrors.email = t("validation.email_required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = t("validation.email_invalid");
    if (!form.message.trim()) newErrors.message = t("validation.message_required");
    return newErrors;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      setStatus("idle");
      return;
    }

    // TODO: Insert CAPTCHA token retrieval here when we add the widget.
    // e.g., const captchaToken = await captcha.execute();

    try {
      // Execute reCAPTCHA v3 to obtain token
      if (!captchaToken) {
        setStatus("idle");
        setErrors({ captcha: t("form.captcha_required") });
        return;
      }

      // Call API route to send email via Resend.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });

      if (res.status === 429) {
        // Monthly limit reached
        setStatus("limit");
        return;
      }

      if (!res.ok) {
        if (res.status === 400) {
          const data = await res.json().catch(() => null);
          if (data?.reason === "captcha") {
            setErrors({ captcha: t("form.captcha_failed") });
            setStatus("idle");
            return;
          }
        }
        // Optionally read validation errors here and map to setErrors
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      // Reset captcha widget for a new submission cycle
      try {
        const g = typeof window !== 'undefined' ? window.grecaptcha : undefined;
        if (g && captchaWidgetId !== null) {
          g.reset(captchaWidgetId);
        }
        setCaptchaToken(null);
      } catch {}
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-8">
      {/* reCAPTCHA v2 checkbox script */}
      {siteKey && (
        <Script
          src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
          strategy="afterInteractive"
        />
      )}
      {/* Title and short description */}
      <h1 className="text-3xl font-bold tracking-tight mb-2">{t("title")}</h1>
      <p className="text-neutral-600 dark:text-neutral-300 mb-4">{t("description")}</p>

      {/* Social links row: external links open in a new tab; email uses mailto */}
      <div className="mb-8 flex items-center gap-3">
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/sergio-mamani-3405/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label={t("links.linkedin")}
          title={t("links.linkedin")}
        >
          {/* LinkedIn SVG Icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.5 8.5h4V23h-4V8.5zm7.5 0h3.84v1.98h.055c.535-1.015 1.842-2.085 3.79-2.085 4.055 0 4.805 2.67 4.805 6.14V23h-4v-6.42c0-1.53-.03-3.5-2.13-3.5-2.13 0-2.455 1.66-2.455 3.38V23h-4V8.5z" />
          </svg>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/Zergio88"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label={t("links.github")}
          title={t("links.github")}
        >
          {/* GitHub SVG Icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.14 8.96 7.5 10.41.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.05.66-3.7-1.3-3.7-1.3-.5-1.28-1.22-1.62-1.22-1.62-1-.69.08-.68.08-.68 1.11.08 1.7 1.14 1.7 1.14.98 1.68 2.57 1.19 3.2.9.1-.71.38-1.19.7-1.46-2.43-.28-4.98-1.21-4.98-5.38 0-1.19.43-2.16 1.14-2.92-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.12 1.11.9-.25 1.87-.38 2.83-.38.96 0 1.93.13 2.83.38 2.17-1.41 3.12-1.11 3.12-1.11.6 1.54.23 2.68.11 2.96.71.76 1.14 1.73 1.14 2.92 0 4.18-2.55 5.1-4.98 5.38.39.33.74.97.74 1.96 0 1.41-.01 2.54-.01 2.89 0 .29.2.64.75.53 4.36-1.45 7.5-5.56 7.5-10.41C23.02 5.24 18.27.5 12 .5z" />
          </svg>
        </a>

        {/* Email */}
        <a
          href="mailto:sergiomamani@live.com.ar"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label={t("links.email")}
          title={t("links.email")}
        >
          {/* Mail SVG Icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
          </svg>
        </a>
      </div>

  {/* Contact form (kept slightly narrower than the container) */}
  <form onSubmit={onSubmit} noValidate className="space-y-5 max-w-2xl">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {t("form.name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("placeholders.name")}
            value={form.name}
            onChange={onChange}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t("form.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("placeholders.email")}
            value={form.email}
            onChange={onChange}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            {t("form.subject")}
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder={t("placeholders.subject")}
            value={form.subject}
            onChange={onChange}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            {t("form.message")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder={t("placeholders.message")}
            value={form.message}
            onChange={onChange}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        {/* reCAPTCHA v2 widget */}
        {siteKey && (
          <div>
            <div ref={recaptchaContainerRef} id="recaptcha-container" className="mb-2" />
            {errors.captcha && (
              <p className="text-xs text-red-600">{errors.captcha}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {status === "submitting" ? t("form.sending") : t("form.submit")}
          </button>
        </div>

        {/* Submission feedback */}
        {status === "success" && (
          <p className="text-sm text-green-600">{t("form.success")}</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">{t("form.error")}</p>
        )}
        {status === "limit" && (
          <p className="text-sm text-amber-600">{t("form.limit_reached")}</p>
        )}
      </form>
    </div>
  );
};

export default ContactPage;
