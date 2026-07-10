import type { AttractorSystem } from "../systems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StyledSlider from "./StyledSlider";

interface AttractorPanelProps {
  system: AttractorSystem;
  selectedId: string;
  systems: AttractorSystem[];
  params: number[];
  stepsPerFrame: number;
  colorSpeed: number;
  pointSize: number;
  speed: number;
  autoRotate: boolean;
  onSystemChange: (id: string) => void;
  onParamChange: (index: number, value: number) => void;
  onStepsChange: (value: number) => void;
  onColorSpeedChange: (value: number) => void;
  onPointSizeChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onAutoRotateChange: (value: boolean) => void;
  onReset: () => void;
  onShare: () => void;
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
  name,
  value,
  min,
  max,
  onChange,
  colorIndex,
  description,
  step,
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
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-2M12 8h.01" />
                </svg>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="max-w-xs">
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <StyledSlider
        min={min}
        max={max}
        step={step ?? (max - min) / 200}
        value={value}
        onChange={onChange}
        label=""
        color={color}
        format={formatParam}
      />
    </div>
  );
}

const paramDescriptions: Record<string, string> = {
  "σ (sigma)": "Controls the horizontal spreading of the attractor",
  "ρ (rho)": "Represents the rate of convection",
  "β (beta)": "Relates to the vertical dimension compression",
  a: "Parameter a — system coefficient",
  b: "Parameter b — system coefficient",
  c: "Parameter c — system coefficient",
  d: "Parameter d — system coefficient",
  e: "Parameter e — system coefficient",
  k: "Parameter k — system coefficient",
  s: "Parameter s — system coefficient",
  v: "Parameter v — system coefficient",
  t: "Parameter t — system coefficient",
  r: "Parameter r — system coefficient",
  "α (alpha)": "Parameter alpha — system coefficient",
  λ: "Parameter lambda — system coefficient",
  ω: "Parameter omega — system coefficient",
  ε: "Parameter epsilon — system coefficient",
  f: "Parameter f — system coefficient",
  g: "Parameter g — system coefficient",
  h: "Parameter h — system coefficient",
  B: "Parameter B — system coefficient",
  μ: "Parameter mu — system coefficient",
  p: "Parameter p — system coefficient",
  q: "Parameter q — system coefficient",
};

export function AttractorPanel({
  system,
  selectedId,
  systems,
  params,
  stepsPerFrame,
  colorSpeed,
  pointSize,
  speed,
  autoRotate,
  onSystemChange,
  onParamChange,
  onStepsChange,
  onColorSpeedChange,
  onPointSizeChange,
  onSpeedChange,
  onAutoRotateChange,
  onReset,
  onShare,
}: AttractorPanelProps) {
  // Separate attractor params from display settings
  const displayParams = [
    {
      name: "Color speed",
      value: colorSpeed,
      min: 0.1,
      max: 10,
      onChange: onColorSpeedChange,
    },
    {
      name: "Point size",
      value: pointSize,
      min: 0.5,
      max: 8,
      onChange: onPointSizeChange,
    },
    {
      name: "Animation speed",
      value: speed,
      min: 0.1,
      max: 5,
      step: 0.1,
      onChange: onSpeedChange,
      description: "Multiplier for the number of points drawn each frame",
    },
  ];

  return (
    <div className="fixed top-5 left-5 z-10 w-[440px] pointer-events-auto animate-panel-entrance">
      <Card className="border-border/40 bg-background/90 backdrop-blur-xl shadow-xl rounded-2xl">
        <CardHeader className="px-8 py-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Strange Attractors
            </CardTitle>
            <Badge
              variant="outline"
              className="text-sm font-medium rounded-full px-4 py-1.5"
            >
              {system.name}
            </Badge>
          </div>
        </CardHeader>

        <ScrollArea className="max-h-[calc(100vh-120px)] px-3">
          <CardContent className="px-8">
            {/* System selector */}
            <div className="mb-10">
              <Label className="text-base text-muted-foreground mb-3 block font-medium">
                System
              </Label>
              <Select
                value={selectedId}
                onValueChange={(v: string | null) =>
                  onSystemChange(v ?? selectedId)
                }
              >
                <SelectTrigger className="w-full h-11 bg-muted/20 border-border/40 rounded-xl text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-base">
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
                    key={system.params.names[i]}
                    name={system.params.names[i]}
                    value={params[i] ?? defaultVal}
                    min={system.params.min[i] ?? defaultVal * 0.1}
                    max={system.params.max[i] ?? defaultVal * 5}
                    onChange={(v) => onParamChange(i, v)}
                    colorIndex={i % 3}
                    description={paramDescriptions[system.params.names[i]]}
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
                  key={dp.name}
                  name={dp.name}
                  value={dp.value}
                  min={dp.min}
                  max={dp.max}
                  onChange={dp.onChange}
                  colorIndex={(displayParams.indexOf(dp) + 3) % 3}
                />
              ))}
              {/* Fill remaining slots for consistent grid alignment */}
              {Array.from({
                length: Math.max(0, 3 - displayParams.length),
              }).map((_, i) => (
                <div key={`fill-${i}`} className="col-span-1" />
              ))}
            </div>

            {/* Steps per frame — full width */}
            <div className="mb-8">
              <ParamCell
                name="Steps per frame"
                value={stepsPerFrame}
                min={1}
                max={1000}
                onChange={onStepsChange}
                colorIndex={0}
                description="Number of integration steps drawn per animation frame"
              />
            </div>

            {/* Auto-rotate toggle */}
            <div className="flex items-center justify-between px-1 mb-8">
              <div className="flex items-center gap-3">
                <Switch
                  checked={autoRotate}
                  onCheckedChange={onAutoRotateChange}
                  id="auto-rotate"
                />
                <div>
                  <Label
                    htmlFor="auto-rotate"
                    className="text-base font-medium text-foreground cursor-pointer"
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
                variant="outline"
                onClick={onShare}
                className="flex-1 h-12 rounded-xl text-base font-medium"
              >
                <svg
                  className="size-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                Share
              </Button>
              <Button
                variant="outline"
                onClick={onReset}
                className="flex-1 h-12 rounded-xl text-base font-medium"
              >
                <svg
                  className="size-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
