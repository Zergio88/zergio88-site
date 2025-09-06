"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface RotatingTitleProps {
  titles: string[];
  interval?: number; // time in ms between changes (default 3000)
  className?: string;
}

export default function RotatingTitle({
  titles,
  interval = 3000,
  className = "text-3xl font-bold text-white",
}: RotatingTitleProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, interval);
    return () => clearInterval(id);
  }, [titles.length, interval]);

  return (
    <div className="relative h-12 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 90 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={className}
        >
          {titles[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}