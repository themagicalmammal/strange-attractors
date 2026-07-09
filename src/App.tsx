import { useState, useCallback, useEffect } from "react";
import { getSystem, systems } from "./systems";
import { AttractorCanvas } from "./components/AttractorCanvas";
import { AttractorPanel } from "./components/AttractorPanel";
import { ThemeToggle } from "./components/providers/ThemeToggle";

export default function App() {
  const [selectedId, setSelectedId] = useState("lorenz");
  const [params, setParams] = useState<number[]>([
    ...getSystem("lorenz")!.params.defaults,
  ]);
  const [stepsPerFrame, setStepsPerFrame] = useState(50);
  const [colorSpeed, setColorSpeed] = useState(1);
  const [pointSize, setPointSize] = useState(1.5);
  const [autoRotate, setAutoRotate] = useState(true);

  // Reset trigger — incrementing resets the canvas
  const [resetKey, setResetKey] = useState(0);

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

  // Sync params when system changes
  useEffect(() => {
    const s = getSystem(selectedId);
    if (s) setParams([...s.params.defaults]);
  }, [selectedId]);

  return (
    <div className="relative w-screen h-screen bg-background overflow-hidden">
      {/* Theme toggle — top-right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <AttractorCanvas
        system={system}
        params={params}
        stepsPerFrame={stepsPerFrame}
        colorSpeed={colorSpeed}
        pointSize={pointSize}
        autoRotate={autoRotate}
        resetKey={resetKey}
      />
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
      />
    </div>
  );
}
