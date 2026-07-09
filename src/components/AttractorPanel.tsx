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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-[12px] text-muted-foreground">{name}</Label>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {formatNum(value, min, max)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={(max - min) / 200}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
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
}: AttractorPanelProps) {
  return (
    <div className="fixed top-4 left-4 z-10 w-[280px] pointer-events-auto">
      <Card className="border-border/10 bg-background/85 backdrop-blur-md shadow-lg">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-semibold tracking-wide">
            Strange Attractors
          </CardTitle>
        </CardHeader>

        <ScrollArea className="max-h-[calc(100vh-130px)] px-5">
          <CardContent className="p-0">
            {/* Attractor selector */}
            <div className="space-y-1.5 mb-2">
              <Label className="text-[12px] text-muted-foreground">System</Label>
              <Select value={selectedId} onValueChange={onSystemChange}>
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
              <div key={system.params.names[i]} className="mb-2">
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
            <Separator className="my-3" />
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Display
            </h3>

            <div className="mb-2">
              <ParamRow
                name="Color speed"
                value={colorSpeed}
                min={0.1}
                max={10}
                onChange={onColorSpeedChange}
              />
            </div>

            <div className="mb-2">
              <ParamRow
                name="Point size"
                value={pointSize}
                min={0.5}
                max={8}
                onChange={onPointSizeChange}
              />
            </div>

            <div className="space-y-2 mb-2">
              <div className="flex items-center justify-between">
                <Label className="text-[12px] text-muted-foreground">
                  Steps per frame
                </Label>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {stepsPerFrame}
                </span>
              </div>
              <Slider
                min={1}
                max={1000}
                step={1}
                value={[stepsPerFrame]}
                onValueChange={([v]) => onStepsChange(v)}
                className="w-full"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-2 mt-3">
              <Switch
                checked={autoRotate}
                onCheckedChange={onAutoRotateChange}
                id="auto-rotate"
              />
              <Label
                htmlFor="auto-rotate"
                className="text-[12px] text-muted-foreground cursor-pointer"
              >
                Auto-rotate
              </Label>
            </div>

            {/* Reset button */}
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full mt-3"
            >
              Reset
            </Button>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
