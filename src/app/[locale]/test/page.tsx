import CubeSnapMouse from "./CubeSnapMouse";


export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-[#c0c0c0] px-6 font-mono gap-10 py-10">


      {/* Horizontal cube container */}
      <div className="flex flex-row flex-wrap justify-center items-center gap-4 md:gap-6">
        <CubeSnapMouse />
      </div>
    </div>
  );
}
