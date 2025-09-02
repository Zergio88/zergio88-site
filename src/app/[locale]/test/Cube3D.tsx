"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";

export default function Cube3D() {
  return (
    <div className="w-64 h-64">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Box args={[2, 2, 2]}>
          <meshStandardMaterial attach="material-0" color="#A0522D" />
          <meshStandardMaterial attach="material-1" color="#8B4513" />
          <meshStandardMaterial attach="material-2" color="#CD853F" />
          <meshStandardMaterial attach="material-3" color="#D2691E" />
          <meshStandardMaterial attach="material-4" color="#8B4513" />
          <meshStandardMaterial attach="material-5" color="#A0522D" />
        </Box>
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </div>
  );
}
