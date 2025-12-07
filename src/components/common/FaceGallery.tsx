"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type Photo = {
  src: string;
  alt?: string;
};

interface FaceGalleryProps {
  photos: Photo[];
}

export default function FaceGallery({ photos }: FaceGalleryProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!photos || photos.length === 0) return null;

  const current = photos[active];

  const handleSetActive = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <section className="mx-auto max-w-sm space-y-4 px-4 py-6">
      {/* Main photo */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-neutral-100">
        {/* Top fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-24 w-full bg-gradient-to-b from-black/10 to-transparent" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-24 w-full bg-gradient-to-t from-black/10 to-transparent" />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 380px"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="relative flex gap-2 overflow-x-auto pb-1">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent" />

        {photos.map((photo, index) => {
          const isActive = index === active;

          return (
            <motion.button
              key={photo.src + index}
              type="button"
              onClick={() => handleSetActive(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isActive ? 1 : 0.95,
                opacity: isActive ? 1 : 0.6,
              }}
              transition={{ duration: 0.2 }}
              className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg"
            >
              <Image
                src={photo.src}
                alt={photo.alt || ""}
                fill
                className="object-cover"
                sizes="64px"
              />
              {isActive && (
                <motion.div
                  layoutId="active-thumbnail"
                  className="absolute inset-0 rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-background"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
