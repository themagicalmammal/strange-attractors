import { useRef } from "react";

import { zoomCamera } from "./AttractorCanvas";

export function ZoomControls() {
  const holdTimer = useRef<null | ReturnType<typeof setTimeout>>(null);
  const zoomInterval = useRef<null | ReturnType<typeof setInterval>>(null);

  const startZoom = (direction: number) => {
    // One small step immediately on press
    zoomCamera(direction);

    // Hold to continue stepping
    holdTimer.current = setTimeout(() => {
      zoomInterval.current = setInterval(() => {
        zoomCamera(direction);
      }, 60);
    }, 180);
  };

  const stopZoom = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (zoomInterval.current) clearInterval(zoomInterval.current);
    holdTimer.current = null;
    zoomInterval.current = null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-2">
      {/* Zoom in */}
      <button
        aria-label="Zoom in"
        className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-smooth hover:border-border/70 hover:shadow-md active:scale-95 dark:border-border/20 dark:bg-background/80"
        onMouseDown={() => startZoom(1)}
        onMouseLeave={stopZoom}
        onMouseUp={stopZoom}
        onTouchEnd={stopZoom}
        onTouchStart={(e) => {
          e.preventDefault();
          startZoom(1);
        }}
      >
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-foreground/90 px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          Zoom in
        </span>
      </button>

      {/* Zoom out */}
      <button
        aria-label="Zoom out"
        className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-smooth hover:border-border/70 hover:shadow-md active:scale-95 dark:border-border/20 dark:bg-background/80"
        onMouseDown={() => startZoom(-1)}
        onMouseLeave={stopZoom}
        onMouseUp={stopZoom}
        onTouchEnd={stopZoom}
        onTouchStart={(e) => {
          e.preventDefault();
          startZoom(-1);
        }}
      >
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" />
        </svg>
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-foreground/90 px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          Zoom out
        </span>
      </button>
    </div>
  );
}
