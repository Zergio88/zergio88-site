import CubeSnapMouse from "./CubeSnapMouse";
import MinecraftBlock from "./MinecraftBlock";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-[#c0c0c0] px-6 font-mono gap-10 py-10">

      <h1 className="text-5xl md:text-6xl font-extrabold text-[#f0f0f0] drop-shadow-md mb-10">
        Cubo 3D Snap a Caras
      </h1>
      <MinecraftBlock />
      <CubeSnapMouse />

    </div>
  );
}
