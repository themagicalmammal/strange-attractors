import type { AttractorSystem } from "./systems";

import { useCallback, useEffect, useState } from "react";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Badge } from "@/components/ui/badge";

import { AttractorCanvas } from "./components/AttractorCanvas";
import { AttractorPanel } from "./components/AttractorPanel";
import { useTheme } from "./components/providers/ThemeToggle";
import { ZoomControls } from "./components/ZoomControls";
import { getSystem, systems } from "./systems";

// ─── URL params (for share links) ────────────────────────

function encodeShareUrl(
  system: AttractorSystem,
  params: number[],
  stepsPerFrame: number,
  colorSpeed: number,
  pointSize: number,
  speed: number,
  autoRotate: boolean,
): string {
  const sp = new URLSearchParams();
  sp.set("system", system.id);
  params.forEach((v, i) => sp.set(`p${i}`, String(v)));
  sp.set("s", String(stepsPerFrame));
  sp.set("c", String(colorSpeed));
  sp.set("r", String(pointSize));
  sp.set("sp", String(speed));
  sp.set("ar", String(autoRotate));
  const base = window.location.origin + window.location.pathname;
  return `${base}?${sp.toString()}`;
}

function parseUrlParams(): {
  systemId?: string;
  params?: number[];
  steps?: number;
  colorSpeed?: number;
  pointSize?: number;
  speed?: number;
  autoRotate?: boolean;
} {
  const sp = new URLSearchParams(window.location.search);
  const result: Record<string, unknown> = {};
  if (sp.has("system")) result.systemId = sp.get("system")!;
  const params: number[] = [];
  let i = 0;
  while (sp.has(`p${i}`)) {
    params.push(parseFloat(sp.get(`p${i}`)!));
    i++;
  }
  if (params.length > 0) result.params = params;
  if (sp.has("s")) result.steps = parseInt(sp.get("s")!);
  if (sp.has("c")) result.colorSpeed = parseFloat(sp.get("c")!);
  if (sp.has("r")) result.pointSize = parseFloat(sp.get("r")!);
  if (sp.has("sp")) result.speed = parseFloat(sp.get("sp")!);
  if (sp.has("ar")) result.autoRotate = sp.get("ar") === "true";
  return result;
}

function generateShareCode(
  system: AttractorSystem,
  params: number[],
  stepsPerFrame: number,
  colorSpeed: number,
  pointSize: number,
  speed: number,
  autoRotate: boolean,
): string {
  const paramLines = params.map(
    (v, i) => `    ${system.params.names[i]}: ${v}`,
  );
  return `// Attractor — ${system.name}
// Params: ${system.params.names.join(", ")}
${paramLines.join("\n")}

import { useState, useCallback } from "react";
import { AttractorCanvas, AttractorPanel, getSystem, systems } from "attractor-react";

export function App() {
  const [params, setParams] = useState([${params.map((v) => v.toFixed(3)).join(", ")}]);
  const [stepsPerFrame, setStepsPerFrame] = useState(${stepsPerFrame});
  const [colorSpeed, setColorSpeed] = useState(${colorSpeed});
  const [pointSize, setPointSize] = useState(${pointSize});
  const [speed, setSpeed] = useState(${speed});
  const [autoRotate, setAutoRotate] = useState(${autoRotate});
  const [resetKey, setResetKey] = useState(0);

  return (
    <>
      <AttractorCanvas
        system={getSystem("${system.id}")}
        params={params}
        stepsPerFrame={stepsPerFrame}
        colorSpeed={colorSpeed}
        pointSize={pointSize}
        speed={speed}
        autoRotate={autoRotate}
        resetKey={resetKey}
      />
      <AttractorPanel
        system={getSystem("${system.id}")}
        selectedId="${system.id}"
        systems={systems}
        params={params}
        stepsPerFrame={stepsPerFrame}
        colorSpeed={colorSpeed}
        pointSize={pointSize}
        speed={speed}
        autoRotate={autoRotate}
        onParamChange={...}
        onStepsChange={setStepsPerFrame}
        onColorSpeedChange={setColorSpeed}
        onPointSizeChange={setPointSize}
        onSpeedChange={setSpeed}
        onAutoRotateChange={setAutoRotate}
        onReset={() => setResetKey((k) => k + 1)}
      />
    </>
  );
}`;
}

