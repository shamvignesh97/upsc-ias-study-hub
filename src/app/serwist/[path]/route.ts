import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "src/app/sw.ts",
    additionalPrecacheEntries: [
      { url: "/~offline", revision },
      { url: "/", revision },
      { url: "/syllabus", revision },
      { url: "/quiz", revision },
      { url: "/pyq", revision },
      { url: "/planner", revision },
      { url: "/bookmarks", revision },
      { url: "/search", revision },
      { url: "/methodology", revision },
      { url: "/optional", revision },
      { url: "/interview", revision },
    ],
    useNativeEsbuild: true,
  });
