import { useState } from "react";

interface StyledSliderProps {
  color?: string;
  format?: (v: number) => string;
  label?: string;
  max: number;
  min: number;
  onChange: (v: number) => void;
  step: number;
  value: number;
  valueSuffix?: string;
}

const defaultColor = "#818cf8";

function StyledSlider({
  color = defaultColor,
  format,
  label,
  max,
  min,
  onChange,
  step,
  value,
  valueSuffix = "",
}: StyledSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const displayValue = format
    ? format(value)
    : Number.isInteger(step)
      ? Math.round(value).toString()
      : value.toFixed(2);
  const [isDragging, setIsDragging] = useState(false);

  // Skip header row when label is not provided (ParamCell renders its own)
  const hasHeader = label != null && label !== "";

  return (
    <div className="w-full select-none">
      {/* Header row */}
      {hasHeader && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-[13px] font-medium text-white/70">{label}</span>
          <span
            className="rounded bg-white/6 px-1.5 py-0.5 text-[10px] font-mono tabular-nums text-white/50"
            style={{ color: `${color}cc` }}
          >
            {displayValue}
            {valueSuffix}
          </span>
        </div>
      )}

      {/* Slider track area */}
      <div className="relative h-8 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/6 shadow-inner" />
        {/* Gradient fill */}
        <div
          className="absolute h-1.5 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            left: 0,
            right: `${100 - pct}%`,
          }}
        />
        {/* Thumb glow */}
        <div
          className="absolute h-6 w-6 rounded-full pointer-events-none transition-all"
          style={{
            backgroundColor: `${color}15`,
            filter: "blur(8px)",
            left: `calc(${pct}% - 12px)`,
            opacity: isDragging ? 1 : 0,
            transform: isDragging ? "scale(1.6)" : "scale(1)",
            transition: "all 0.3s ease-out",
          }}
        />
        {/* Thumb */}
        <div
          className="absolute h-4 w-4 rounded-full border-2 bg-zinc-100 pointer-events-none cursor-grab active:cursor-grabbing transition-transform"
          style={{
            borderColor: color,
            boxShadow: `0 0 0 2px ${color}20, 0 2px 6px ${color}40, 0 1px 3px rgba(0,0,0,0.4)`,
            left: `calc(${pct}% - 8px)`,
            transform: isDragging ? "scale(1.3)" : "scale(1)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full absolute"
            style={{
              backgroundColor: color,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        {/* Transparent input overlay */}
        <input
          className="absolute inset-x-0 h-full opacity-0 cursor-pointer z-10"
          max={max}
          min={min}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          step={step}
          type="range"
          value={value}
        />
      </div>
    </div>
  );
}

export default StyledSlider;
