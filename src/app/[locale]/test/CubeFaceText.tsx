import { useState, useEffect } from "react";
import { Text } from "@react-three/drei";

interface TextOnFaceProps {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export function CubeFaceText({ text, position, rotation }: TextOnFaceProps) {
  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    let current = 0;
    setAnimatedText("");
    const interval = setInterval(() => {
      current++;
      setAnimatedText(text.slice(0, current));
      if (current >= text.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <group position={position} rotation={rotation}>
      <Text fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {animatedText}
      </Text>
    </group>
  );
}
