"use client";

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

  if (!photos || photos.length === 0) return null;

  const current = photos[active];

  return (
    <section className="mx-auto max-w-sm space-y-4 px-4 py-6">
      {/* Main photo */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={current.src}
          alt={current.alt || ""}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 380px"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((photo, index) => {
          const isActive = index === active;

          return (
            <button
              key={photo.src + index}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg transition-opacity ${
                isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt || ""}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
