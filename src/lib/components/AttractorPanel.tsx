import type { AttractorSystem } from "../systems";

import { Button } from "@/lib/components/ui/button";
import { ScrollArea } from "@/lib/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { Separator } from "@/lib/components/ui/separator";
import { Switch } from "@/lib/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/ui/tooltip";

import StyledSlider from "./StyledSlider";

// ─── Types ──────────────────────────────────────────────────

interface AttractorPanelProps {
  autoRotate: boolean;
  backgroundColor?: string;
  colorSpeed: number;
  mobileOpen?: boolean;
  onAutoRotateChange: (value: boolean) => void;
  onCloseMobile?: () => void;
  onBackgroundColorChange?: (value: string) => void;
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
  selectedId: string;
  speed: number;
  stepsPerFrame: number;
  resetAfter: number;
  system: AttractorSystem;
  systems: AttractorSystem[];
}

// ─── Helpers ────────────────────────────────────────────────

function formatParam(v: number): string {
  if (Math.abs(v) >= 100) return Math.round(v).toString();
  if (Math.abs(v) >= 1) return v.toFixed(2);
  return v.toFixed(4);
}

function formatTime(ms: number): string {
  const mins = Math.round(ms / 60000);
  if (mins >= 60) {
    const hours = mins / 60;
    return `${hours.toFixed(1)}h`;
  }
  return `${mins}m`;
}

// ─── Panel shell ────────────────────────────────────────────

function Panel({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`overflow-hidden rounded-[20px] border border-border/20 bg-background/80 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-[0_32px_80px_rgba(0,0,0,0.4)] ${
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
    <div className="space-y-3">
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
        <span className="rounded bg-muted dark:bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono tabular-nums text-muted-foreground dark:text-white/50 transition-colors group-hover/cell:text-foreground dark:group-hover/cell:text-white/70">
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
  onCloseMobile,
  onBackgroundColorChange,
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
  selectedId,
  speed,
  stepsPerFrame,
  resetAfter,
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
          <div className="flex items-center justify-between border-b border-border/20 dark:border-white/[0.06] px-5 py-3">
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
              <Select
                onValueChange={(v: null | string) =>
                  onSystemChange(v ?? selectedId)
                }
                value={selectedId}
              >
                <SelectTrigger>
                  <SelectValue className="text-sm" placeholder={system.name} />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((s) => (
                    <SelectItem className="text-sm" key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
              className="rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth active:scale-95"
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onCloseMobile?.();
              }}
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
            <div className="p-5 space-y-5">
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
                      value={params[i] ?? defaultVal}
                    />
                  ))}
                </div>
              </Section>

              <Separator className="bg-border/20 dark:bg-white/[0.05]" />

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
                <div className="space-y-5">
                  {/* Auto-rotate */}
                  <div
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-muted/50 dark:bg-white/[0.05]"
                    onClick={() => onAutoRotateChange(!autoRotate)}
                  >
                    <div>
                      <div className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                        Auto-rotate
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/30">
                        Slowly orbit the view
                      </div>
                    </div>
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
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="size-8 cursor-pointer rounded-lg border-0 bg-transparent p-0 [appearance:none_moz_appearance:none] [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-lg"
                        value={backgroundColor || "#000000"}
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          onBackgroundColorChange(target.value);
                        }}
                      />
                      <span className="text-[11px] font-mono text-muted-foreground dark:text-white/40">
                        {backgroundColor || "#000000"}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50">
                        Click to pick
                      </span>
                    </div>
                  )}

                  {/* Auto-loop */}
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <svg className="size-4 text-foreground/50 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                      </svg>
                      <div>
                        <div className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                          Auto-loop
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/30">
                          Restart after {formatTime(resetAfter)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        className="w-16 rounded-lg border border-border/20 bg-transparent py-1 text-right text-sm text-foreground/80 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/20 dark:border-white/[0.08] dark:text-white/80"
                        value={resetAfter / 60000}
                        onInput={(e) => {
                          const val = parseInt((e.target as HTMLInputElement).value);
                          if (!isNaN(val) && val >= 1 && val <= 120) {
                            onResetAfterChange?.(val * 60000);
                          }
                        }}
                      />
                      <span className="text-[11px] text-muted-foreground">min</span>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Buttons */}
              <div className="sm:flex-row flex flex-col gap-2 pt-1">
                <Button
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.1] dark:hover:text-white/90"
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
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.1] dark:hover:text-white/90"
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
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.1] dark:hover:text-white/90"
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
      <div className="hidden md:block fixed top-5 left-5 z-10 w-[28rem] lg:w-[28.6rem] pointer-events-auto animate-panel-entrance">
        <Panel className="flex h-auto max-h-[calc(100vh-40px)] flex-col">
          {/* ── Header ──────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-border/20 dark:border-white/[0.06] px-6 py-3.5">
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
            <Select
              onValueChange={(v: null | string) =>
                onSystemChange(v ?? selectedId)
              }
              value={selectedId}
            >
              <SelectTrigger>
                <SelectValue className="text-sm" placeholder={system.name} />
              </SelectTrigger>
              <SelectContent>
                {systems.map((s) => (
                  <SelectItem className="text-sm" key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Scrollable body ─────────────────────── */}
          <ScrollArea className="min-h-0 flex-1">
            <div className="p-6 space-y-5">

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
                      value={params[i] ?? defaultVal}
                    />
                  ))}
                </div>
              </Section>

              <Separator className="bg-border/20 dark:bg-white/[0.05]" />

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
                <div className="space-y-5">
                  {/* Auto-rotate */}
                  <div
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-muted/50 dark:bg-white/[0.05]"
                    onClick={() => onAutoRotateChange(!autoRotate)}
                  >
                    <div>
                      <div className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                        Auto-rotate
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/30">
                        Slowly orbit the view
                      </div>
                    </div>
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
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="size-8 cursor-pointer rounded-lg border-0 bg-transparent p-0 [appearance:none_moz_appearance:none] [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-lg"
                        value={backgroundColor || "#000000"}
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          onBackgroundColorChange(target.value);
                        }}
                      />
                      <span className="text-[11px] font-mono text-muted-foreground dark:text-white/40">
                        {backgroundColor || "#000000"}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50">
                        Click to pick
                      </span>
                    </div>
                  )}

                  {/* Auto-loop */}
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <svg className="size-4 text-foreground/50 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                      </svg>
                      <div>
                        <div className="text-[13px] font-medium text-foreground/80 dark:text-white/80">
                          Auto-loop
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/30">
                          Restart after {formatTime(resetAfter)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        className="w-16 rounded-lg border border-border/20 bg-transparent py-1 text-right text-sm text-foreground/80 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/20 dark:border-white/[0.08] dark:text-white/80"
                        value={resetAfter / 60000}
                        onInput={(e) => {
                          const val = parseInt((e.target as HTMLInputElement).value);
                          if (!isNaN(val) && val >= 1 && val <= 120) {
                            onResetAfterChange?.(val * 60000);
                          }
                        }}
                      />
                      <span className="text-[11px] text-muted-foreground">min</span>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.1] dark:hover:text-white/90"
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
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.1] dark:hover:text-white/90"
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
                  className="flex-1 rounded-xl border-border/20 bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.1] dark:hover:text-white/90"
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
