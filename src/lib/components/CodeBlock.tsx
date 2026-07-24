import { useEffect, useRef, useState } from "react";

// Simple syntax highlighter for JSX/TSX code
function highlightCode(code: string): string {
  // Token order matters — process in sequence to avoid overlaps
  const tokens: string[] = [];
  const pushToken = (text: string, cls: string) => {
    tokens.push(`<span class="${cls}">${text}</span>`);
  };

  // Escape HTML
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Split into tokens: comments, strings, keywords, numbers, identifiers, whitespace, other
  const keywords = new Set([
    "import",
    "from",
    "export",
    "default",
    "function",
    "const",
    "let",
    "var",
    "return",
    "if",
    "else",
    "for",
    "while",
    "class",
    "extends",
    "new",
    "this",
    "typeof",
    "instanceof",
    "async",
    "await",
    "true",
    "false",
    "null",
    "undefined",
    "void",
    "type",
    "interface",
    "as",
    "in",
    "of",
    "readonly",
    "required",
    "import",
    "type",
    "from",
    "default",
    "export",
    "declare",
    "module",
    "string",
    "number",
    "boolean",
    "object",
    "any",
    "never",
    "unknown",
    "jsx",
    "tsx",
    "React",
    "JSX",
  ]);

  const builtins = new Set([
    "useState",
    "useCallback",
    "useEffect",
    "useRef",
    "useMemo",
    "useContext",
    "useReducer",
    "createContext",
    "memo",
    "forwardRef",
    "Suspense",
    "lazy",
    "React",
    "document",
    "window",
    "console",
    "Math",
    "JSON",
    "Promise",
    "Array",
    "Object",
    "String",
    "Number",
    "Map",
    "Set",
    "navigator",
    "setTimeout",
    "setInterval",
    "clearTimeout",
    "create",
    "render",
    "createElement",
  ]);

  // Step 1: Extract strings (single, double, template)
  const stringReplaces: { val: string; id: string }[] = [];
  let sid = 0;
  code = code.replace(/(".*?"|'.*?'|`[^`]*`)/g, (m) => {
    const id = `__STR${sid++}__`;
    stringReplaces.push({ id, val: esc(m) });
    return id;
  });

  // Step 2: Extract comments
  const commentReplaces: { val: string; id: string }[] = [];
  let cid = 0;
  code = code.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, (m) => {
    const id = `__CMT${cid++}__`;
    commentReplaces.push({ id, val: esc(m) });
    return id;
  });

  // Step 3: Tokenize remaining
  const result: string[] = [];
  const remaining = code;

  // Process character by character
  let i = 0;
  while (i < remaining.length) {
    const ch = remaining[i];

    // Check for token placeholder
    const strMatch = remaining.slice(i).match(/^__STR\d+__/);
    const cmtMatch = remaining.slice(i).match(/^__CMT\d+__/);

    if (strMatch) {
      const id = strMatch[0];
      const s = stringReplaces.find((s) => s.id === id)!;
      pushToken(s.val, "text");
      i += id.length;
      continue;
    }
    if (cmtMatch) {
      const id = cmtMatch[0];
      const c = commentReplaces.find((c) => c.id === id)!;
      pushToken(c.val, "text-muted-foreground italic");
      i += id.length;
      continue;
    }

    // Numbers
    if (/\d/.test(ch) && (i === 0 || !/\w/.test(remaining[i - 1]))) {
      let num = "";
      while (i < remaining.length && /[\d.xXa-fA-F_]/.test(remaining[i])) {
        num += remaining[i++];
      }
      pushToken(num, "text-amber-400");
      continue;
    }

    // Keywords and identifiers
    if (/[a-zA-Z_$]/.test(ch)) {
      let word = "";
      while (i < remaining.length && /[\w$]/.test(remaining[i])) {
        word += remaining[i++];
      }
      // Check if it's followed by ( → function call
      const rest = remaining.slice(i).trimStart();
      if (keywords.has(word)) {
        pushToken(word, "text-pink-400 font-semibold");
      } else if (builtins.has(word)) {
        pushToken(word, "text-cyan-400");
      } else if (
        word[0] === word[0].toUpperCase() &&
        word[0] !== word[0].toLowerCase()
      ) {
        pushToken(word, "text-emerald-400"); // JSX component / class
      } else if (rest.startsWith("(")) {
        pushToken(word, "text-sky-300"); // function call
      } else {
        pushToken(word, "text-foreground/90");
      }
      continue;
    }

    // JSX tags: <Word
    if (
      ch === "<" &&
      i + 1 < remaining.length &&
      /[A-Z]/.test(remaining[i + 1])
    ) {
      let tag = "<";
      i++;
      while (i < remaining.length && /[\w.]/.test(remaining[i])) {
        tag += remaining[i++];
      }
      // Check for closing >
      if (i < remaining.length && remaining[i] !== ">") {
        // Self-closing or has attrs
        while (i < remaining.length && remaining[i] !== ">") {
          if (remaining[i] === "/") {
            tag += remaining[i++];
          } else i++;
        }
      }
      if (i < remaining.length) {
        tag += remaining[i++];
      }
      pushToken(tag, "text-emerald-300");
      continue;
    }

    // JSX closing tags: </Word>
    if (ch === "<" && i + 1 < remaining.length && remaining[i + 1] === "/") {
      let tag = "</";
      i += 2;
      while (i < remaining.length && /[\w.]/.test(remaining[i])) {
        tag += remaining[i++];
      }
      if (i < remaining.length && remaining[i] === ">") {
        tag += remaining[i++];
      }
      pushToken(tag, "text-emerald-300");
      continue;
    }

    // Default: keep as-is
    if (ch === "<") {
      // Handle angle brackets for generics etc.
      result.push(esc(ch));
      i++;
      continue;
    }
    if (ch === ">") {
      result.push(esc(ch));
      i++;
      continue;
    }
    if (ch === "=") {
      result.push(ch);
      i++;
      continue;
    }

    result.push(esc(ch));
    i++;
  }

  return result.join("");
}

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [highlighted, setHighlighted] = useState(code);
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setHighlighted(highlightCode(code));
  }, [code]);

  return (
    <pre
      className="overflow-auto whitespace-pre-wrap leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlighted }}
      ref={ref}
    />
  );
}
