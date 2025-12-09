"use client";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import FaceGallery from "@/components/common/FaceGallery";
import { Gochi_Hand, Cedarville_Cursive } from "next/font/google";
import Image from "next/image";
import React from "react";

const gochiHand = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gochi-hand",
});

const cedarvilleCursive = Cedarville_Cursive({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cedarville",
});

const PHOTOS = [
  { src: "/images/0.jpg", alt: "Photo 1" },
  { src: "/images/1.jpg", alt: "Photo 2" },
  { src: "/images/3.jpg", alt: "Photo 3" },
  { src: "/images/4.jpg", alt: "Photo 4" },
  { src: "/images/5.jpg", alt: "Photo 5" },
  { src: "/images/6.jpg", alt: "Photo 6" },
  { src: "/images/7.jpg", alt: "Photo 7" },
  { src: "/images/0.jpg", alt: "Photo 8" },
  { src: "/images/1.jpg", alt: "Photo 9" },
  { src: "/images/3.jpg", alt: "Photo 10" },
];

export default function HelloPage() {
  return (
    <Container className="min-h-screen py-16">
      <SectionHeading subHeading="Hidden Page" heading="Hello" />

      <div className="mt-12 space-y-20">
        {/* Section 1 - Content Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 space-y-4">
            <h2
              className={`text-3xl font-bold bg-linear-to-br from-pink-600 via-pink-700 to-pink-800 bg-clip-text text-transparent bg-size-[200%_200%] animate-[gradient-flow_4s_ease-in-out_infinite] ${gochiHand.className}`}
            >
              Hi Bramhni
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We specialize in crafting beautiful and functional designs that
              bring your vision to life. Our team of experts works tirelessly to
              ensure every pixel is perfect and every interaction is delightful.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From concept to execution, we handle every aspect of the design
              process with precision and care. Our approach combines modern
              aesthetics with timeless principles to create experiences that
              resonate with your audience.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto">
              <div
                className="relative p-3 sm:p-4 bg-white dark:bg-gray-100 rotate-2 shadow-[0_10px_20px_rgba(0,0,0,0.15),0_20px_40px_rgba(0,0,0,0.1),0_30px_60px_rgba(0,0,0,0.08)] transform-gpu"
                style={{
                  transform:
                    "perspective(1000px) rotateX(2deg) rotateY(-2deg) rotate(2deg)",
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src="/images/2.jpg"
                    alt="Creative workspace"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p
                    className={`text-base text-gray-700 dark:text-gray-800 ${cedarvilleCursive.className}`}
                  >
                    Creative workspace vibes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 - Text Only */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2
            className={`text-3xl font-bold text-center bg-linear-to-br from-pink-600 via-pink-700 to-pink-800 bg-clip-text text-transparent bg-size-[200%_200%] animate-[gradient-flow_4s_ease-in-out_infinite] ${gochiHand.className}`}
          >
            Our Journey
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every project we undertake is a unique journey filled with
            creativity, collaboration, and innovation. We believe in creating
            meaningful experiences that not only meet expectations but exceed
            them in every way possible.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Through dedication and passion, we transform ideas into reality,
            bringing together design, technology, and human connection to craft
            solutions that truly make a difference.
          </p>
        </div>

        {/* Photo Gallery */}
        <div className="mt-20">
          <FaceGallery
            photos={PHOTOS}
            profile={{
              name: "Yash",
              username: "g.yash27",
              bio: "Can't think of anything funny to put here.",
              profilePic: "/images/0.jpg",
            }}
          />
        </div>
      </div>
    </Container>
  );
}
