"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Box } from "@react-three/drei";
import { Mesh } from "three";
import { CubeFaceText } from "../../../components/CubeFaceText";

export default function CubeSnapMouse() {
  const [targetFace, setTargetFace] = useState(0);

  const handleMouseMove = (
    e: Pick<React.TouchEvent<HTMLDivElement>, "currentTarget"> & {
      clientX: number;
      clientY: number;
    }
  ) => {
    /* calculates the position of the pointer within the div containing the cube */
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const xRatio = (clientX - rect.left) / rect.width;
    const yRatio = (clientY - rect.top) / rect.height;

    let newFace = 0;
    if (yRatio < 0.33) newFace = 4; // top
    else if (yRatio > 0.66) newFace = 5; // down
    else if (xRatio < 0.33) newFace = 3; // left
    else if (xRatio > 0.66) newFace = 1; // right
    else newFace = 0; // front

    if (newFace !== targetFace) setTargetFace(newFace);
  };

  return (
    <div
      className="w-64 h-64 md:w-80 md:h-80"
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        handleMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
          currentTarget: e.currentTarget,
        });
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <CubeMesh meshTargetFace={targetFace} />
      </Canvas>
    </div>
  );
}

interface CubeProps {
  meshTargetFace: number;
}

function CubeMesh({ meshTargetFace }: CubeProps) {
  const cubeRef = useRef<Mesh>(null!);
  const [displayFace, setDisplayFace] = useState(meshTargetFace);
  const [animKey, setAnimKey] = useState(0);

  // Detectar mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const size = isMobile ? 2 : 3; // cube size

  const rotations: [number, number, number][] = [
    [0, 0, 0],
    [0, -Math.PI / 2, 0],
    [0, Math.PI, 0],
    [0, Math.PI / 2, 0],
    [Math.PI / 2, 0, 0],
    [-Math.PI / 2, 0, 0],
  ];

  const faceTexts = [
    "lado frente",
    "lado derecho",
    "lado atrás",
    "lado izquierdo",
    "lado arriba",
    "lado abajo",
  ];

  const offset = size / 2 + 0.02; // distance of the text from the center
  const facePositions: [number, number, number][] = [
    [0, 0, offset],
    [offset, 0, 0],
    [0, 0, -offset],
    [-offset, 0, 0],
    [0, offset, 0],
    [0, -offset, 0],
  ];

  const faceRotations: [number, number, number][] = [
    [0, 0, 0],
    [0, -Math.PI / 2, 0],
    [0, Math.PI, 0],
    [0, Math.PI / 2, 0],
    [-Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, 0],
  ];

  // Faces that must be mirrored horizontally
  const flipXMap = [false, true, false, true, false, false];

  const EASE = 0.10 * (2 / size); // rotation speed adapted to size
  const EPS = 0.02;

  useFrame(() => {
    if (!cubeRef.current) return;

    const [tx, ty, tz] = rotations[meshTargetFace];
    const r = cubeRef.current.rotation;

    r.x += (tx - r.x) * EASE;
    r.y += (ty - r.y) * EASE;
    r.z += (tz - r.z) * EASE;

    const dx = Math.abs(tx - r.x);
    const dy = Math.abs(ty - r.y);
    const dz = Math.abs(tz - r.z);
    const settled = dx < EPS && dy < EPS && dz < EPS;

    if (settled && displayFace !== meshTargetFace) {
      setDisplayFace(meshTargetFace);
      setAnimKey((k) => k + 1);
    }
  });

  return (
    <group ref={cubeRef}>
      <Box args={[size, size, size]}>
        <meshStandardMaterial attach="material-0" color="#A0522D" />
        <meshStandardMaterial attach="material-1" color="#8B4513" />
        <meshStandardMaterial attach="material-2" color="#CD853F" />
        <meshStandardMaterial attach="material-3" color="#D2691E" />
        <meshStandardMaterial attach="material-4" color="#8B4513" />
        <meshStandardMaterial attach="material-5" color="#A0522D" />
      </Box>

      <CubeFaceText
        key={animKey}
        text={faceTexts[displayFace]}
        position={facePositions[displayFace]}
        rotation={faceRotations[displayFace]}
        flipX={flipXMap[displayFace]}
        scaleFactor={size / 2}
      />
    </group>
  );
}
