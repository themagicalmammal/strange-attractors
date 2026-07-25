import hljs from "highlight.js";
import { useEffect, useRef } from "react";

import "./dracula.css";

export function CodeBlock({ code }: { code: string }) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      ref.current.innerHTML = hljs.highlight(code, {
        language: "typescript",
      }).value;
    } catch {
      ref.current.textContent = code;
    }
  }, [code]);

  return (
    <pre className="overflow-auto rounded-xl border border-border/40 bg-[#282a36] px-4 py-5 text-sm font-mono leading-relaxed max-h-80 [&_code]:m-0! [&_code]:bg-transparent! [&_code]:p-0! [&_code]:text-inherit!">
      <code ref={ref} />
    </pre>
  );
}
