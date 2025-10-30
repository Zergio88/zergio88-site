"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { urlFor, type AboutSkill } from "@/lib/sanity";

type Props = {
  skills: AboutSkill[];
  rowHeight?: number; // px
  duration?: number; // seconds per loop
};

export default function TechCarousel({ skills, rowHeight = 56, duration = 22 }: Props) {
  const [reduced, setReduced] = useState(false);
  const items = useMemo(() => skills.filter((s) => s.icon?.asset), [skills]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  if (!items.length) return null;

  // Split items into two rows for a more premium look
  const rowA = items.filter((_, i) => i % 2 === 0);
  const rowB = items.filter((_, i) => i % 2 === 1);

  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-950/40 p-3 space-y-4 mask">
      <MarqueeRow items={rowA} height={rowHeight} duration={duration} direction="left" reduced={reduced} />
      {rowB.length > 0 && (
        <MarqueeRow items={rowB} height={rowHeight} duration={duration + 4} direction="right" reduced={reduced} />
      )}
      {reduced && (
        <p className="text-xs text-gray-500">Animaciones reducidas por preferencia del sistema.</p>
      )}
      <style jsx>{`
        .mask {
          mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

function MarqueeRow({ items, height, duration, direction, reduced }: { items: AboutSkill[]; height: number; duration: number; direction: 'left' | 'right'; reduced: boolean; }) {
  const seq = [...items];
  const animationName = direction === 'left' ? 'scroll-left' : 'scroll-right';
  const containerStyle = { height: height + 12 } as React.CSSProperties;
  if (reduced) {
    return (
      <div className="overflow-x-auto whitespace-nowrap" style={containerStyle}>
        <div className="inline-flex items-center">
          {seq.map((s, idx) => (
            <SkillPill key={`${s.name}-${idx}`} skill={s} height={height} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden" style={containerStyle}>
      {/* Track A */}
      <div className="absolute left-0 top-0 h-full flex items-center" style={{ animation: `${animationName} ${duration}s linear infinite` }}>
        <div className="flex items-center">
          {seq.map((s, idx) => (
            <SkillPill key={`a-${s.name}-${idx}`} skill={s} height={height} />
          ))}
        </div>
      </div>
      {/* Track B (offset) */}
      <div className="absolute top-0 h-full flex items-center" style={{ left: direction === 'left' ? '100%' as any : '-100%' as any, animation: `${animationName} ${duration}s linear infinite` }}>
        <div className="flex items-center">
          {seq.map((s, idx) => (
            <SkillPill key={`b-${s.name}-${idx}`} skill={s} height={height} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillPill({ skill, height }: { skill: AboutSkill; height: number }) {
  const href = skill.url;
  const content = (
    <div
      className="flex items-center gap-2 px-3 mx-1 rounded-full border border-neutral-800 bg-neutral-900/60 hover:border-emerald-600/50 transition-colors"
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
        className="no-underline"
      >
        {content}
      </a>
    );
  }
  return content;
}
