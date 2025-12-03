// components/VerticalMarquee.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type GalleryImage = {
  src: string;
  alt?: string;
  width: number;
  height: number;
};

type VerticalMarqueeProps = {
  images: GalleryImage[];
  speed?: number;
  reverse?: boolean;
  height?: number; // in px
};

export function VerticalMarquee({
  images,
  speed = 20,
  reverse = false,
  height = 400,
}: VerticalMarqueeProps) {
  const loopImages = [...images, ...images, ...images];
  const yStart = reverse ? "-33.33%" : 0;
  const yEnd = reverse ? 0 : "-33.33%";

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        height,
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: [yStart, yEnd],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        initial={{ y: yStart }}
      >
        {loopImages.map((img, i) => (
          <div key={`${img.src}-${i}`} className="relative w-full">
            <Image
              src={img.src}
              alt={img.alt ?? ""}
              width={img.width}
              height={img.height}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
