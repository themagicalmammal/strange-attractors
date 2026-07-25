import type { AttractorSystem } from "../systems";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/lib/components/ui/button";
import { ScrollArea } from "@/lib/components/ui/scroll-area";
import { Separator } from "@/lib/components/ui/separator";
import { Switch } from "@/lib/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/ui/tooltip";

import StyledSlider from "./StyledSlider";

// ─── Background colors ───────────────────────────────────────

const BG_COLORS = [
  // Dark tones
  "#000000",
  "#0a0a0a",
  "#111111",
  "#1a1a1a",
  "#1e1e2e",
  "#18181b",
  "#222222",
  "#2a2a2a",
  "#333333",
  "#4a4a4a",
  // Mid / light tones
  "#6b6b6b",
  "#a0a0a0",
  "#d4d4d4",
  "#f5f5f5",
  "#ffffff",
  // Cool accents
  "#0c1322",
  "#0f172a",
  "#0a2e1a",
  "#1a2e2e",
  "#0a1a2e",
  "#2e0a2e",
  // Warm accents
  "#2e0a1a",
  "#2e1a0a",
  "#1a2e0a",
  "#2e2a0a",
  // Extra tones
  "#2e201a",
  "#1a2e1a",
  "#201a2e",
] as const;

function ColorPicker({
  onChange,
  value,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const timer = setTimeout(
      () => document.addEventListener("mousedown", onClick),
      0,
    );
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="size-5 rounded-full ring-1 ring-border/30 transition hover:ring-2 hover:ring-indigo-500/50"
        onClick={() => setOpen((v) => !v)}
        style={{ backgroundColor: value }}
        title={value}
      />
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-72 rounded-2xl border border-border/50 bg-background/95 p-5 shadow-2xl backdrop-blur-md">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Background
            </p>
            <div className="grid grid-cols-4 gap-3">
              {BG_COLORS.map((c) => (
                <button
                  className={`size-10 rounded-xl transition hover:scale-110 ${
                    value === c ? "ring-indigo-500 ring-2" : "ring-border/20"
                  }`}
                  key={c}
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            {/* Custom hex input */}
            <div className="mt-4">
              <input
                className="w-full rounded-lg border border-border/30 bg-transparent px-3 py-2 text-sm font-mono text-foreground outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                defaultValue={value}
                onBlur={(e) => {
                  const hex = e.target.value.trim();
                  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
                    onChange(hex);
                  } else {
                    e.target.value = value;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    const hex = target.value.trim();
                    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
                      onChange(hex);
                      setOpen(false);
                    } else {
                      target.value = value;
                    }
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
                placeholder="#000000"
                type="text"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── System selector ─────────────────────────────────────────

function SystemSelector({
  onChange,
  selectedId,
  systems,
}: {
  systems: AttractorSystem[];
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = systems.find((s) => s.id === selectedId);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const timer = setTimeout(
      () => document.addEventListener("mousedown", onClick),
      0,
    );
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector(`[data-id="${selectedId}"]`);
      if (el) (el as HTMLElement).scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="rounded-xl border border-border/20 bg-muted/30 px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:border-border/40 hover:bg-muted/50 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mr-1.5 inline-block size-2 rounded-full bg-indigo-400" />
        {selected?.name ?? "Select"}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 min-w-[160px] max-w-[240px] animate-in fade-in-0 slide-in-from-top-2">
          <div
            className="max-h-64 overflow-y-auto rounded-xl border border-border/30 bg-background/95 p-1.5 shadow-xl backdrop-blur-md"
            ref={listRef}
          >
            {systems.map((s) => (
              <button
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  s.id === selectedId
                    ? "bg-indigo-500/10 font-semibold text-indigo-600 dark:text-indigo-400"
                    : "text-foreground/70 hover:bg-muted/50"
                }`}
                data-id={s.id}
                key={s.id}
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
              >
                <span className="mr-2 inline-block size-2 rounded-full bg-indigo-400" />
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────────

interface AttractorPanelProps {
  autoRotate: boolean;
  backgroundColor?: string;
  colorSpeed: number;
  mobileOpen?: boolean;
  onAutoRotateChange: (value: boolean) => void;
  onBackgroundColorChange?: (value: string) => void;
  onCloseMobile?: () => void;
  onColorSpeedChange: (value: number) => void;
  onParamChange: (index: number, value: number) => void;
  onPointSizeChange: (value: number) => void;
  onReset: () => void;
  onResetAfterChange?: (value: number) => void;
  onShare: () => void;
  onSpeedChange: (value: number) => void;
  onStepsChange: (value: number) => void;
  onSystemChange: (id: string) => void;
  onWallpaperDownload?: () => void;
  params: number[];
  pointSize: number;
  resetAfter: number;
  selectedId: string;
  speed: number;
  stepsPerFrame: number;
  system: AttractorSystem;
  systems: AttractorSystem[];
}

// ─── Helpers ────────────────────────────────────────────────

function formatParam(v: number): string {
  const abs = Math.abs(v);
  if (abs === 0) return "0";
  if (abs >= 100) return Math.round(v).toString();
  const decimals =
    abs >= 10 ? 1 : abs >= 1 ? 2 : abs >= 0.01 ? 4 : abs >= 0.0001 ? 6 : 8;
  return parseFloat(v.toFixed(decimals)).toString();
}

// ─── Panel shell ────────────────────────────────────────────

function Panel({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border/20 bg-background/80 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-[0_32px_80px_rgba(0,0,0,0.4)] ${
        className ?? ""
      }`}
      {...props}
    />
  );
}

// ─── Section wrapper ────────────────────────────────────────

function Section({
  children,
  label,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 dark:text-white/30">
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Param cell ─────────────────────────────────────────────

interface ParamCellProps {
  accent: string;
  description?: string;
  max: number;
  min: number;
  name: string;
  onChange: (v: number) => void;
  step?: number;
  value: number;
}

function ParamCell({
  accent,
  description,
  max,
  min,
  name,
  onChange,
  step,
  value,
}: ParamCellProps) {
  return (
    <div className="group/cell flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full ring-2 ring-border/5 transition-transform group-hover/cell:scale-125 dark:ring-white/5"
            style={{
              backgroundColor: accent,
              boxShadow: `0 0 6px ${accent}60`,
            }}
          />
          <span className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
            {name}
          </span>
        </div>
        <span className="rounded bg-muted dark:bg-white/4 px-1.5 py-0.5 text-[10px] font-mono tabular-nums text-muted-foreground dark:text-white/50 transition-colors group-hover/cell:text-foreground dark:group-hover/cell:text-white/70">
          {formatParam(value)}
        </span>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="-mr-1 cursor-help text-muted-foreground/40 hover:text-muted-foreground transition-colors dark:text-white/20 dark:hover:text-white/50">
                <svg
                  className="size-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-1M12 13h.01" />
                </svg>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="top" sideOffset={8}>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <StyledSlider
        color={accent}
        format={formatParam}
        label=""
        max={max}
        min={min}
        onChange={onChange}
        step={step ?? (max - min) / 200}
        value={value}
      />
    </div>
  );
}

// ─── Descriptions lookup ────────────────────────────────────

const paramDescriptions: Record<string, string> = {
  a: "Parameter a — system coefficient",
  b: "Parameter b — system coefficient",
  B: "Parameter B — system coefficient",
  c: "Parameter c — system coefficient",
  d: "Parameter d — system coefficient",
  e: "Parameter e — system coefficient",
  f: "Parameter f — system coefficient",
  g: "Parameter g — system coefficient",
  h: "Parameter h — system coefficient",
  k: "Parameter k — system coefficient",
  p: "Parameter p — system coefficient",
  q: "Parameter q — system coefficient",
  r: "Parameter r — system coefficient",
  s: "Parameter s — system coefficient",
  t: "Parameter t — system coefficient",
  v: "Parameter v — system coefficient",
  "α (alpha)": "Parameter alpha — system coefficient",
  "β (beta)": "Relates to the vertical dimension compression",
  ε: "Parameter epsilon — system coefficient",
  λ: "Parameter lambda — system coefficient",
  μ: "Parameter mu — system coefficient",
  "ρ (rho)": "Represents the rate of convection",
  "σ (sigma)": "Controls the horizontal spreading of the attractor",
  ω: "Parameter omega — system coefficient",
};

// ─── Accent colors for sliders ──────────────────────────────

const ACCENTS = {
  amber: "#fbbf24",
  blue: "#818cf8",
  cyan: "#22d3ee",
  emerald: "#34d399",
  rose: "#fb7185",
  violet: "#a78bfa",
} as const;

// ─── Main panel ─────────────────────────────────────────────

export function AttractorPanel({
  autoRotate,
  backgroundColor,
  colorSpeed,
  mobileOpen,
  onAutoRotateChange,
  onBackgroundColorChange,
  onCloseMobile,
  onColorSpeedChange,
  onParamChange,
  onPointSizeChange,
  onReset,
  onResetAfterChange,
  onShare,
  onSpeedChange,
  onStepsChange,
  onSystemChange,
  onWallpaperDownload,
  params,
  pointSize,
  resetAfter,
  selectedId,
  speed,
  stepsPerFrame,
  system,
  systems,
}: AttractorPanelProps) {
  return (
    <>
      {/* ── Mobile backdrop ──────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden animate-backdrop-fade"
          onClick={onCloseMobile}
        />
      )}

      {/* ── Mobile popup panel ───────────────────────── */}
      <div
        className={`fixed z-30 md:hidden transition-transform duration-300 ease-out pointer-events-auto bottom-0 left-0 right-0 ${mobileOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <Panel className="flex flex-col rounded-b-none rounded-t-2xl max-h-[90vh]">
          {/* ── Header ──────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-border/20 dark:border-white/6 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base">✦</span>
                <span className="text-[13px] font-semibold tracking-wide text-foreground/90 dark:text-white/90">
                  Strange Attractors
                </span>
              </div>
              <Separator
                className="h-4 bg-border/20 dark:bg-white/10"
                orientation="vertical"
              />
            </div>
            <div className="flex items-center gap-2">
              <SystemSelector
                onChange={onSystemChange}
                selectedId={selectedId}
                systems={systems}
              />
              <Button
                className="rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseMobile?.();
                }}
                size="icon"
                variant="ghost"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {/* ── Scrollable body ─────────────────────── */}
          <ScrollArea className="min-h-0 flex-1">
            <div className="p-5 gap-y-5">
              {/* Parameters */}
              <Section label="Parameters">
                <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 lg:grid-cols-3 gap-x-4">
                  {system.params.defaults.map((defaultVal, i) => (
                    <ParamCell
                      accent={
                        Object.values(ACCENTS)[i % Object.keys(ACCENTS).length]
                      }
                      description={paramDescriptions[system.params.names[i]]}
                      key={system.params.names[i]}
                      max={system.params.max[i] ?? defaultVal * 5}
                      min={system.params.min[i] ?? defaultVal * 0.1}
                      name={system.params.names[i]}
                      onChange={(v) => onParamChange(i, v)}
                      step={system.params.steps?.[i]}
                      value={params[i] ?? defaultVal}
                    />
                  ))}
                </div>
              </Section>

              <Separator className="bg-border/20 dark:bg-white/5" />

              {/* Display — color speed + point size */}
              <Section label="Display">
                <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 gap-x-4">
                  <ParamCell
                    accent={ACCENTS.rose}
                    description="Rate of color cycling across the trail"
                    key="colorSpeed"
                    max={10}
                    min={0.1}
                    name="Color speed"
                    onChange={onColorSpeedChange}
                    value={colorSpeed}
                  />
                  <ParamCell
                    accent={ACCENTS.cyan}
                    description="Size of each rendered point"
                    key="pointSize"
                    max={8}
                    min={0.5}
                    name="Point size"
                    onChange={onPointSizeChange}
                    value={pointSize}
                  />
                </div>
              </Section>

              {/* Speed + Density side by side */}
              <Section label="Speed & Density">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <ParamCell
                    accent={ACCENTS.amber}
                    description="Multiplier for the number of points drawn each frame"
                    max={5}
                    min={0.1}
                    name="Speed"
                    onChange={onSpeedChange}
                    step={0.1}
                    value={speed}
                  />
                  <ParamCell
                    accent={ACCENTS.violet}
                    description="Integration steps drawn per frame"
                    max={1000}
                    min={1}
                    name="Steps / frame"
                    onChange={onStepsChange}
                    value={stepsPerFrame}
                  />
                </div>
              </Section>

              {/* Options */}
              <Section label="Options">
                <div className="grid grid-cols-3 gap-x-4">
                  {/* Auto-rotate */}
                  <div
                    className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl bg-muted/50 dark:bg-white/5 p-3 text-center"
                    onClick={() => onAutoRotateChange(!autoRotate)}
                  >
                    <span className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                      Auto-rotate
                    </span>
                    <span className="text-[11px] text-muted-foreground dark:text-white/30">
                      Slowly orbit
                    </span>
                    <Switch
                      checked={autoRotate}
                      id="auto-rotate"
                      onCheckedChange={(v) => {
                        onAutoRotateChange(v);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Background color */}
                  {onBackgroundColorChange && (
                    <div className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/50 p-3 dark:bg-white/3 text-center">
                      <span className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                        Background
                      </span>
                      <ColorPicker
                        onChange={onBackgroundColorChange}
                        value={backgroundColor || "#000000"}
                      />
                      <span className="text-[11px] font-mono text-muted-foreground dark:text-white/40 truncate">
                        {backgroundColor || "#000000"}
                      </span>
                    </div>
                  )}

                  {/* Auto-loop */}
                  <div className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/50 p-3 dark:bg-white/3 text-center">
                    <span className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                      Auto-loop
                    </span>
                    <span className="text-[11px] text-muted-foreground dark:text-white/30">
                      Restart
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="flex size-7 items-center justify-center rounded-lg border border-border/20 bg-muted/40 text-sm font-medium text-foreground/70 transition hover:bg-muted dark:border-white/8 dark:bg-white/4 dark:text-white/60"
                        onClick={() => {
                          const val = Math.max(
                            1,
                            Math.round(resetAfter / 60000) - 1,
                          );
                          onResetAfterChange?.(val * 60000);
                        }}
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-mono tabular-nums text-foreground/80 dark:text-white/80">
                        {Math.round(resetAfter / 60000)}
                      </span>
                      <button
                        className="flex size-7 items-center justify-center rounded-lg border border-border/20 bg-muted/40 text-sm font-medium text-foreground/70 transition hover:bg-muted dark:border-white/8 dark:bg-white/4 dark:text-white/60"
                        onClick={() => {
                          const val = Math.min(
                            120,
                            Math.round(resetAfter / 60000) + 1,
                          );
                          onResetAfterChange?.(val * 60000);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Buttons */}
              <div className="sm:flex-row flex flex-col gap-2 pt-1">
                <Button
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/8 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white/90"
                  onClick={onShare}
                  variant="ghost"
                >
                  <svg
                    className="-ml-0.5 mr-1.5 size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" x2="12" y1="2" y2="15" />
                  </svg>
                  Share
                </Button>
                <Button
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/8 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white/90"
                  onClick={onWallpaperDownload}
                  variant="ghost"
                >
                  <svg
                    className="-ml-0.5 mr-1.5 size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Wallpaper
                </Button>
                <Button
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/8 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white/90"
                  onClick={onReset}
                  variant="ghost"
                >
                  <svg
                    className="-ml-0.5 mr-1.5 size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                  Reset
                </Button>
              </div>
            </div>
          </ScrollArea>
        </Panel>
      </div>

      {/* ── Desktop panel (md+) ─────────────────────── */}
      <div className="hidden md:block fixed top-5 left-5 z-10 w-md lg:w-[28.6rem] pointer-events-auto animate-panel-entrance">
        <Panel className="flex h-auto max-h-[calc(100vh-40px)] flex-col">
          {/* ── Header ──────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-border/20 dark:border-white/6 px-6 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base">✦</span>
                <span className="text-[13px] font-semibold tracking-wide text-foreground/90 dark:text-white/90">
                  Strange Attractors
                </span>
              </div>
              <Separator
                className="h-4 bg-border/20 dark:bg-white/10"
                orientation="vertical"
              />
            </div>
            <SystemSelector
              onChange={onSystemChange}
              selectedId={selectedId}
              systems={systems}
            />
          </div>

          {/* ── Scrollable body ─────────────────────── */}
          <ScrollArea className="min-h-0 flex-1">
            <div className="p-6 gap-y-5">
              {/* Parameters */}
              <Section label="Parameters">
                <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                  {system.params.defaults.map((defaultVal, i) => (
                    <ParamCell
                      accent={
                        Object.values(ACCENTS)[i % Object.keys(ACCENTS).length]
                      }
                      description={paramDescriptions[system.params.names[i]]}
                      key={system.params.names[i]}
                      max={system.params.max[i] ?? defaultVal * 5}
                      min={system.params.min[i] ?? defaultVal * 0.1}
                      name={system.params.names[i]}
                      onChange={(v) => onParamChange(i, v)}
                      step={system.params.steps?.[i]}
                      value={params[i] ?? defaultVal}
                    />
                  ))}
                </div>
              </Section>

              <Separator className="bg-border/20 dark:bg-white/5" />

              {/* Display — color speed + point size */}
              <Section label="Display">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <ParamCell
                    accent={ACCENTS.rose}
                    description="Rate of color cycling across the trail"
                    key="colorSpeed"
                    max={10}
                    min={0.1}
                    name="Color speed"
                    onChange={onColorSpeedChange}
                    value={colorSpeed}
                  />
                  <ParamCell
                    accent={ACCENTS.cyan}
                    description="Size of each rendered point"
                    key="pointSize"
                    max={8}
                    min={0.5}
                    name="Point size"
                    onChange={onPointSizeChange}
                    value={pointSize}
                  />
                </div>
              </Section>

              {/* Speed + Density side by side */}
              <Section label="Speed & Density">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <ParamCell
                    accent={ACCENTS.amber}
                    description="Multiplier for the number of points drawn each frame"
                    max={5}
                    min={0.1}
                    name="Speed"
                    onChange={onSpeedChange}
                    step={0.1}
                    value={speed}
                  />
                  <ParamCell
                    accent={ACCENTS.violet}
                    description="Integration steps drawn per frame"
                    max={1000}
                    min={1}
                    name="Steps / frame"
                    onChange={onStepsChange}
                    value={stepsPerFrame}
                  />
                </div>
              </Section>

              {/* Options */}
              <Section label="Options">
                <div className="grid grid-cols-3 gap-x-4">
                  {/* Auto-rotate */}
                  <div
                    className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl bg-muted/50 dark:bg-white/5 p-3 text-center"
                    onClick={() => onAutoRotateChange(!autoRotate)}
                  >
                    <span className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                      Auto-rotate
                    </span>
                    <span className="text-[11px] text-muted-foreground dark:text-white/30">
                      Slowly orbit
                    </span>
                    <Switch
                      checked={autoRotate}
                      id="auto-rotate"
                      onCheckedChange={(v) => {
                        onAutoRotateChange(v);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Background color */}
                  {onBackgroundColorChange && (
                    <div className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/50 p-3 dark:bg-white/3 text-center">
                      <span className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                        Background
                      </span>
                      <ColorPicker
                        onChange={onBackgroundColorChange}
                        value={backgroundColor || "#000000"}
                      />
                      <span className="text-[11px] font-mono text-muted-foreground dark:text-white/40 truncate">
                        {backgroundColor || "#000000"}
                      </span>
                    </div>
                  )}

                  {/* Auto-loop */}
                  <div className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/50 p-3 dark:bg-white/3 text-center">
                    <span className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                      Auto-loop
                    </span>
                    <span className="text-[11px] text-muted-foreground dark:text-white/30">
                      Restart
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="flex size-7 items-center justify-center rounded-lg border border-border/20 bg-muted/40 text-sm font-medium text-foreground/70 transition hover:bg-muted dark:border-white/8 dark:bg-white/4 dark:text-white/60"
                        onClick={() => {
                          const val = Math.max(
                            1,
                            Math.round(resetAfter / 60000) - 1,
                          );
                          onResetAfterChange?.(val * 60000);
                        }}
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-mono tabular-nums text-foreground/80 dark:text-white/80">
                        {Math.round(resetAfter / 60000)}
                      </span>
                      <button
                        className="flex size-7 items-center justify-center rounded-lg border border-border/20 bg-muted/40 text-sm font-medium text-foreground/70 transition hover:bg-muted dark:border-white/8 dark:bg-white/4 dark:text-white/60"
                        onClick={() => {
                          const val = Math.min(
                            120,
                            Math.round(resetAfter / 60000) + 1,
                          );
                          onResetAfterChange?.(val * 60000);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/8 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white/90"
                  onClick={onShare}
                  variant="ghost"
                >
                  <svg
                    className="-ml-0.5 mr-1.5 size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" x2="12" y1="2" y2="15" />
                  </svg>
                  Share
                </Button>
                <Button
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/8 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white/90"
                  onClick={onWallpaperDownload}
                  variant="ghost"
                >
                  <svg
                    className="-ml-0.5 mr-1.5 size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Wallpaper
                </Button>
                <Button
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/8 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white/90"
                  onClick={onReset}
                  variant="ghost"
                >
                  <svg
                    className="-ml-0.5 mr-1.5 size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                  Reset
                </Button>
              </div>
            </div>
          </ScrollArea>
        </Panel>
      </div>
    </>
  );
}
