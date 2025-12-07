"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type Photo = {
  src: string;
  alt?: string;
};

interface ProfileInfo {
  name: string;
  username?: string;
  bio?: string;
  profilePic: string;
}

interface FaceGalleryProps {
  photos: Photo[];
  profile?: ProfileInfo;
}

export default function FaceGallery({ photos, profile }: FaceGalleryProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!photos || photos.length === 0) return null;

  const current = photos[active];

  const handleSetActive = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const slideVariants = {
    enter: {
      scale: 1.1,
      opacity: 0,
    },
    center: {
      scale: 1,
      opacity: 1,
    },
    exit: {
      scale: 0.95,
      opacity: 0,
    },
  };

  return (
    <section className="mx-auto max-w-4xl space-y-4 px-4 py-6 md:space-y-6">
      {/* Profile Header */}
      {profile && (
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-neutral-900">
            <Image
              src={profile.profilePic}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              {profile.name}
            </h2>
            {profile.username && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <svg
                  viewBox="0 0 24 24"
                  fill="url(#instagram-gradient)"
                  className="h-4 w-4"
                >
                  <defs>
                    <linearGradient
                      id="instagram-gradient"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#FD5949", stopOpacity: 1 }}
                      />
                      <stop
                        offset="50%"
                        style={{ stopColor: "#D6249F", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#285AEB", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @{profile.username}
              </p>
            )}
            {profile.bio && (
              <p className="mt-2 text-sm text-foreground line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-none bg-neutral-900 md:rounded-xl">
        {/* Gradient overlay for depth */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/5 via-transparent to-black/10" />

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Image counter */}
        <div className="absolute right-4 top-4 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {active + 1} / {photos.length}
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {photos.map((photo, index) => {
          const isActive = index === active;

          return (
            <motion.button
              key={photo.src + index}
              type="button"
              onClick={() => handleSetActive(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative aspect-square w-full overflow-hidden bg-neutral-900"
            >
              <Image
                src={photo.src}
                alt={photo.alt || ""}
                fill
                className={`object-cover transition-all duration-300 ${
                  isActive ? "opacity-50" : "opacity-100"
                }`}
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, 280px"
              />
              {/* Active indicator overlay */}
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute inset-0 border border-white/30"
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
