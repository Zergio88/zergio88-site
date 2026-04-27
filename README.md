## 1. zergio88-site

Personal portfolio website built with Next.js, focused on performance, interactive 3D UI, multilingual content, and a production-ready contact workflow.

---

## 2. Project Status

This project is in production and actively maintained.

---

## 3. Technology Stack

- Core: Next.js 16, React 19, TypeScript
- Styling and UI: Tailwind CSS 4, Framer Motion
- 3D and visual interaction: Three.js, React Three Fiber, Drei
- Content platform: Sanity CMS, Portable Text
- Internationalization: next-intl (Spanish, English, Portuguese)
- Contact delivery: Resend
- Rate limiting and counters: Redis
- Platform and analytics: Vercel, Vercel Analytics
- Quality and testing: ESLint, Jest, Testing Library

---

## 4. Technical Highlights

- Localized routing and message catalogs for multi-language pages
- Dynamic portfolio content managed from Sanity
- Custom API route for contact submissions with validation and reCAPTCHA verification
- Daily and monthly contact limits backed by Redis (with safe fallback behavior)
- Component-based frontend architecture with reusable UI and animation modules

---

## 5. Main Structure

```text
src/
    app/
        [locale]/
            about/
            contact/
            projectss/
        api/contact/
    components/
    i18n/
    lib/
    messages/
```

---

## 6. Production

- Live site: [zergio88.site](https://zergio88.site)
- Hosting: Vercel