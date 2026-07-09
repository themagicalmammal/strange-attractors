import { useState, useCallback, useEffect } from "react";
import { getSystem, systems } from "./systems";
import type { AttractorSystem } from "./systems";
import { AttractorCanvas } from "./components/AttractorCanvas";
import { AttractorPanel } from "./components/AttractorPanel";
import { ThemeToggle } from "./components/providers/ThemeToggle";
import { ComponentDocs } from "./components/ComponentDocs";

// ─── URL params (for share links) ────────────────────────

function encodeShareUrl(system: AttractorSystem, params: number[], stepsPerFrame: number, colorSpeed: number, pointSize: number, autoRotate: boolean): string {
  const sp = new URLSearchParams();
  sp.set("system", system.id);
  params.forEach((v, i) => sp.set(`p${i}`, String(v)));
  sp.set("s", String(stepsPerFrame));
  sp.set("c", String(colorSpeed));
  sp.set("r", String(pointSize));
  sp.set("ar", String(autoRotate));
  const base = window.location.origin + window.location.pathname;
  return `${base}?${sp.toString()}`;
}

function parseUrlParams(): { systemId?: string; params?: number[]; steps?: number; colorSpeed?: number; pointSize?: number; autoRotate?: boolean } {
  const sp = new URLSearchParams(window.location.search);
  const result: any = {};
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
  if (sp.has("ar")) result.autoRotate = sp.get("ar") === "true";
  return result;
}

function generateShareCode(system: AttractorSystem, params: number[], stepsPerFrame: number, colorSpeed: number, pointSize: number, autoRotate: boolean): string {
  const paramLines = params.map((v, i) => `    ${system.params.names[i]}: ${v}`);
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
        autoRotate={autoRotate}
        onParamChange={...}
        onStepsChange={setStepsPerFrame}
        onColorSpeedChange={setColorSpeed}
        onPointSizeChange={setPointSize}
        onAutoRotateChange={setAutoRotate}
        onReset={() => setResetKey((k) => k + 1)}
      />
    </>
  );
}`;
}

export default function App() {
  const urlParams = parseUrlParams();

  const [selectedId, setSelectedId] = useState(urlParams.systemId ?? "lorenz");
  const [params, setParams] = useState<number[]>(() => urlParams.params ?? [...getSystem("lorenz")!.params.defaults]);
  const [stepsPerFrame, setStepsPerFrame] = useState(urlParams.steps ?? 50);
  const [colorSpeed, setColorSpeed] = useState(urlParams.colorSpeed ?? 1);
  const [pointSize, setPointSize] = useState(urlParams.pointSize ?? 1.5);
  const [autoRotate, setAutoRotate] = useState(urlParams.autoRotate ?? true);

  const [resetKey, setResetKey] = useState(0);
  const [openDocs, setOpenDocs] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const shareCode = generateShareCode(system, params, stepsPerFrame, colorSpeed, pointSize, autoRotate);
  const shareUrl = encodeShareUrl(system, params, stepsPerFrame, colorSpeed, pointSize, autoRotate);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [shareCode]);

  const handleShareLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [shareUrl]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Theme background behind canvas */}
      <div className="absolute inset-0 bg-background z-0" />

      {/* Header controls — top-right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <ThemeToggle />
        <button
          className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-muted hover:text-foreground transition-colors"
          onClick={() => setOpenDocs(true)}
        >
          <svg className="size-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          Docs
        </button>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 z-10">
        <AttractorCanvas
          system={system}
          params={params}
          stepsPerFrame={stepsPerFrame}
          colorSpeed={colorSpeed}
          pointSize={pointSize}
          autoRotate={autoRotate}
          resetKey={resetKey}
        />
      </div>

      {/* Panel */}
      <AttractorPanel
        system={system}
        selectedId={selectedId}
        systems={systems}
        params={params}
        stepsPerFrame={stepsPerFrame}
        colorSpeed={colorSpeed}
        pointSize={pointSize}
        autoRotate={autoRotate}
        onSystemChange={handleSystemChange}
        onParamChange={handleParamChange}
        onStepsChange={setStepsPerFrame}
        onColorSpeedChange={setColorSpeed}
        onPointSizeChange={setPointSize}
        onAutoRotateChange={setAutoRotate}
        onReset={handleReset}
        onShare={() => setShareOpen(true)}
      />

      {/* Docs Modal */}
      {openDocs && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpenDocs(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ComponentDocs onClose={() => setOpenDocs(false)} />
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-xl border border-border bg-background shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-sm font-semibold">Share This Configuration</h2>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShareOpen(false)}
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-4">
              {/* Code block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Component Code</span>
                  <button
                    className={`text-xs px-2 py-1 rounded transition-colors ${copied ? "bg-green-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"}`}
                    onClick={handleCopy}
                  >
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-muted/50 text-xs font-mono text-foreground overflow-auto max-h-60 whitespace-pre-wrap">
                  {shareCode}
                </pre>
              </div>

              {/* Share link */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Shareable Link</span>
                  <button
                    className={`text-xs px-2 py-1 rounded transition-colors ${copied ? "bg-green-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"}`}
                    onClick={handleShareLink}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-muted/50 text-xs font-mono text-foreground overflow-hidden text-ellipsis">
                  {shareUrl}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
