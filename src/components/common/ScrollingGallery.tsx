// components/ScrollingGallery.tsx
"use client";

import { VerticalMarquee } from "./VerticalMarquee";

const IMAGES = [
  { src: "/images/1.png", alt: "Image 1", width: 800, height: 1000 },
  { src: "/images/2.png", alt: "Image 2", width: 800, height: 1000 },
  { src: "/images/3.png", alt: "Image 3", width: 800, height: 1000 },
  { src: "/images/4.png", alt: "Image 4", width: 800, height: 1000 },
  { src: "/images/5.png", alt: "Image 5", width: 800, height: 1000 },
  { src: "/images/6.png", alt: "Image 6", width: 800, height: 1000 },
  // Add more images here as needed
];

// Utility function to shuffle array with a seed for consistency
function shuffleArray<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let currentIndex = arr.length;
  let randomIndex;

  // Simple seeded random function
  const seededRandom = (s: number) => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  while (currentIndex > 0) {
    randomIndex = Math.floor(seededRandom(seed++) * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
}

// Create two different random orders using different seeds
const IMAGES_COL_1 = shuffleArray(IMAGES, 42);
const IMAGES_COL_2 = shuffleArray(IMAGES, 123);

export default function ScrollingGallery() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 gap-4">
        <VerticalMarquee images={IMAGES_COL_1} speed={25} height={800} />
        <VerticalMarquee
          images={IMAGES_COL_2}
          speed={25}
          reverse
          height={800}
        />
      </div>
    </div>
  );
}
