"use client";

import { useEffect, useRef, useState } from "react";

type Locale = "es" | "en" | "pt";

type TerminalAction = {
  label: string;
  href: string;
  external?: boolean;
};

type HelpGroupLine = {
  kind: "helpGroup";
  title: string;
  commands: string[];
};

type TerminalLine = string | HelpGroupLine;

type TerminalEntry = {
  id: number;
  command?: string;
  lines: TerminalLine[];
  actions?: TerminalAction[];
  tone?: "default" | "error";
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
  hint: string;
  placeholder: string;
  helpHeader: string;
  helpNote: string;
  helpGroups: Array<{ title: string; commands: string[] }>;
  unknown: (command: string) => string;
  tryHelp: string;
  whoami: string[];
  stack: string[];
  experience: string[];
  education: string[];
  goals: string[];
  projects: string[];
  contact: string[];
  emailLabel: string;
  githubLabel: string;
  linkedinLabel: string;
  projectsLabel: string;
  contactLabel: string;
};

const PROMPT = "sergio@portfolio:~$";
const MAX_HISTORY = 18;

function getCopy(locale: Locale, title: string): Copy {
  const copyByLocale: Record<Locale, Copy> = {
    es: {
      hint: 'Escribe "help" para ver los comandos disponibles.',
      placeholder: "Escribe un comando...",
      helpHeader: "Comandos disponibles:",
      helpNote: 'Nota: "navegacion", "perfil" y "contacto" son categorias, no comandos.',
      helpGroups: [
        { title: "navegacion", commands: ["help", "about", "whoami", "clear"] },
        { title: "perfil", commands: ["stack", "experience", "education", "goals", "projects"] },
        { title: "contacto", commands: ["email", "github", "linkedin", "contact"] },
      ],
      unknown: (command) => `${command}: comando no encontrado`,
      tryHelp: 'Escribe "help" para ver los comandos disponibles.',
      whoami: [title],
      stack: [
        "Principal: Java, Spring Boot.",
        "Tambien use: Go, React, Android (Java y Kotlin), Firestore, VBA, Python, Bash y Batch.",
        "Explorando: Docker y fundamentos de IA.",
      ],
      experience: [
        "Experiencia en entornos IT como tecnico y analista, desarrollando soluciones de automatizacion y herramientas para optimizar procesos operativos.",
        "",
        "Participacion en el desarrollo de aplicaciones de escritorio y moviles orientadas a resolver necesidades reales.",
      ],
      education: [
        "UADE - Licenciatura en Gestion de Tecnologias de la Informacion",
        "En curso (graduacion estimada 2027)",
        "",
        "QA Tester - UTN FRBA (2021)",
        "",
        "Tecnico Informatico (Secundario)",
      ],
      goals: [
        "- Profundizar en desarrollo backend con Java",
        "- Fortalecer conocimientos en Spring Boot",
        "- Preparar certificacion Java SE 21",
        "- Continuar explorando tecnologias modernas como IA y desarrollo fullstack",
      ],
      projects: [
        "Puedes abrir la seccion completa de proyectos desde aqui.",
      ],
      contact: [
        "Canales directos disponibles:",
      ],
      emailLabel: "Enviar email",
      githubLabel: "Abrir GitHub",
      linkedinLabel: "Abrir LinkedIn",
      projectsLabel: "Ver proyectos",
      contactLabel: "Ir a contacto",
    },
    en: {
      hint: 'Type "help" to see available commands.',
      placeholder: "Type a command...",
      helpHeader: "Available commands:",
      helpNote: 'Note: "navigation", "profile", and "contact" are categories, not commands.',
      helpGroups: [
        { title: "navigation", commands: ["help", "about", "whoami", "clear"] },
        { title: "profile", commands: ["stack", "experience", "education", "goals", "projects"] },
        { title: "contact", commands: ["email", "github", "linkedin", "contact"] },
      ],
      unknown: (command) => `${command}: command not found`,
      tryHelp: 'Type "help" to see available commands.',
      whoami: [title],
      stack: [
        "Primary: Java, Spring Boot.",
        "Also used: Go, React, Android (Java & Kotlin), Firestore, VBA, Python, Bash, and Batch.",
        "Exploring: Docker and AI fundamentals.",
      ],
      experience: [
        "Experience in IT environments as a technician and analyst, developing automation solutions and tools to optimize operational processes.",
        "",
        "Involvement in developing desktop and mobile applications aimed at solving real needs.",
      ],
      education: [
        "UADE - Bachelor's in Information Technology Management",
        "In progress (expected graduation 2027)",
        "",
        "QA Tester - UTN FRBA (2021)",
        "",
        "Computer Technician (Secondary School)",
      ],
      goals: [
        "- Deepen backend development with Java",
        "- Strengthen knowledge in Spring Boot",
        "- Prepare for Java SE 21 certification",
        "- Continue exploring modern technologies like AI and fullstack development",
      ],
      projects: [
        "You can open the full projects section from here.",
      ],
      contact: [
        "Direct contact channels:",
      ],
      emailLabel: "Send email",
      githubLabel: "Open GitHub",
      linkedinLabel: "Open LinkedIn",
      projectsLabel: "View projects",
      contactLabel: "Go to contact",
    },
    pt: {
      hint: 'Digite "help" para ver os comandos disponiveis.',
      placeholder: "Digite um comando...",
      helpHeader: "Comandos disponiveis:",
      helpNote: 'Nota: "navegacao", "perfil" e "contato" sao categorias, nao comandos.',
      helpGroups: [
        { title: "navegacao", commands: ["help", "about", "whoami", "clear"] },
        { title: "perfil", commands: ["stack", "experience", "education", "goals", "projects"] },
        { title: "contato", commands: ["email", "github", "linkedin", "contact"] },
      ],
      unknown: (command) => `${command}: comando nao encontrado`,
      tryHelp: 'Digite "help" para ver os comandos disponiveis.',
      whoami: [title],
      stack: [
        "Principal: Java, Spring Boot.",
        "Tambem usei: Go, React, Android (Java e Kotlin), Firestore, VBA, Python, Bash e Batch.",
        "Explorando: Docker e fundamentos de IA.",
      ],
      experience: [
        "Experiencia em ambientes de TI como tecnico e analista, desenvolvendo solucoes de automacao e ferramentas para otimizar processos operacionais.",
        "",
        "Participacao no desenvolvimento de aplicacoes desktop e mobile voltadas a resolver necessidades reais.",
      ],
      education: [
        "UADE - Licenciatura em Gestao de Tecnologias da Informacao",
        "Em curso (conclusao estimada em 2027)",
        "",
        "QA Tester - UTN FRBA (2021)",
        "",
        "Tecnico em Informatica (Ensino Medio)",
      ],
      goals: [
        "- Aprofundar o desenvolvimento backend com Java",
        "- Fortalecer conhecimentos em Spring Boot",
        "- Preparar certificacao Java SE 21",
        "- Continuar explorando tecnologias modernas como IA e desenvolvimento fullstack",
      ],
      projects: [
        "Voce pode abrir a secao completa de projetos daqui.",
      ],
      contact: [
        "Canais diretos disponiveis:",
      ],
      emailLabel: "Enviar email",
      githubLabel: "Abrir GitHub",
      linkedinLabel: "Abrir LinkedIn",
      projectsLabel: "Ver projetos",
      contactLabel: "Ir para contato",
    },
  };

  return copyByLocale[locale];
}

