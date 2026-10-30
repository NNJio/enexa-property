"use client";

import { useEffect, useState } from "react";

export function CopyButton({
  text,
  label,
  copiedLabel,
}: {
  text: string;
  label: string;
  copiedLabel: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "shown">("idle");

  useEffect(() => {
    setState("idle");
  }, [text]);

  return (
    <span className="copy">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setState("copied");
          } catch {
            setState("shown");
          }
        }}
      >
        {state === "copied" ? copiedLabel : label}
      </button>
      {state === "shown" ? <span className="copy-text">{text}</span> : null}
    </span>
  );
}
