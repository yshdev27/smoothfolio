"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!photos || photos.length === 0) return null;

  const current = photos[active];

  // Create triple array for seamless infinite loop
  const infinitePhotos = [...photos, ...photos, ...photos];

  const handleSetActive = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && active > 0) {
      // Swipe right - go to previous
      handleSetActive(active - 1);
    } else if (info.offset.x < -swipeThreshold && active < photos.length - 1) {
      // Swipe left - go to next
      handleSetActive(active + 1);
    }
  };

  // Handle infinite scroll loop
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const itemWidth = 92; // 80px width + 12px gap
      const singleSetWidth = photos.length * itemWidth;

      // Reset to middle set when reaching boundaries
      if (scrollLeft <= itemWidth) {
        scrollContainer.scrollLeft = singleSetWidth + itemWidth;
      } else if (scrollLeft >= singleSetWidth * 2 - clientWidth) {
        scrollContainer.scrollLeft = singleSetWidth - clientWidth + itemWidth;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Initialize scroll to middle set
    scrollContainer.scrollLeft = photos.length * 92;

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [photos.length]);

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
    <section className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      {/* Hero Image */}
      <motion.div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-neutral-900 md:rounded-xl"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
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
      </motion.div>

      {/* Horizontal Scrolling Gallery */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
        >
          {infinitePhotos.map((photo, index) => {
            const actualIndex = index % photos.length;
            const isActive = actualIndex === active;

            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleSetActive(actualIndex)}
                whileHover={{ scale: isActive ? 1 : 0.85, y: -4 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  scale: isActive ? 1 : 0.75,
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-900"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt || ""}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {/* Active indicator overlay */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 border-2 border-primary"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
