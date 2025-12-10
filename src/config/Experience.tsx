import AWS from "@/components/technologies/AWS";
import BootStrap from "@/components/technologies/BootStrap";
import Bun from "@/components/technologies/Bun";
import CSS from "@/components/technologies/CSS";
import ExpressJs from "@/components/technologies/ExpressJs";
import Figma from "@/components/technologies/Figma";
import Html from "@/components/technologies/Html";
import JavaScript from "@/components/technologies/JavaScript";
import MongoDB from "@/components/technologies/MongoDB";
import NestJs from "@/components/technologies/NestJs";
import NextJs from "@/components/technologies/NextJs";
import NodeJs from "@/components/technologies/NodeJs";
import PostgreSQL from "@/components/technologies/PostgreSQL";
import Postman from "@/components/technologies/Postman";
import Prisma from "@/components/technologies/Prisma";
import ReactIcon from "@/components/technologies/ReactIcon";
import TailwindCss from "@/components/technologies/TailwindCss";
import TypeScript from "@/components/technologies/TypeScript";
import Vercel from "@/components/technologies/Vercel";

export interface Technology {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  image: string;
  description: string[];
  startDate: string;
  endDate: string;
  website: string;
  x?: string;
  linkedin?: string;
  github?: string;
  technologies: Technology[];
  isCurrent: boolean;
  isBlur?: boolean;
}

export const experiences: Experience[] = [
  {
    isCurrent: true,
    company: "Yahata Studio",
    position: "Lead Frontend/UI Engineer",
    location: "Pune (Remote)",
    image: "/company/yahata.jpg",
    description: [
      "Led end-to-end delivery across design and backend teams to ensure aligned requirements and reliable releases.",
      "Generated scalable design system components that reduced UI build effort on shared modules by 30%.",
      "Integrated and optimized backend API connections, implementing efficient data fetching strategies and error handling mechanisms.",
      "Ensured engineering quality through structured reviews, clear documentation, and scalable patterns.",
    ],
    startDate: "Feb 2024",
    endDate: "Present",
    technologies: [
      {
        name: "Next.js",
        href: "https://nextjs.org/",
        icon: <NextJs />,
      },
      {
        name: "Tailwind CSS",
        href: "https://tailwindcss.com/",
        icon: <TailwindCss />,
      },
      {
        name: "TypeScript",
        href: "https://typescriptlang.org/",
        icon: <TypeScript />,
      },
      {
        name: "React",
        href: "https://react.dev/",
        icon: <ReactIcon />,
      },
      {
        name: "Figma",
        href: "https://figma.com/",
        icon: <Figma />,
      },
      {
        name: "Vercel",
        href: "https://vercel.com/",
        icon: <Vercel />,
      },
      {
        name: "AWS",
        href: "https://aws.amazon.com/",
        icon: <AWS />,
      },
      {
        name: "Postman",
        href: "https://www.postman.com/",
        icon: <Postman />,
      },
      {
        name: "Bun",
        href: "https://bun.sh/",
        icon: <Bun />,
      },
    ],
    website: "#",
    github: "#",
    x: "#",
  },
  {
    isCurrent: false,
    company: "Egniol",
    position: "UI/Content Designer",
    location: "Ahmedabad, India (On-Site)",
    image: "/company/egniol.png",
    description: [
      "Identified user issues and generated technical specs to support engineering fixes within half the time.",
      "Engineered and deployed multiple high-performance agents, enhancing product capabilities and user experience.",
      "Directed requirement flow across product, engineering, and QA for accurate implementation.",
      "Streamlined development workflows by optimizing internal tools and maintaining detailed technical documentation.",
    ],
    startDate: "Nov 2022",
    endDate: "Oct 2023",
    technologies: [
      {
        name: "NestJS",
        href: "https://nestjs.com/",
        icon: <NestJs />,
      },
      {
        name: "Postman",
        href: "https://www.postman.com/",
        icon: <Postman />,
      },
      {
        name: "TypeScript",
        href: "https://www.typescriptlang.org/",
        icon: <TypeScript />,
      },
      {
        name: "Express",
        href: "https://expressjs.com/",
        icon: <ExpressJs />,
      },
    ],
    website: "https://egniol.com",
    github: "https://github.com/egniol",
    x: "https://x.com/egniol",
    linkedin: "https://www.linkedin.com/company/egniol",
  },
];
