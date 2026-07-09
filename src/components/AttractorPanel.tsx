import type { AttractorSystem } from "../systems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import StyledSlider from "./StyledSlider";

interface AttractorPanelProps {
  system: AttractorSystem;
  selectedId: string;
  systems: AttractorSystem[];
  params: number[];
  stepsPerFrame: number;
  colorSpeed: number;
  pointSize: number;
  autoRotate: boolean;
  onSystemChange: (id: string) => void;
  onParamChange: (index: number, value: number) => void;
  onStepsChange: (value: number) => void;
  onColorSpeedChange: (value: number) => void;
  onPointSizeChange: (value: number) => void;
  onAutoRotateChange: (value: boolean) => void;
  onReset: () => void;
  onShare: () => void;
}

function formatNum(v: number, min: number, max: number): string {
  const range = max - min;
  if (range < 0.01) return v.toFixed(4);
  if (range < 1) return v.toFixed(4);
  if (range < 100) return v.toFixed(2);
  return v.toFixed(1);
}

const sliderColors = [
  "oklch(0.65 0.22 264.376)", // blue
  "oklch(0.68 0.20 162.48)",  // green
  "oklch(0.70 0.18 35.5)",     // orange
  "oklch(0.65 0.22 295.5)",    // purple
  "oklch(0.68 0.21 55.0)",     // pink
];

function ParamCol({
  name,
  value,
  min,
  max,
  onChange,
  colorIndex = 0,
}: {
  name: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  colorIndex?: number;
}) {
  const color = sliderColors[colorIndex % sliderColors.length];
  return (
    <StyledSlider
      min={min}
      max={max}
      step={(max - min) / 200}
      value={value}
      onChange={onChange}
      label={name}
      color={color}
      format={(v) => formatNum(v, min, max)}
    />
  );
}

export function AttractorPanel({
  system,
  selectedId,
  systems,
  params,
  stepsPerFrame,
  colorSpeed,
  pointSize,
  autoRotate,
  onSystemChange,
  onParamChange,
  onStepsChange,
  onColorSpeedChange,
  onPointSizeChange,
  onAutoRotateChange,
  onReset,
  onShare,
}: AttractorPanelProps) {
  return (
    <div className="fixed top-4 left-4 z-10 w-[380px] pointer-events-auto">
      <Card className="border-border/10 bg-background/85 backdrop-blur-md shadow-lg">
        <CardHeader className="px-8 py-5 pb-3">
          <CardTitle className="text-sm font-semibold tracking-wide">
            Strange Attractors
          </CardTitle>
        </CardHeader>

        <ScrollArea className="max-h-[calc(100vh-130px)] px-3">
          <CardContent className="px-8">
            {/* Attractor selector */}
            <div className="mb-5">
              <Label className="text-xs text-muted-foreground mb-2 block">System</Label>
              <Select value={selectedId} onValueChange={(v: string | null) => onSystemChange(v ?? selectedId)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Parameter grid — 2 columns */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {system.params.defaults.map((defaultVal, i) => (
                <ParamCol
                  key={system.params.names[i]}
                  name={system.params.names[i]}
                  value={params[i] ?? defaultVal}
                  min={system.params.min[i] ?? defaultVal * 0.1}
                  max={system.params.max[i] ?? defaultVal * 5}
                  onChange={(v) => onParamChange(i, v)}
                  colorIndex={i}
                />
              ))}
            </div>

            {/* Display section */}
            <Separator className="my-5" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Display
            </h3>

            {/* Display grid — 2 columns */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <ParamCol
                name="Color speed"
                value={colorSpeed}
                min={0.1}
                max={10}
                onChange={onColorSpeedChange}
                colorIndex={3}
              />
              <ParamCol
                name="Point size"
                value={pointSize}
                min={0.5}
                max={8}
                onChange={onPointSizeChange}
                colorIndex={4}
              />
            </div>

            {/* Steps per frame — full width */}
            <div className="mt-5">
              <ParamCol
                name="Steps per frame"
                value={stepsPerFrame}
                min={1}
                max={1000}
                onChange={onStepsChange}
                colorIndex={0}
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3 mt-6">
              <Switch
                checked={autoRotate}
                onCheckedChange={onAutoRotateChange}
                id="auto-rotate"
              />
              <Label
                htmlFor="auto-rotate"
                className="text-xs text-muted-foreground cursor-pointer"
              >
                Auto-rotate
              </Label>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={onShare}
                className="flex-1 py-2.5"
              >
                <svg className="size-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                Share
              </Button>
              <Button
                variant="outline"
                onClick={onReset}
                className="flex-1 py-2.5"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
