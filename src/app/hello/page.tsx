import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ScrollingGallery from "@/components/common/ScrollingGallery";
import { Cedarville_Cursive, Gochi_Hand } from "next/font/google";
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

export default function HelloPage() {
  return (
    <Container className="min-h-screen py-16">
      <SectionHeading subHeading="Hidden Page" heading="Hello" />

      <div className="mt-12 space-y-20">
        {/* Section 1 - Content Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 space-y-4">
            <h2 className={`text-3xl font-bold ${gochiHand.className}`}>
              Creative Design Solutions
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
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop"
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

        {/* Photo Gallery */}
        <div className="mt-20">
          <ScrollingGallery />
        </div>
      </div>
    </Container>
  );
}
