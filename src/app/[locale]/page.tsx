"use client";

import { useTranslations } from "next-intl";
import Cube from "@/components/Cube";
import RotatingTitle from "@/components/RotatingTitle";

export default function HomePage() {
  const t = useTranslations("titles");
  const u = useTranslations("cube");
  const v = useTranslations("venus");
  const w = useTranslations("random");

  return (
    <div className="
    min-h-screen flex flex-col items-center justify-start 
    bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] 
    px-6 text-[#c0c0c0] font-mono space-y-12
    pt-[3rem]       /* mobile default */
    sm:pt-[6vh]     /* tablet / mobile horizontal */
    md:pt-[8vh] /* desktop */">


      <div className="flex flex-col items-center space-y-12 pt-12">
        {/* H1 for SEO */}
        <h1 className="sr-only">
          {t("iam")} {t("dev")} {t("profession")} {t("enthusiast")} {t("prefer")}
        </h1>
        <RotatingTitle
          titles={[t("iam"), t("dev"), t("profession"), t("enthusiast"), t("prefer")]}
          interval={3000} // changes every 3s
          className="text-4xl font-extrabold text-[#00FF00] text-center"
        />
      </div>
      {/* Cube container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* Skybox cube */}
        <Cube
          faceTextures={[
            "/textures/skybox/right.webp",
            "/textures/skybox/left.webp",
            "/textures/skybox/back.webp",
            "/textures/skybox/front.webp",
            "/textures/skybox/top.webp",
            "/textures/skybox/down.webp",
          ]}
          faceTexts={[
            u("front"),
            u("right"),
            u("back"),
            u("left"),
            u("top"),
            u("down"),
          ]}
          onClick={() => console.log("")}
          fontUrl="/assets/fonts/JetBrainsMonoNL-ExtraBoldItalic.ttf"
          color="#ff00ff"
          outlineColor="#003322"
        />

        {/* Cube of Venus */}
        <Cube
          faceTextures={[
            "/textures/planets/venus_surface.webp",
            "/textures/planets/venus_surface.webp",
            "/textures/planets/venus_surface.webp",
            "/textures/planets/venus_surface.webp",
            "/textures/planets/venus_surface.webp",
            "/textures/planets/venus_surface.webp",
          ]}
          faceTexts={[
            v("front"),
            v("right"),
            v("back"),
            v("left"),
            v("top"),
            v("down"),
          ]}
          onClick={() => console.log("")}
          fontUrl="/assets/fonts/JetBrainsMonoNL-ExtraBoldItalic.ttf"
        />

        {/* Random cube */}
        <Cube
          faceTextures={[
            "/textures/other/random.webp",
            "/textures/other/random.webp",
            "/textures/other/random.webp",
            "/textures/other/random.webp",
            "/textures/other/random.webp",
            "/textures/other/random.webp",
          ]}
          faceTexts={[
            w("front"),
            w("right"),
            w("back"),
            w("left"),
            w("top"),
            w("down"),
          ]}
          onClick={() => console.log("")}
          fontUrl="/assets/fonts/JetBrainsMonoNL-ExtraBoldItalic.ttf"
          color="#00ff88"
          outlineColor="#003322"
        />

      </div>
    </div>
  );
}