import Github from "@/components/svgs/Github";
import LinkedIn from "@/components/svgs/LinkedIn";
import Mail from "@/components/svgs/Mail";
import X from "@/components/svgs/X";
import Bun from "@/components/technologies/Bun";
import JavaScript from "@/components/technologies/JavaScript";
import MongoDB from "@/components/technologies/MongoDB";
import NextJs from "@/components/technologies/NextJs";
import NodeJs from "@/components/technologies/NodeJs";
import PostgreSQL from "@/components/technologies/PostgreSQL";
import Prisma from "@/components/technologies/Prisma";
import ReactIcon from "@/components/technologies/ReactIcon";
import Motion from "@/components/technologies/Motion";
import Figma from "@/components/technologies/Figma";

// Technology Components
import TypeScript from "@/components/technologies/TypeScript";

// Component mapping for skills
export const skillComponents = {
  TypeScript: TypeScript,
  ReactIcon: ReactIcon,
  NextJs: NextJs,
  Bun: Bun,
  PostgreSQL: PostgreSQL,
  NodeJs: NodeJs,
  MongoDB: MongoDB,
  Prisma: Prisma,
  JavaScript: JavaScript,
  Motion: Motion,
  Figma: Figma,
};

export const heroConfig = {
  // Personal Information
  name: "Yash",
  title: "An AI Engineer.",
  avatar: "/assets/logo.png",

  // Skills Configuration
  skills: [
    {
      name: "Typescript",
      href: "https://www.typescriptlang.org/",
      component: "TypeScript",
    },
    {
      name: "React",
      href: "https://react.dev/",
      component: "ReactIcon",
    },
    {
      name: "Next.js",
      href: "https://nextjs.org/",
      component: "NextJs",
    },
    {
      name: "Bun",
      href: "https://bun.sh/",
      component: "Bun",
    },
    {
      name: "PostgreSQL",
      href: "https://www.postgresql.org/",
      component: "PostgreSQL",
    },
    {
      name: "Motion",
      href: "https://www.motion.dev/",
      component: "Motion",
    },

    {
      name: "Figma",
      href: "https://www.figma.com/",
      component: "Figma",
    },
  ],

  // Description Configuration
  description: {
    template:
      "I create apps and AI agents to make your life easier using {skills:0}, {skills:1}, {skills:2}, {skills:3} and {skills:4}. I make unreal UIs possible in {skills:6}, making it alive with {skills:5}.",
  },

  // Buttons Configuration
  buttons: [
    {
      variant: "outline",
      text: "Resume / CV",
      href: "/resume",
      icon: "CV",
    },
    {
      variant: "default",
      text: "Get in touch",
      href: "/contact",
      icon: "Chat",
    },
  ],
};

// Social Links Configuration
export const socialLinks = [
  {
    name: "X",
    href: "https://x.com/yshdev27",
    icon: <X />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/gyash21/",
    icon: <LinkedIn />,
  },
  {
    name: "Github",
    href: "https://github.com/yshdev27",
    icon: <Github />,
  },
  {
    name: "Email",
    href: "mailto:gyash21@gmail.com",
    icon: <Mail />,
  },
];
