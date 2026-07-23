import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";

export type TransitionVariant =
  | "circle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "square"
  | "star"
  | "triangle";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  /** When true, the transition expands from the viewport center instead of the button center. */
  fromCenter?: boolean;
  /** Called on toggle. Pair with `theme` for controlled usage. */
  onThemeChange?: (theme: "dark" | "light") => void;
  /**
   * Controlled theme value. When provided, the parent owns persistence
   * (e.g. `next-themes`) and this component will not write to localStorage.
   */
  theme?: "dark" | "light";
  variant?: TransitionVariant;
}

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
  const pairs = Array.from(
    { length: vertexCount },
    () => `${cx}px ${cy}px`,
  ).join(", ");
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number,
): [string, string] {
  switch (variant) {
    case "circle":
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
    case "square": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "triangle": {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        `${cx}px ${cy - scale}px`,
        `${cx + dx}px ${cy + 0.5 * scale}px`,
        `${cx - dx}px ${cy + 0.5 * scale}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
    }
    case "diamond": {
      // Slightly larger than the view-transition circle radius so axis-aligned coverage matches the circle reveal.
      const R = maxRadius * Math.SQRT2;
      const end = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "hexagon": {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(", ")})`];
    }
    case "rectangle": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        `${cx - halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy + halfH}px`,
        `${cx - halfW}px ${cy + halfH}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "star": {
      // Small overscan so the last frames never leave a 1px seam before the transition group ends.
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            `${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`,
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`,
          );
        }
        return `polygon(${verts.join(", ")})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
  }
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  fromCenter = false,
  onThemeChange,
  theme,
  variant,
  ...props
}: AnimatedThemeTogglerProps) => {
  const shape = variant ?? "circle";
  const isControlled = theme !== undefined;
  const [internalIsDark, setInternalIsDark] = useState(false);
  const isDark = isControlled ? theme === "dark" : internalIsDark;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => {
      setInternalIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, [isControlled]);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    let x: number;
    let y: number;
    if (fromCenter) {
      x = viewportWidth / 2;
      y = viewportHeight / 2;
    } else {
      const { height, left, top, width } = button.getBoundingClientRect();
      x = left + width / 2;
      y = top + height / 2;
    }

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );

    const applyTheme = () => {
      const newTheme = !isDark;
      // Always toggle the class synchronously so the View Transitions API
      // snapshots the new theme inside the startViewTransition callback.
      document.documentElement.classList.toggle("dark");
      if (isControlled) {
        onThemeChange?.(newTheme ? "dark" : "light");
      } else {
        setInternalIsDark(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      }
    };

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const clipPath = getThemeTransitionClipPaths(
      shape,
      x,
      y,
      maxRadius,
      viewportWidth,
      viewportHeight,
    );

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = "active";
    root.style.setProperty(
      "--magicui-theme-toggle-vt-duration",
      `${duration}ms`,
    );
    // Pin the collapsed clip-path via CSS so Firefox does not paint the new
    // theme unclipped between snapshot and the ready.then() JS animation.
    root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);
    const cleanup = () => {
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
    };

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });
    if (typeof transition?.finished?.finally === "function") {
      transition.finished.finally(cleanup);
    } else {
      cleanup();
    }

    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration,
            // Star: linear avoids easing overshoot that fights polygon interpolation at t→1; VT group duration is synced above.
            easing: shape === "star" ? "linear" : "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    }
  }, [shape, fromCenter, duration, isDark, isControlled, onThemeChange]);

  return (
    <button
      className={cn(
        "flex items-center justify-center cursor-pointer rounded-lg outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      onClick={toggleTheme}
      ref={buttonRef}
      type="button"
      {...props}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
