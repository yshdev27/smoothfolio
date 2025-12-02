"use client";

import { type Experience } from "@/config/Experience";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React, { useState } from "react";

import Skill from "../common/Skill";
import ArrowRight from "../svgs/ArrowRight";
import Github from "../svgs/Github";
import LinkedIn from "../svgs/LinkedIn";
import Website from "../svgs/Website";
import X from "../svgs/X";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ExperienceCardProps {
  experience: Experience;
  isFirst?: boolean;
}

const parseDescription = (text: string): string => {
  return text.replace(/\*(.*?)\*/g, "<b>$1</b>");
};

export function ExperienceCard({
  experience,
  isFirst = false,
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(isFirst);

  console.log(
    "ExperienceCard:",
    experience.company,
    "isFirst:",
    isFirst,
    "isExpanded:",
    isExpanded,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Company Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full flex-col gap-2 md:flex-row md:justify-between md:items-center text-left"
      >
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Image
            src={experience.image}
            alt={experience.company}
            width={100}
            height={100}
            className="size-12 rounded-md"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-lg font-bold",
                  experience.isBlur ? "blur-[5px]" : "blur-none",
                )}
              >
                {experience.company}
              </h3>
              {experience.website && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={experience.website}
                      target="_blank"
                      className="size-4 text-neutral-500"
                    >
                      <Website />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Visit Website</TooltipContent>
                </Tooltip>
              )}
              {experience.x && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={experience.x}
                      target="_blank"
                      className="size-4 text-neutral-500"
                    >
                      <X />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Follow on X</TooltipContent>
                </Tooltip>
              )}
              {experience.linkedin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={experience.linkedin}
                      target="_blank"
                      className="size-4 text-neutral-500"
                    >
                      <LinkedIn />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Connect on LinkedIn</TooltipContent>
                </Tooltip>
              )}
              {experience.github && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={experience.github}
                      target="_blank"
                      className="size-4 text-neutral-500"
                    >
                      <Github />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>View GitHub</TooltipContent>
                </Tooltip>
              )}
              {experience.isCurrent && (
                <div className="flex items-center gap-1 rounded-md border-green-300 bg-green-500/10 px-2 py-1 text-xs">
                  <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                  Working
                </div>
              )}
            </div>
            <p>{experience.position}</p>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="text-secondary flex flex-col md:text-right">
            <p>
              {experience.startDate} -{" "}
              {experience.isCurrent ? "Present" : experience.endDate}
            </p>
            <p>{experience.location}</p>
          </div>
          {/* Arrow Icon */}
          <div
            className={cn(
              "size-5 text-neutral-500 transition-transform duration-300",
              isExpanded ? "rotate-180" : "",
            )}
          >
            <ArrowRight />
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pt-2">
            {/* Technologies */}
            <div>
              <h4 className="text-md mb-2 font-semibold">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map(
                  (technology, techIndex: number) => (
                    <Skill
                      key={techIndex}
                      name={technology.name}
                      href={technology.href}
                    >
                      {technology.icon}
                    </Skill>
                  ),
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-secondary flex flex-col gap-1">
              {experience.description.map(
                (description: string, descIndex: number) => (
                  <p
                    key={descIndex}
                    dangerouslySetInnerHTML={{
                      __html: `• ${parseDescription(description)}`,
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