function normalizeLocale(locale: string): Locale {
  if (locale === "en" || locale === "pt") {
    return locale;
  }

  return "es";
}

function normalizeCommand(command: string): string {
  return command
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function initialEntries(copy: Copy, bioLines: string[]): TerminalEntry[] {
  return [
    {
      id: 1,
      lines: [copy.hint],
    },
    {
      id: 2,
      command: "about",
      lines: [...bioLines],
    },
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
  const copy = getCopy(normalizedLocale, title);
  const [history, setHistory] = useState<TerminalEntry[]>(() => initialEntries(copy, bioLines));
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(3);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [history]);

  const aliases: Record<string, string> = {
    ayuda: "help",
    ajuda: "help",
    sobre: "about",
    sobremi: "about",
    sobremim: "about",
    quiensoy: "whoami",
    quemsou: "whoami",
    projetos: "projects",
    proyectos: "projects",
    experiencia: "experience",
    experencia: "experience",
    educacion: "education",
    educacao: "education",
    objetivos: "goals",
    metas: "goals",
    correo: "email",
    contato: "contact",
    contacto: "contact",
    limpar: "clear",
    limpartela: "clear",
    mail: "email",
    gh: "github",
    li: "linkedin",
  };

  function buildHelpLines() {
    return [
      copy.helpHeader,
      copy.helpNote,
      ...copy.helpGroups.map((group) => ({
        kind: "helpGroup" as const,
        title: group.title,
        commands: group.commands,
      })),
    ];
  }

  function runCommand(rawCommand: string): TerminalEntry | "clear" {
    const nextId = nextIdRef.current++;
    const normalized = normalizeCommand(rawCommand);
    const command = aliases[normalized] ?? normalized;

    switch (command) {
      case "help":
        return { id: nextId, command: rawCommand, lines: buildHelpLines() };
      case "about":
        return { id: nextId, command: rawCommand, lines: [...bioLines] };
      case "whoami":
        return { id: nextId, command: rawCommand, lines: copy.whoami };
      case "stack":
        return { id: nextId, command: rawCommand, lines: copy.stack };
      case "experience":
        return { id: nextId, command: rawCommand, lines: copy.experience };
      case "education":
        return { id: nextId, command: rawCommand, lines: copy.education };
      case "goals":
        return { id: nextId, command: rawCommand, lines: copy.goals };
      case "projects":
        return {
          id: nextId,
          command: rawCommand,
          lines: copy.projects,
          actions: [{ label: copy.projectsLabel, href: projectsHref }],
        };
      case "email":
        return {
          id: nextId,
          command: rawCommand,
          lines: [email],
          actions: [{ label: copy.emailLabel, href: `mailto:${email}` }],
        };
      case "github":
        return {
          id: nextId,
          command: rawCommand,
          lines: [githubUrl],
          actions: [{ label: copy.githubLabel, href: githubUrl, external: true }],
        };
      case "linkedin":
        return {
          id: nextId,
          command: rawCommand,
          lines: [linkedinUrl],
          actions: [{ label: copy.linkedinLabel, href: linkedinUrl, external: true }],
        };
      case "contact":
        return {
          id: nextId,
          command: rawCommand,
          lines: copy.contact,
          actions: [
            { label: copy.emailLabel, href: `mailto:${email}` },
            { label: copy.githubLabel, href: githubUrl, external: true },
            { label: copy.linkedinLabel, href: linkedinUrl, external: true },
            { label: copy.contactLabel, href: contactHref },
          ],
        };
      case "clear":
        return "clear";
      default:
        return {
          id: nextId,
          command: rawCommand,
          lines: [copy.unknown(rawCommand), copy.tryHelp],
          tone: "error",
        };
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const rawCommand = input.trim();
    if (!rawCommand) {
      return;
    }

    const result = runCommand(rawCommand);
    if (result === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    setHistory((current) => [...current, result].slice(-MAX_HISTORY));
    setInput("");
  }

  return (
    <div
      className="h-112 w-full overflow-hidden rounded-2xl border border-[#00ff00]/12 bg-[#060806] shadow-[0_30px_90px_-25px_rgba(0,0,0,0.96)] md:h-128"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-3 border-b border-[#00ff00]/16 bg-linear-to-r from-[#161a16] via-[#111511] to-[#0d120d] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[0_0_10px_rgba(255,95,87,0.4)]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-[0_0_10px_rgba(254,188,46,0.35)]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-[0_0_10px_rgba(40,200,64,0.35)]" />
        </div>

        <div className="min-w-0 flex-1 truncate text-center font-mono text-sm leading-tight tracking-wide text-[#d2dad2] md:text-base">
          {title || "bash - terminal"}
        </div>
      </div>

      <div className="flex h-[calc(100%-54px)] flex-col bg-[radial-gradient(circle_at_top_right,#0d150d_0%,#090d09_40%,#050705_100%)]">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-3 md:px-6 md:pt-6 md:pb-4"
        >
          <div className="space-y-4 font-mono text-xs leading-6 text-gray-200 sm:text-sm">
            {history.map((entry) => (
              <div key={entry.id} className="space-y-2">
                {entry.command && (
                  <div className="grid min-w-0 grid-cols-[auto_1fr] items-start gap-3">
                    <span className="select-none whitespace-nowrap pt-0.5 text-[#00ff00]">{PROMPT}</span>
                    <span className="min-w-0 wrap-break-word text-[#dde7dd]">{entry.command}</span>
                  </div>
                )}

                <div className="space-y-2 pl-0">
                  {entry.lines.map((line, index) => {
                    if (typeof line !== "string") {
                      return (
                        <p key={`${entry.id}-${index}`} className="wrap-break-word text-[#dde7dd]">
                          <span className="font-semibold text-[#f5c86e]">{line.title}</span>
                          <span className="text-[#7f9f7f]">: </span>
                          <span className="text-[#8dff8d]">{line.commands.join(", ")}</span>
                        </p>
                      );
                    }

                    const baseClass = entry.tone === "error" ? "wrap-break-word text-[#ff8e8e]" : "wrap-break-word text-[#dde7dd]";
                    const helpNoteClass = line === copy.helpNote ? " text-[#9eb39e]" : "";

                    return (
                      <p key={`${entry.id}-${index}`} className={`${baseClass}${helpNoteClass}`}>
                        {line}
                      </p>
                    );
                  })}

                  {entry.actions && entry.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {entry.actions.map((action) => (
                        <a
                          key={`${entry.id}-${action.href}`}
                          href={action.href}
                          target={action.external ? "_blank" : undefined}
                          rel={action.external ? "noreferrer noopener" : undefined}
                          className="rounded-md border border-[#00ff00]/20 bg-[#0c100c] px-3 py-1.5 text-[#8dff8d] transition-colors hover:border-[#00ff00]/45 hover:text-[#b5ffb5]"
                        >
                          {action.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-2.5 border-t border-[#00ff00]/12 px-5 py-2.5 md:px-6 md:py-3"
        >
          <span className="select-none whitespace-nowrap font-mono text-xs text-[#00ff00] sm:text-sm">
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-w-0 border-0 bg-transparent font-mono text-xs text-[#dde7dd] outline-none placeholder:text-[#5d7a5d] sm:text-sm"
            placeholder={copy.placeholder}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}