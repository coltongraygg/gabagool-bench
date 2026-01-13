"use client";

import type { ReactNode } from "react";
import { SYSTEM_PROMPT_DISPLAY, SYSTEM_PROMPT_HIGHLIGHTS } from "@/lib/types";

export function StyledSystemPrompt() {
  let result: (string | ReactNode)[] = [SYSTEM_PROMPT_DISPLAY];

  Object.entries(SYSTEM_PROMPT_HIGHLIGHTS).forEach(([keyword, color]) => {
    result = result.flatMap((part, partIndex) => {
      if (typeof part !== "string") return part;
      const parts = part.split(new RegExp(`(${keyword})`, "gi"));
      return parts.map((segment, i) =>
        segment.toLowerCase() === keyword.toLowerCase() ? (
          <span
            key={`${partIndex}-${i}`}
            style={{ color }}
            className="font-semibold"
          >
            {segment}
          </span>
        ) : (
          segment
        )
      );
    });
  });

  return <>&ldquo;{result}&rdquo;</>;
}
