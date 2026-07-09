import type { AttractorSystem } from "../systems";

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

function Slider({
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
    <div style={styles.sliderRow}>
      <label style={styles.sliderLabel}>{name}</label>
      <div style={styles.sliderValue}>{formatNum(value, min, max)}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={(max - min) / 200}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={styles.slider}
      />
    </div>
  );
}

function formatNum(v: number, min: number, max: number): string {
  const range = max - min;
  if (range < 0.01) return v.toFixed(4);
  if (range < 1) return v.toFixed(4);
  if (range < 100) return v.toFixed(2);
  return v.toFixed(1);
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
    <div style={styles.panel}>
      <h2 style={styles.title}>Strange Attractors</h2>

      {/* Attractor selector */}
      <div style={styles.section}>
        <label style={styles.label}>System</label>
        <select
          value={selectedId}
          onChange={(e) => onSystemChange(e.target.value)}
          style={styles.select}
        >
          {systems.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Parameters */}
      {system.params.defaults.map((defaultVal, i) => (
        <div key={system.params.names[i]} style={styles.section}>
          <Slider
            name={system.params.names[i]}
            value={params[i] ?? defaultVal}
            min={system.params.min[i] ?? defaultVal * 0.1}
            max={system.params.max[i] ?? defaultVal * 5}
            onChange={(v) => onParamChange(i, v)}
          />
        </div>
      ))}

      {/* Display */}
      <div style={styles.divider} />
      <h3 style={styles.subTitle}>Display</h3>

      <div style={styles.section}>
        <Slider
          name="Color speed"
          value={colorSpeed}
          min={0.1}
          max={10}
          onChange={onColorSpeedChange}
        />
      </div>

      <div style={styles.section}>
        <Slider
          name="Point size"
          value={pointSize}
          min={0.5}
          max={8}
          onChange={onPointSizeChange}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Steps per frame</label>
        <div style={styles.sliderValue}>{stepsPerFrame}</div>
        <input
          type="range"
          min={1}
          max={1000}
          step={1}
          value={stepsPerFrame}
          onChange={(e) => onStepsChange(parseInt(e.target.value, 10))}
          style={styles.slider}
        />
      </div>

      {/* Toggles */}
      <div style={styles.toggleRow}>
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => onAutoRotateChange(e.target.checked)}
            style={styles.checkbox}
          />
          Auto-rotate
        </label>
      </div>

      {/* Reset button */}
      <button style={styles.button} onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 280,
    background: "rgba(10, 10, 20, 0.85)",
    backdropFilter: "blur(12px)",
    borderRadius: 12,
    padding: "16px 20px",
    color: "#e0e0e0",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 13,
    maxHeight: "calc(100vh - 32px)",
    overflowY: "auto",
    zIndex: 10,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: "#ffffff",
    letterSpacing: "0.5px",
  },
  subTitle: {
    margin: "12px 0 6px",
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  section: {
    marginBottom: 8,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#aaa",
    marginBottom: 2,
  },
  select: {
    width: "100%",
    padding: "6px 8px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    color: "#e0e0e0",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
  },
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#aaa",
    minWidth: 60,
  },
  sliderValue: {
    fontSize: 11,
    color: "#888",
    minWidth: 40,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  slider: {
    flex: 1,
    height: 4,
    appearance: "auto" as never,
    cursor: "pointer",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "12px 0",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  toggleLabel: {
    fontSize: 12,
    color: "#aaa",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  checkbox: {
    width: 14,
    height: 14,
    cursor: "pointer",
  },
  button: {
    width: "100%",
    marginTop: 12,
    padding: "8px 0",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    color: "#e0e0e0",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
