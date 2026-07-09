import type { AttractorSystem } from "../systems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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

function ParamRow({
  name,
  value,
  min,
  max,
  onChange,
}: {
  name: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{name}</Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatNum(value, min, max)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={(max - min) / 200}
        value={[value]}
        onValueChange={(vals) => onChange(Array.isArray(vals) ? vals[0] : vals)}
        className="w-full"
      />
    </div>
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
    <div className="fixed top-4 left-4 z-10 w-[300px] pointer-events-auto">
      <Card className="border-border/10 bg-background/85 backdrop-blur-md shadow-lg">
        <CardHeader className="px-6 py-5 pb-3">
          <CardTitle className="text-sm font-semibold tracking-wide">
            Strange Attractors
          </CardTitle>
        </CardHeader>

        <ScrollArea className="max-h-[calc(100vh-130px)] px-2">
          <CardContent className="px-6">
            {/* Attractor selector */}
            <div className="space-y-2 mb-3">
              <Label className="text-xs text-muted-foreground">System</Label>
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

            {/* Parameters */}
            {system.params.defaults.map((defaultVal, i) => (
              <div key={system.params.names[i]} className="mb-3">
                <ParamRow
                  name={system.params.names[i]}
                  value={params[i] ?? defaultVal}
                  min={system.params.min[i] ?? defaultVal * 0.1}
                  max={system.params.max[i] ?? defaultVal * 5}
                  onChange={(v) => onParamChange(i, v)}
                />
              </div>
            ))}

            {/* Display section */}
            <Separator className="my-4" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Display
            </h3>

            <div className="mb-3">
              <ParamRow
                name="Color speed"
                value={colorSpeed}
                min={0.1}
                max={10}
                onChange={onColorSpeedChange}
              />
            </div>

            <div className="mb-3">
              <ParamRow
                name="Point size"
                value={pointSize}
                min={0.5}
                max={8}
                onChange={onPointSizeChange}
              />
            </div>

            <div className="space-y-3 mb-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Steps per frame
                </Label>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {stepsPerFrame}
                </span>
              </div>
              <Slider
                min={1}
                max={1000}
                step={1}
                value={[stepsPerFrame]}
                onValueChange={(vals) => onStepsChange(Array.isArray(vals) ? vals[0] : vals)}
                className="w-full"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3 mt-4">
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
            <div className="mt-5 flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={onShare}
                className="w-full py-2"
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
                className="w-full py-2"
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
