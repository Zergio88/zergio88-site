import { useEffect, useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { CanvasTexture, DoubleSide, LinearFilter } from "three";

interface TextOnFaceProps {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  flipX?: boolean;          // to mirror horizontally
  scaleFactor?: number;     // to adjust size
  fontUrl?: string;         // optional
  color?: string;           // optional, default white
  outlineWidth?: number;    // optional outline thickness
  outlineColor?: string;    // optional outline color
}

export function CubeFaceText({
  text,
  position,
  rotation,
  flipX = false,
  scaleFactor = 1,
  fontUrl,
  color = "white",
  outlineWidth,
  outlineColor,
}: TextOnFaceProps) {
  const [animatedText, setAnimatedText] = useState("");
  const [supportsTroikaText] = useState(() => {
    if (typeof document === "undefined") return false;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;

    return Boolean(gl && gl.getExtension("ANGLE_instanced_arrays"));
  });

  const fallbackTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const width = 512;
    const height = 256;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const lines = animatedText.split("\n");
    const fontSize = Math.round(height * 0.33);
    const lineHeight = Math.round(fontSize * 1.1);
    const blockHeight = Math.max(lineHeight, lines.length * lineHeight);
    const startY = Math.round(height / 2 - blockHeight / 2 + lineHeight / 2);

    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px system-ui, sans-serif`;

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      if (outlineColor) {
        ctx.lineWidth = 10;
        ctx.strokeStyle = outlineColor;
        ctx.strokeText(line, width / 2, y);
      }

      ctx.fillText(line, width / 2, y);
    });

    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    return texture;
  }, [animatedText, color, outlineColor]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setAnimatedText(text.slice(0, current));
      if (current >= text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  const scale: [number, number, number] = [
    flipX ? -scaleFactor : scaleFactor,
    scaleFactor,
    scaleFactor,
  ];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {supportsTroikaText ? (
        <Text
          fontSize={0.3}
          color={color}
          anchorX="center"
          anchorY="middle"
          {...(fontUrl ? { font: fontUrl } : {})}
          {...(outlineWidth ? { outlineWidth } : {})}
          {...(outlineColor ? { outlineColor } : {})}
        >
          {animatedText}
        </Text>
      ) : (
        <mesh>
          <planeGeometry args={[1.6, 0.8]} />
          <meshBasicMaterial
            map={fallbackTexture ?? undefined}
            transparent
            toneMapped={false}
            side={DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
