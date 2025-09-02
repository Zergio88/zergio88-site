"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Box } from "@react-three/drei";

export default function CubeSnapMouse() {
  const [targetFace, setTargetFace] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const xRatio = (clientX - rect.left) / rect.width;
    const yRatio = (clientY - rect.top) / rect.height;

    if (yRatio < 0.33) setTargetFace(4);       // arriba
    else if (yRatio > 0.66) setTargetFace(5);  // abajo
    else if (xRatio < 0.33) setTargetFace(3);  // izquierda
    else if (xRatio > 0.66) setTargetFace(1);  // derecha
    else setTargetFace(0);                      // frente
  };

  return (
    <div
      className="w-64 h-64"
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        const target = e.currentTarget.getBoundingClientRect();
        handleMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
          currentTarget: e.currentTarget,
        } as any);
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Cube meshTargetFace={targetFace} />
      </Canvas>
    </div>
  );
}

// Componente interno que usa useFrame
interface CubeProps {
  meshTargetFace: number;
}

function Cube({ meshTargetFace }: CubeProps) {
  const cubeRef = useRef<any>(null);

  const rotations: [number, number, number][] = [
    [0, 0, 0],               // frente
    [0, Math.PI / 2, 0],     // derecha
    [0, Math.PI, 0],         // atrás
    [0, -Math.PI / 2, 0],    // izquierda
    [-Math.PI / 2, 0, 0],    // arriba
    [Math.PI / 2, 0, 0],     // abajo
  ];

  useFrame(() => {
    if (cubeRef.current) {
      const [tx, ty, tz] = rotations[meshTargetFace];
      cubeRef.current.rotation.x += (tx - cubeRef.current.rotation.x) * 0.1;
      cubeRef.current.rotation.y += (ty - cubeRef.current.rotation.y) * 0.1;
      cubeRef.current.rotation.z += (tz - cubeRef.current.rotation.z) * 0.1;
    }
  });

  return (
    <Box ref={cubeRef} args={[2, 2, 2]}>
      <meshStandardMaterial attach="material-0" color="#A0522D" />
      <meshStandardMaterial attach="material-1" color="#8B4513" />
      <meshStandardMaterial attach="material-2" color="#CD853F" />
      <meshStandardMaterial attach="material-3" color="#D2691E" />
      <meshStandardMaterial attach="material-4" color="#8B4513" />
      <meshStandardMaterial attach="material-5" color="#A0522D" />
    </Box>
  );
}
