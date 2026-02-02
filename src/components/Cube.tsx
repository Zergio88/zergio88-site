"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Box, useTexture } from "@react-three/drei";
import { Mesh, Texture } from "three";
import { useEffect, useRef, useState } from "react";
import { CubeFaceText } from "./CubeFaceText";

interface CubeProps {
  faceTextures: string[];              // image routes
  faceTexts: string[];                 // texts for each side
  onClick?: () => void;                // generic click callback
  fontUrl?: string;                    // optional font
  color?: string;
  outlineWidth?: number;
  outlineColor?: string;
}

export default function Cube({ faceTextures, faceTexts, onClick, color, fontUrl, outlineWidth, outlineColor }: CubeProps) {
  const [targetFace, setTargetFace] = useState(0);

  // Detects pointer / touch inside div
  const handlePointerMove = (
    e: Pick<React.TouchEvent<HTMLDivElement>, "currentTarget"> & { clientX: number; clientY: number }
  ) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const xRatio = (clientX - rect.left) / rect.width;
    const yRatio = (clientY - rect.top) / rect.height;

    let newFace = 0;
    if (yRatio < 0.33) newFace = 4;       // top
    else if (yRatio > 0.66) newFace = 5;  // down
    else if (xRatio < 0.33) newFace = 3;  // left
    else if (xRatio > 0.66) newFace = 1;  // right
    else newFace = 0;                     // front

    if (newFace !== targetFace) setTargetFace(newFace);
  };

  return (
    <div
      className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72"
      onMouseMove={handlePointerMove}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        handlePointerMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
          currentTarget: e.currentTarget,
        });
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <CubeMesh
          meshTargetFace={targetFace}
          faceTextures={faceTextures}
          faceTexts={faceTexts}
          onClick={onClick}
          fontUrl={fontUrl}
          color={color}
          outlineWidth={outlineWidth}
          outlineColor={outlineColor}

        />
      </Canvas>
    </div>
  );
}

interface CubeMeshProps {
  meshTargetFace: number;
  faceTextures: string[];
  faceTexts: string[];
  onClick?: () => void;
  fontUrl?: string;
  color?: string;
  outlineWidth?: number;
  outlineColor?: string;
}

function CubeMesh({ meshTargetFace, faceTextures, faceTexts, onClick, fontUrl, color, outlineWidth, outlineColor }: CubeMeshProps) {
  const cubeRef = useRef<Mesh>(null!);
  const [displayFace, setDisplayFace] = useState(meshTargetFace);
  const [animKey, setAnimKey] = useState(0);

  // state for the initial animation
  const [hintActive, setHintActive] = useState(true);

  // turns off after 3s
  useEffect(() => {
    const timer = setTimeout(() => setHintActive(false), 3000);
    return () => clearTimeout(timer);
  }, []);




  // Textures loaded with useTexture
  const textures: Texture[] = useTexture(faceTextures);

  // Detects mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const size = isMobile ? 4 : 3;

  const rotations: [number, number, number][] = [
    [0, 0, 0],           // front
    [0, -Math.PI / 2, 0], // right
    [0, Math.PI, 0],      // back
    [0, Math.PI / 2, 0],  // left
    [Math.PI / 2, 0, 0],  // top
    [-Math.PI / 2, 0, 0], // down
  ];

  const offset = size / 2 + 0.02; // text distance
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

  const flipXMap = [false, true, false, true, false, false];
  const EASE = 0.1 * (2 / size);
  const EPS = 0.1;

  // Animation of the turn
  useFrame(({ clock }) => {

    if (!cubeRef.current) return;
    const [tx, ty, tz] = rotations[meshTargetFace];
    const r = cubeRef.current.rotation;

    if (hintActive) {
      // micro oscillation at the start
      const t = clock.getElapsedTime();
      r.y = Math.sin(t * 2) * 0.2; // move in Y
      r.x = Math.sin(t) * 0.1;     // move in X
      return;
    }

    r.x += (tx - r.x) * EASE;
    r.y += (ty - r.y) * EASE;
    r.z += (tz - r.z) * EASE;

    const settled = Math.abs(tx - r.x) < EPS && Math.abs(ty - r.y) < EPS && Math.abs(tz - r.z) < EPS;

    if (settled && displayFace !== meshTargetFace) {
      setDisplayFace(meshTargetFace);
      setAnimKey((k) => k + 1);
    }
  });

  return (
    <group
      ref={cubeRef}
      onClick={onClick}
      onPointerOver={(e) => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = "default";
      }}>

      <Box args={[size, size, size]}>
        {textures.map((tex, i) => (
          <meshStandardMaterial attach={`material-${i}`} map={tex} key={i} />
        ))}
      </Box>

      {/* Animated text only on the active side */}
      <CubeFaceText
        key={animKey}
        text={faceTexts[displayFace]}
        position={facePositions[displayFace]}
        rotation={faceRotations[displayFace]}
        flipX={flipXMap[displayFace]}
        scaleFactor={size / 2}
        fontUrl={fontUrl}
        color={color}
        outlineWidth={outlineWidth}
        outlineColor={outlineColor}
      />
    </group>
  );
}