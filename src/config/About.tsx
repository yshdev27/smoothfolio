import Bun from "@/components/technologies/Bun";
import JavaScript from "@/components/technologies/JavaScript";
import MongoDB from "@/components/technologies/MongoDB";
import NextJs from "@/components/technologies/NextJs";
import NodeJs from "@/components/technologies/NodeJs";
import PostgreSQL from "@/components/technologies/PostgreSQL";
import Prisma from "@/components/technologies/Prisma";
import ReactIcon from "@/components/technologies/ReactIcon";
import TypeScript from "@/components/technologies/TypeScript";

export const mySkills = [
  <ReactIcon key="react" />,
  <Bun key="bun" />,
  <JavaScript key="javascript" />,
  <TypeScript key="typescript" />,
  <MongoDB key="mongodb" />,
  <NextJs key="nextjs" />,
  <NodeJs key="nodejs" />,
  <PostgreSQL key="postgresql" />,
  <Prisma key="prisma" />,
];

export const about = {
  name: "Yash Gupta",
  description: `I'm an AI engineer who eat and breathes design. I love making your life easy with AI-powered solutions that are as beautiful as they are functional. Let's create something amazing together!`,
};

// Default export to make sure this module has a concrete runtime export.
export default about;
