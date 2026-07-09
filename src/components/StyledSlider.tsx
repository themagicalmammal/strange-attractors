interface StyledSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  label?: string;
  valueSuffix?: string;
  color?: string;
  format?: (v: number) => string;
}

const defaultColor = "oklch(0.65 0.22 264.376)";

function StyledSlider({
  min,
  max,
  step,
  value,
  onChange,
  label,
  valueSuffix = "",
  color = defaultColor,
  format,
}: StyledSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const displayValue = format ? format(value) : (Number.isInteger(step) ? Math.round(value).toString() : value.toFixed(2));

  // No useEffect needed — the custom visual track/fill/thumb handle all styling

  return (
    <div className="space-y-2.5 w-full">
      <div className="flex items-center justify-between">
        {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
        <span
          className="text-xs font-mono font-semibold rounded-md px-2 py-0.5"
          style={{
            color,
            backgroundColor: `${color}18`,
          }}
        >
          {displayValue}{valueSuffix}
        </span>
      </div>

      <div className="relative h-10 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-3 rounded-full bg-muted/40 shadow-inner shadow-black/5" />
        {/* Gradient fill */}
        <div
          className="absolute h-3 rounded-full"
          style={{
            left: 0,
            right: `${100 - pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          }}
        />
        {/* Thumb shadow on track */}
        <div
          className="absolute h-4 w-4 rounded-full shadow-md pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            backgroundColor: `${color}30`,
            filter: "blur(2px)",
          }}
        />
        {/* Thumb */}
        <div
          className="absolute h-6 w-6 rounded-full border-[3px] bg-white shadow-lg pointer-events-none transition-transform hover:scale-110 active:scale-95"
          style={{
            left: `calc(${pct}% - 12px)`,
            borderColor: color,
            boxShadow: `0 0 0 3px ${color}25, 0 2px 6px ${color}40`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        </div>
        {/* Transparent input overlay — handles all interaction */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-x-0 h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
}

export default StyledSlider;
