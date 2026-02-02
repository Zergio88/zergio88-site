"use client";

import Image from "next/image";
import { useMemo } from "react";
import { urlFor, type AboutSkill } from "@/lib/sanity";

type Props = {
  skills: AboutSkill[];
  rowHeight?: number; // unused in static mode but kept for API compatibility
  duration?: number;  // unused in static mode but kept for API compatibility
};

// Static, robust rendering: responsive grid of skill pills (no animation)
export default function TechCarousel({ skills }: Props) {
  const items = useMemo(() => {
    // keep only those with icon and dedupe by name
    const withIcon = skills.filter((s) => s.icon?.asset);
    const map = new Map<string, AboutSkill>();
    for (const s of withIcon) {
      const key = (s.name || "").toLowerCase().trim();
      if (key && !map.has(key)) map.set(key, s);
    }
    return Array.from(map.values());
  }, [skills]);

  if (!items.length) return null;

  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-950/40 p-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {items.map((s, idx) => (
          <SkillPill key={`${s.name}-${idx}`} skill={s} height={48} />
        ))}
      </div>
    </div>
  );
}

function SkillPill({ skill, height }: { skill: AboutSkill; height: number }) {
  const href = skill.url;
  const content = (
    <div
      className="group flex items-center gap-2 px-3 mx-1 rounded-full border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900/80 hover:border-emerald-500/50 transition hover:-translate-y-px"
      style={{ height }}
    >
      {skill.icon?.asset && (
        <Image
          src={urlFor(skill.icon).width(40).height(40).fit("crop").url()}
          alt={skill.name || "skill"}
          width={40}
          height={40}
          className="rounded-sm object-contain bg-white/5"
        />
      )}
      <span className="text-sm font-medium truncate max-w-40">{skill.name}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={skill.name || "skill"}
        className="group no-underline cursor-pointer"
      >
        {content}
      </a>
    );
  }
  return content;
}
