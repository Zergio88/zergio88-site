"use client";

import { useTranslations } from "next-intl";
import Cube from "@/components/Cube";
import { useRouter } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("home");
  const u = useTranslations("cube");
  const v = useTranslations("venus");
  const w = useTranslations("random");
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12
      bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] 
      px-6 text-[#c0c0c0] font-mono space-y-12">

      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
        {t("menu")}
      </h1>

      <p className="text-lg md:text-xl text-center max-w-xl leading-relaxed text-[#a0a0a0]">
        {t("welcome")}
      </p>

      {/* Cube container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* Skybox cube */}
        <Cube
          faceTextures={[
            "/textures/skybox/right.png",
            "/textures/skybox/left.png",
            "/textures/skybox/back.png",
            "/textures/skybox/front.png",
            "/textures/skybox/top.png",
            "/textures/skybox/down.png",
          ]}
          faceTexts={[
            u("front"),
            u("right"),
            u("back"),
            u("left"),
            u("top"),
            u("down"),
          ]}
          onClick={() => router.push("/projectss")}
        />

        {/* Cube of Venus */}
        <Cube
          faceTextures={[
            "/textures/planets/venus_surface.png",
            "/textures/planets/venus_surface.png",
            "/textures/planets/venus_surface.png",
            "/textures/planets/venus_surface.png",
            "/textures/planets/venus_surface.png",
            "/textures/planets/venus_surface.png",
          ]}
          faceTexts={[
            v("front"),
            v("right"),
            v("back"),
            v("left"),
            v("top"),
            v("down"),
          ]}
          onClick={() => router.push("/contact")}
        />

        {/* Random cube */}
        <Cube
          faceTextures={[
            "/textures/other/random.png",
            "/textures/other/random.png",
            "/textures/other/random.png",
            "/textures/other/random.png",
            "/textures/other/random.png",
            "/textures/other/random.png",
          ]}
          faceTexts={[
            w("front"),
            w("right"),
            w("back"),
            w("left"),
            w("top"),
            w("down"),
          ]}
          onClick={() => router.push("/about")}
        />

      </div>
    </div>
  );
}
