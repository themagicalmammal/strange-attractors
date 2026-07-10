import type { AttractorSystem } from "../systems";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import StyledSlider from "./StyledSlider";

interface AttractorPanelProps {
  autoRotate: boolean;
  colorSpeed: number;
  onAutoRotateChange: (value: boolean) => void;
  onColorSpeedChange: (value: number) => void;
  onParamChange: (index: number, value: number) => void;
  onPointSizeChange: (value: number) => void;
  onReset: () => void;
  onShare: () => void;
  onSpeedChange: (value: number) => void;
  onStepsChange: (value: number) => void;
  onSystemChange: (id: string) => void;
  params: number[];
  pointSize: number;
  selectedId: string;
  speed: number;
  stepsPerFrame: number;
  system: AttractorSystem;
  systems: AttractorSystem[];
}

function formatParam(v: number): string {
  if (Math.abs(v) >= 100) return Math.round(v).toString();
  if (Math.abs(v) >= 1) return v.toFixed(2);
  return v.toFixed(4);
}

const sliderColors = [
  "oklch(0.55 0.20 264.376)", // deep blue
  "oklch(0.60 0.18 162.48)", // emerald green
  "oklch(0.65 0.20 35.5)", // warm amber
];

function ParamCell({
  colorIndex,
  description,
  max,
  min,
  name,
  onChange,
  step,
  value,
}: {
  name: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  colorIndex: number;
  description?: string;
  step?: number;
}) {
  const color = sliderColors[colorIndex % sliderColors.length];
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <svg
                  className="size-3.5 text-muted-foreground/60 cursor-help shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-2M12 8h.01" />
                </svg>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="top" sideOffset={6}>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <StyledSlider
        color={color}
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

export function AttractorPanel({
  autoRotate,
  colorSpeed,
  onAutoRotateChange,
  onColorSpeedChange,
  onParamChange,
  onPointSizeChange,
  onReset,
  onShare,
  onSpeedChange,
  onStepsChange,
  onSystemChange,
  params,
  pointSize,
  selectedId,
  speed,
  stepsPerFrame,
  system,
  systems,
}: AttractorPanelProps) {
  // Separate attractor params from display settings
  const displayParams = [
    {
      max: 10,
      min: 0.1,
      name: "Color speed",
      onChange: onColorSpeedChange,
      value: colorSpeed,
    },
    {
      max: 8,
      min: 0.5,
      name: "Point size",
      onChange: onPointSizeChange,
      value: pointSize,
    },
    {
      description: "Multiplier for the number of points drawn each frame",
      max: 5,
      min: 0.1,
      name: "Animation speed",
      onChange: onSpeedChange,
      step: 0.1,
      value: speed,
    },
  ];

  return (
    <div className="fixed top-5 left-5 z-10 w-110 pointer-events-auto animate-panel-entrance">
      <Card className="border-border/40 bg-background/90 backdrop-blur-xl shadow-xl rounded-2xl">
        <CardHeader className="px-8 py-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Strange Attractors
            </CardTitle>
            <Badge
              className="text-sm font-medium rounded-full px-4 py-1.5"
              variant="outline"
            >
              {system.name}
            </Badge>
          </div>
        </CardHeader>

        <ScrollArea className="max-h-[calc(100vh-120px)]">
          <CardContent className="px-8">
            {/* System selector */}
            <div className="mb-10">
              <Label className="text-base text-muted-foreground mb-3 block font-medium">
                System
              </Label>
              <Select
                onValueChange={(v: null | string) =>
                  onSystemChange(v ?? selectedId)
                }
                value={selectedId}
              >
                <SelectTrigger className="w-full h-11 bg-muted/20 border-border/40 rounded-xl text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((s) => (
                    <SelectItem className="text-base" key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Attractor parameter grid — 3 columns */}
            <div className="mb-10">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                Parameters
              </h3>
              <div className="grid grid-cols-3 gap-x-8 gap-y-8">
                {system.params.defaults.map((defaultVal, i) => (
                  <ParamCell
                    colorIndex={i % 3}
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
            </div>

            {/* Display section */}
            <Separator className="my-8" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
              Display
            </h3>

            {/* Display grid — 3 columns */}
            <div className="grid grid-cols-3 gap-x-8 gap-y-8 mb-8">
              {displayParams.map((dp) => (
                <ParamCell
                  colorIndex={(displayParams.indexOf(dp) + 3) % 3}
                  key={dp.name}
                  max={dp.max}
                  min={dp.min}
                  name={dp.name}
                  onChange={dp.onChange}
                  value={dp.value}
                />
              ))}
              {/* Fill remaining slots for consistent grid alignment */}
              {Array.from({
                length: Math.max(0, 3 - displayParams.length),
              }).map((_, i) => (
                <div className="col-span-1" key={`fill-${i}`} />
              ))}
            </div>

            {/* Steps per frame — full width */}
            <div className="mb-8">
              <ParamCell
                colorIndex={0}
                description="Number of integration steps drawn per animation frame"
                max={1000}
                min={1}
                name="Steps per frame"
                onChange={onStepsChange}
                value={stepsPerFrame}
              />
            </div>

            {/* Auto-rotate toggle */}
            <div className="flex items-center justify-between px-1 mb-8">
              <div className="flex items-center gap-3">
                <Switch
                  checked={autoRotate}
                  id="auto-rotate"
                  onCheckedChange={onAutoRotateChange}
                />
                <div>
                  <Label
                    className="text-base font-medium text-foreground cursor-pointer"
                    htmlFor="auto-rotate"
                  >
                    Auto-rotate
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Slowly rotate the view
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 rounded-xl text-base font-medium"
                onClick={onShare}
                variant="outline"
              >
                <svg
                  className="size-4 mr-2"
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
                className="flex-1 h-12 rounded-xl text-base font-medium"
                onClick={onReset}
                variant="outline"
              >
                <svg
                  className="size-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Reset
              </Button>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
