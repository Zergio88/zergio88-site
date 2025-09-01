"use client";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-[#c0c0c0] px-6 font-mono">

      <div className="max-w-3xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-[#f0f0f0] drop-shadow-md">
          🚘 Bienvenido al universo Mercedes-Benz
        </h1>

        <p className="text-lg md:text-xl leading-relaxed text-[#a0a0a0] mb-8">
          Explora mis proyectos inspirados en la elegancia, precisión y tecnología de Mercedes-Benz.  
          Minimalismo, innovación y rendimiento se combinan para crear experiencias impecables.
        </p>

        <button className="px-8 py-3 bg-[#f0f0f0]/10 text-[#0a0a0a] font-bold 
          rounded-lg shadow-md hover:bg-[#f0f0f0]/20 transition-all duration-300">
          Ver proyectos
        </button>
      </div>

    </div>
  );
}
