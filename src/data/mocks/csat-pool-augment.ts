import type { MockQuestion } from "@/types";
import { csatMockPool } from "./csat-pool";
import { csatQuantsExtraPool } from "./csat-quants-extra-pool";

/** Full CSAT mock pool with expanded high-prob quants. */
export const csatMockPoolExpanded: MockQuestion[] = [
  ...csatMockPool,
  ...csatQuantsExtraPool,
];
