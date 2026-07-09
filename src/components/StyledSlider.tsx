import { useState } from "react";

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

const defaultColor = "oklch(0.55 0.20 264.376)";

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
  const displayValue = format
    ? format(value)
    : Number.isInteger(step)
      ? Math.round(value).toString()
      : value.toFixed(2);
  const [isDragging, setIsDragging] = useState(false);

  // Extracted value badge to avoid duplication
  const valueBadge = (
    <span
      className="text-sm font-mono font-semibold rounded-md px-3 py-1.5 transition-smooth slider-badge"
      style={{
        color,
        backgroundColor: `${color}12`,
        border: `1px solid ${color}25`,
      }}
    >
      {displayValue}
      {valueSuffix}
    </span>
  );

  return (
    <div className="w-full">
      {/* Header row — label + value */}
      <div className="flex items-center justify-between mb-2">
        {label ? (
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
        ) : (
          <span />
        )}
        {valueBadge}
      </div>

      {/* Slider track */}
      <div className="relative h-14 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-3 rounded-full bg-muted/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]" />
        {/* Gradient fill */}
        <div
          className="absolute h-3 rounded-full transition-none"
          style={{
            left: 0,
            right: `${100 - pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          }}
        />
        {/* Thumb glow */}
        <div
          className="absolute h-6 w-6 rounded-full pointer-events-none transition-all"
          style={{
            left: `calc(${pct}% - 12px)`,
            backgroundColor: `${color}20`,
            filter: "blur(6px)",
            opacity: isDragging ? 1 : 0,
            transform: isDragging ? "scale(1.8)" : "scale(1)",
            transition: "all 0.3s ease-out",
          }}
        />
        {/* Thumb */}
        <div
          className="absolute h-6 w-6 rounded-full border-[2.5px] bg-white shadow-lg pointer-events-none cursor-grab active:cursor-grabbing transition-smooth"
          style={{
            left: `calc(${pct}% - 12px)`,
            borderColor: color,
            boxShadow: `0 0 0 3px ${color}18, 0 2px 8px ${color}30`,
            transform: isDragging ? "scale(1.25)" : "scale(1)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full absolute"
            style={{
              backgroundColor: color,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        {/* Transparent input overlay */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-x-0 h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
}

export default StyledSlider;