export default function App() {
  const urlParams = parseUrlParams();
  const themeCtx = useTheme();

  const [selectedId, setSelectedId] = useState(urlParams.systemId ?? "lorenz");
  const [params, setParams] = useState<number[]>(
    () => urlParams.params ?? [...getSystem("lorenz")!.params.defaults],
  );
  const [stepsPerFrame, setStepsPerFrame] = useState(urlParams.steps ?? 50);
  const [colorSpeed, setColorSpeed] = useState(urlParams.colorSpeed ?? 1);
  const [pointSize, setPointSize] = useState(urlParams.pointSize ?? 1.5);
  const [speed, setSpeed] = useState(urlParams.speed ?? 0.5);
  const [autoRotate, setAutoRotate] = useState(urlParams.autoRotate ?? true);

  const [resetKey, setResetKey] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleParamChange = useCallback((index: number, value: number) => {
    setParams((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleSystemChange = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  const system = getSystem(selectedId)!;

  useEffect(() => {
    const s = getSystem(selectedId);
    if (s) setParams([...s.params.defaults]);
  }, [selectedId]);

  const shareCode = generateShareCode(
    system,
    params,
    stepsPerFrame,
    colorSpeed,
    pointSize,
    speed,
    autoRotate,
  );
  const shareUrl = encodeShareUrl(
    system,
    params,
    stepsPerFrame,
    colorSpeed,
    pointSize,
    speed,
    autoRotate,
  );

  const handleCopy = useCallback(
    async (type: "code" | "link") => {
      try {
        const text = type === "code" ? shareCode : shareUrl;
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      } catch {
        /* intentional no-op */
      }
    },
    [shareCode, shareUrl],
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Theme background behind canvas */}
      <div className="absolute inset-0 bg-background z-0 transition-colors duration-500" />

      {/* Header controls — top-right */}
      <div className="sm:top-6 sm:right-6 top-3 right-3 z-20 flex items-center gap-2">
        <AnimatedThemeToggler
          className="h-10 w-10 rounded-xl bg-background/90 text-foreground transition-smooth active:scale-95"
          onThemeChange={(t) => themeCtx.setTheme(t as "dark" | "light")}
          theme={themeCtx.theme === "dark" ? "dark" : "light"}
        />
        {/* Mobile settings button */}
        <button
          className="h-10 w-10 rounded-xl bg-background/90 text-foreground backdrop-blur-sm transition-smooth active:scale-95 border border-border/20 dark:border-white/10"
          onClick={() => setPanelOpen((v) => !v)}
        >
          {panelOpen ? (
            <svg
              className="mx-auto size-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="mx-auto size-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0" />
            </svg>
          )}
        </button>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 z-10">
        <AttractorCanvas
          autoRotate={autoRotate}
          colorSpeed={colorSpeed}
          params={params}
          pointSize={pointSize}
          resetKey={resetKey}
          speed={speed}
          stepsPerFrame={stepsPerFrame}
          system={system}
        />
      </div>

      {/* Panel — hidden by default on mobile, shown via popup */}
      <AttractorPanel
        autoRotate={autoRotate}
        colorSpeed={colorSpeed}
        mobileOpen={panelOpen}
        onAutoRotateChange={setAutoRotate}
        onCloseMobile={() => setPanelOpen(false)}
        onColorSpeedChange={setColorSpeed}
        onParamChange={handleParamChange}
        onPointSizeChange={setPointSize}
        onReset={handleReset}
        onShare={() => setShareOpen(true)}
        onSpeedChange={setSpeed}
        onStepsChange={setStepsPerFrame}
        onSystemChange={handleSystemChange}
        params={params}
        pointSize={pointSize}
        selectedId={selectedId}
        speed={speed}
        stepsPerFrame={stepsPerFrame}
        system={system}
        systems={systems}
      />

      {/* Zoom controls — bottom-right */}
      <div className="sm:bottom-6 sm:right-6 bottom-28 right-4">
        <ZoomControls />
      </div>

      {/* Share Modal */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-backdrop-fade"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="relative w-full sm:max-w-2xl max-w-full max-h-[80vh] overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl flex flex-col animate-modal-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold tracking-tight">
                  Share This Configuration
                </h2>
                <Badge
                  className="text-sm font-medium rounded-full px-4 py-1.5"
                  variant="outline"
                >
                  {system.name}
                </Badge>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground transition-smooth rounded-xl p-2 hover:bg-muted/50"
                onClick={() => setShareOpen(false)}
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto px-10 py-8 space-y-8">
              {/* Code block */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-muted-foreground">
                    Component Code
                  </span>
                  <button
                    className={`text-sm font-medium rounded-xl px-5 py-2 transition-smooth ${
                      copied === "code"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => handleCopy("code")}
                  >
                    {copied === "code" ? "✓ Copied!" : "Copy Code"}
                  </button>
                </div>
                <pre className="p-5 rounded-xl bg-muted/30 text-sm font-mono text-foreground overflow-auto max-h-64 whitespace-pre-wrap leading-relaxed border border-border/30">
                  {shareCode}
                </pre>
              </div>

              {/* Share link */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-muted-foreground">
                    Shareable Link
                  </span>
                  <button
                    className={`text-sm font-medium rounded-xl px-5 py-2 transition-smooth ${
                      copied === "link"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => handleCopy("link")}
                  >
                    {copied === "link" ? "✓ Copied!" : "Copy Link"}
                  </button>
                </div>
                <div className="relative">
                  <pre className="p-5 rounded-xl bg-muted/30 text-sm font-mono text-foreground overflow-x-auto border border-border/30 select-all whitespace-nowrap leading-relaxed">
                    {shareUrl}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
