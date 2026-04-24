type Locale = "es" | "en" | "pt";

type TerminalAction = {
  label: string;
  href: string;
  external?: boolean;
};

type AboutTerminalProps = {
  locale: string;
  title: string;
  bioLines: string[];
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  projectsHref: string;
  contactHref: string;
};

type Copy = {
  emailLabel: string;
  githubLabel: string;
  linkedinLabel: string;
  projectsLabel: string;
  contactLabel: string;
  summaryLabel: string;
  summaryPrefix: string;
  actionsLabel: string;
};

function normalizeLocale(locale: string): Locale {
  if (locale === "en" || locale === "pt") {
    return locale;
  }

  return "es";
}

function getCopy(locale: Locale): Copy {
  const copyByLocale: Record<Locale, Copy> = {
    es: {
      emailLabel: "Enviar email",
      githubLabel: "Abrir GitHub",
      linkedinLabel: "Abrir LinkedIn",
      projectsLabel: "Ver proyectos",
      contactLabel: "Ir a contacto",
      summaryLabel: "Resumen",
      summaryPrefix: "-",
      actionsLabel: "Accesos directos",
    },
    en: {
      emailLabel: "Send email",
      githubLabel: "Open GitHub",
      linkedinLabel: "Open LinkedIn",
      projectsLabel: "View projects",
      contactLabel: "Go to contact",
      summaryLabel: "Summary",
      summaryPrefix: "-",
      actionsLabel: "Quick links",
    },
    pt: {
      emailLabel: "Enviar email",
      githubLabel: "Abrir GitHub",
      linkedinLabel: "Abrir LinkedIn",
      projectsLabel: "Ver projetos",
      contactLabel: "Ir para contato",
      summaryLabel: "Resumo",
      summaryPrefix: "-",
      actionsLabel: "Acessos rapidos",
    },
  };

  return copyByLocale[locale];
}

function buildActions(
  email: string,
  githubUrl: string,
  linkedinUrl: string,
  projectsHref: string,
  contactHref: string,
  copy: Copy
): TerminalAction[] {
  return [
    { label: copy.projectsLabel, href: projectsHref },
    { label: copy.contactLabel, href: contactHref },
    { label: copy.emailLabel, href: `mailto:${email}` },
    { label: copy.githubLabel, href: githubUrl, external: true },
    { label: copy.linkedinLabel, href: linkedinUrl, external: true },
  ];
}

export default function AboutTerminal({
  locale,
  title,
  bioLines,
  email,
  githubUrl,
  linkedinUrl,
  projectsHref,
  contactHref,
}: AboutTerminalProps) {
  const normalizedLocale = normalizeLocale(locale);
  const copy = getCopy(normalizedLocale);
  const summaryLines = bioLines.slice(0, 4);
  const actions = buildActions(
    email,
    githubUrl,
    linkedinUrl,
    projectsHref,
    contactHref,
    copy
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-(--terminal-shell-border) bg-(--terminal-shell-bg) shadow-(--terminal-shadow)">
      <div className="flex items-center gap-3 border-b border-(--terminal-header-border) bg-linear-to-r from-(--terminal-header-from) via-(--terminal-header-via) to-(--terminal-header-to) px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-(--terminal-dot-red) shadow-(--terminal-dot-red-shadow)" />
          <span className="h-3 w-3 rounded-full bg-(--terminal-dot-yellow) shadow-(--terminal-dot-yellow-shadow)" />
          <span className="h-3 w-3 rounded-full bg-(--terminal-dot-green) shadow-(--terminal-dot-green-shadow)" />
        </div>

        <div className="min-w-0 flex-1 truncate text-center font-mono text-sm leading-tight tracking-wide text-(--terminal-title) md:text-base">
          {title || "bash - terminal"}
        </div>
      </div>

      <div className="bg-(--terminal-body-bg) px-5 py-5 md:px-6 md:py-6">
        <div className="space-y-5 font-mono text-xs leading-6 text-(--terminal-text) sm:text-sm">
          {summaryLines.length > 0 && (
            <div className="space-y-3">
              <p className="text-(--terminal-prompt)">{copy.summaryLabel}</p>
              <div className="space-y-2">
                {summaryLines.map((line, index) => (
                  <p key={`${line}-${index}`} className="wrap-break-word text-(--terminal-text)">
                    <span className="text-(--terminal-separator)">{copy.summaryPrefix} </span>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-(--terminal-prompt)">{copy.actionsLabel}</p>
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noreferrer noopener" : undefined}
                  className="rounded-md border border-(--terminal-link-border) bg-(--terminal-link-bg) px-3 py-1.5 text-(--terminal-link-text) transition-colors hover:border-(--terminal-link-border-hover) hover:text-(--terminal-link-text-hover)"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}