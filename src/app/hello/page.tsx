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
  { src: "/images/8.jpg", alt: "Photo 1" },
  { src: "/images/10.jpg", alt: "Photo 2" },
  { src: "/images/7.jpg", alt: "Photo 3" },
  { src: "/images/6.jpg", alt: "Photo 4" },
  { src: "/images/5.jpg", alt: "Photo 5" },
  { src: "/images/4.jpg", alt: "Photo 6" },
  { src: "/images/3.jpg", alt: "Photo 7" },
  { src: "/images/1.jpg", alt: "Photo 8" },
];

export default function HelloPage() {
  return (
    <Container className="min-h-screen py-16">
      <SectionHeading subHeading="" heading="" />

      <div className="mt-12 space-y-20">
        {/* Section 1 - Content Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 space-y-4">
            <h2
              className={`text-3xl font-bold bg-linear-to-br from-pink-600 via-pink-700 to-pink-800 bg-clip-text text-transparent bg-size-[200%_200%] animate-[gradient-flow_4s_ease-in-out_infinite] ${gochiHand.className}`}
            >
              Hi Bramhni
            </h2>
            <p
              className={`text-gray-900 dark:text-white leading-relaxed ${gochiHand.className}`}
            >
              oh hey, i am really sorry for MIA and i hated to keep you hanging
              but if you thought i was gone(for good) not really. that’s not i
              move. infact i was travelling for work(and more) a bit and trying
              to build all this(the site where you’re seeing this) stuff in
              between.I promise, I won&apos;t be late ever again.
            </p>
            <p
              className={`text-gray-900 dark:text-white leading-relaxed ${gochiHand.className}`}
            >
              I didn&apos;t want to disappoint you again with no pictures of
              mine so had to have some casual direct ones from the camera that
              are here. I&apos;m really awkward on the camera and i know
              that(maybe I&apos;ll have to learn this from you). but i moved
              anyway for few clicks last week.
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
                    src="/images/9.jpg"
                    alt="Creative workspace"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p
                    className={`text-base text-gray-700 dark:text-gray-800 ${cedarvilleCursive.className}`}
                  >
                    ☀️
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 - Text Only */}
        <div className="max-w-3xl mx-auto space-y-4">
          <p
            className={`text-gray-900 dark:text-white leading-relaxed ${gochiHand.className}`}
          >
            enough about me, but about you now. I was thinking a lot of creative
            things I would write here but I can be nothing but honest, I’ve
            always wondered what sun would look like as a human being and I
            think I finally have the answer but this sun has reading and memory
            problems (I not sure if doctors could afford that) but stay for 30
            seconds more.
          </p>
          <p
            className={`text-gray-900 dark:text-white leading-relaxed ${gochiHand.className}`}
          >
            I think you’re cool but I&apos;ve got very less idea about you from
            your socials(your friends cheer you like you&apos;re the prettiest
            girl ever and i agree) but I want to know more. now, I’m a lot to
            handle for most but if you’re the exception like you said you are,
            I’m down. (I’ll do the professional portfolio as I promised, I
            didn’t forget)
          </p>
          <p
            className={`text-gray-900 dark:text-white leading-relaxed ${gochiHand.className}`}
          >
            enough, ciao
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
              profilePic: "/images/10.jpg",
            }}
          />
        </div>
      </div>
    </Container>
  );
}
