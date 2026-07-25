import { useCallback, useState } from "react";
import * as THREE from "three";

import { Button } from "@/lib/components/ui/button";

const RESOLUTIONS = [
  { height: 720, label: "1280x720", width: 1280 },
  { height: 800, label: "1280x800", width: 1280 },
  { height: 900, label: "1440x900", width: 1440 },
  { height: 900, label: "1600x900", width: 1600 },
  { height: 1200, label: "1600x1200", width: 1600 },
  { height: 1080, label: "1920x1080", width: 1920 },
  { height: 1200, label: "1920x1200", width: 1920 },
  { height: 1200, label: "2560x1200", width: 2560 },
  { height: 1440, label: "2560x1440", width: 2560 },
  { height: 2160, label: "3840x2160", width: 3840 },
  { height: 2400, label: "3840x2400", width: 3840 },
  { height: 4320, label: "7680x4320", width: 7680 },
] as const;

const MAX_RESOLUTION = 7680;

interface WallpaperDownloadProps {
  camera: THREE.PerspectiveCamera | undefined;
  onClose: () => void;
  open: boolean;
  renderer: null | THREE.WebGLRenderer;
  scene: null | THREE.Scene;
  systemId: string;
}

export function WallpaperDownload({
  camera,
  onClose,
  open,
  renderer,
  scene,
  systemId,
}: WallpaperDownloadProps) {
  const [selected, setSelected] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [customW, setCustomW] = useState(1920);
  const [customH, setCustomH] = useState(1080);
  const [useCustom, setUseCustom] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!renderer || !scene || !camera || downloading) return;
    setDownloading(true);

    const res = useCustom
      ? { height: customH, label: `${customW}x${customH}`, width: customW }
      : RESOLUTIONS[selected];

    // Save original state
    const origWidth = renderer.domElement.clientWidth;
    const origHeight = renderer.domElement.clientHeight;
    const origPixelRatio = renderer.getPixelRatio();

    // Setup for render
    const pixelRatio = Math.min(res.width / origWidth, 1.5);
    camera.aspect = res.width / res.height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(res.width, res.height);

    // Render
    renderer.render(scene, camera);

    // Get data URL from the canvas
    const dataUrl = renderer.domElement.toDataURL("image/png");

    // Restore original state
    camera.aspect = origWidth / origHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(origPixelRatio);
    renderer.setSize(origWidth, origHeight);

    // Download
    const img = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = dataUrl;
    });

    // Scale up to target resolution
    const canvas = document.createElement("canvas");
    canvas.width = res.width;
    canvas.height = res.height;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, res.width, res.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `strange-attractor-${systemId}-${res.label.replace("x", "p")}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
      onClose();
    }, "image/png");
  }, [
    renderer,
    scene,
    camera,
    selected,
    customW,
    customH,
    useCustom,
    systemId,
    downloading,
    onClose,
  ]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-backdrop-fade"
      onClick={onClose}
    >
      <div
        className="relative w-full mx-4 max-w-md overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl animate-modal-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <h2 className="text-base font-semibold">Download Wallpaper</h2>
          <Button
            className="rounded-xl p-2 text-muted-foreground hover:text-foreground transition-smooth"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Resolution
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RESOLUTIONS.map((res, i) => (
                <Button
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-smooth ${
                    selected === i && !useCustom
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "border-border/30 bg-muted/30 text-foreground/70 hover:bg-muted/50"
                  }`}
                  key={res.label}
                  onClick={() => {
                    setSelected(i);
                    setUseCustom(false);
                  }}
                  variant="outline"
                >
                  {res.label}
                </Button>
              ))}
            </div>
            <button
              className={`mt-2 w-full rounded-xl px-3 py-2 text-sm font-medium transition-smooth ${
                useCustom
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "border-border/30 bg-muted/30 text-foreground/70 hover:bg-muted/50"
              }`}
              onClick={() => setUseCustom((v) => !v)}
              type="button"
            >
              {useCustom ? "− Custom" : "+ Custom"}
            </button>
            {useCustom && (
              <div className="flex items-center gap-3 mt-1">
                {/* Width stepper */}
                <div className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-muted-foreground">W</span>
                  <div className="flex items-center gap-1">
                    <button
                      className="flex size-7 items-center justify-center rounded-lg border border-border/20 bg-muted/40 text-foreground/70 text-sm transition hover:bg-muted/60"
                      onClick={() => setCustomW(Math.max(1, customW - 10))}
                      type="button"
                    >
                      −
                    </button>
                    <input
                      className="w-16 rounded-lg border border-border/20 bg-muted/20 py-1 text-center text-sm font-mono tabular-nums text-foreground/80 outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                      max={MAX_RESOLUTION}
                      min={1}
                      onBlur={(e) => {
                        const v = Math.min(
                          MAX_RESOLUTION,
                          Math.max(1, parseInt(e.target.value) || 1),
                        );
                        setCustomW(v);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLElement).blur();
                        if (e.key === "Escape")
                          (e.target as HTMLElement).blur();
                      }}
                      type="number"
                      value={customW}
                    />
                    <button
                      className="flex size-7 items-center justify-center rounded-lg border border-border/20 bg-muted/40 text-foreground/70 text-sm transition hover:bg-muted/60"
                      onClick={() =>
                        setCustomW(Math.min(MAX_RESOLUTION, customW + 10))
                      }
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="pt-5 text-muted-foreground">×</span>
                {/* Height stepper */}
                <div className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-muted-foreground">H</span>
                  <div className="flex items-center gap-1">
                    <button
                      className="flex size-7 items-center justify-center rounded-lg border border-border/20 bg-muted/40 text-foreground/70 text-sm transition hover:bg-muted/60"
                      onClick={() => setCustomH(Math.max(1, customH - 10))}
                      type="button"
                    >
                      −
                    </button>
                    <input
                      className="w-16 rounded-lg border border-border/20 bg-muted/20 py-1 text-center text-sm font-mono tabular-nums text-foreground/80 outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                      max={MAX_RESOLUTION}
                      min={1}
                      onBlur={(e) => {
                        const v = Math.min(
                          MAX_RESOLUTION,
                          Math.max(1, parseInt(e.target.value) || 1),
                        );
                        setCustomH(v);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLElement).blur();
                        if (e.key === "Escape")
                          (e.target as HTMLElement).blur();
                      }}
                      style={{ appearance: "none", MozAppearance: "none" }}
                      type="number"
                      value={customH}
                    />
                    <button
                      className="flex size-7 items-center justify-center rounded-lg border border-border/20 bg-muted/40 text-foreground/70 text-sm transition hover:bg-muted/60"
                      onClick={() =>
                        setCustomH(Math.min(MAX_RESOLUTION, customH + 10))
                      }
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-smooth hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={downloading}
            onClick={handleDownload}
            size="lg"
            variant="default"
          >
            {downloading ? "Rendering..." : "Download"}
          </Button>
        </div>
      </div>
    </div>
  );
}
