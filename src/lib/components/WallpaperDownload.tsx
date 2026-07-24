import { useCallback, useState } from "react";
import * as THREE from "three";

import { Button } from "@/lib/components/ui/button";

const RESOLUTIONS = [
  { height: 1080, label: "1920x1080", width: 1920 },
  { height: 1440, label: "2560x1440", width: 2560 },
  { height: 2160, label: "3840x2160", width: 3840 },
] as const;

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

  const handleDownload = useCallback(async () => {
    if (!renderer || !scene || !camera || downloading) return;
    setDownloading(true);

    const res = RESOLUTIONS[selected];

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
  }, [renderer, scene, camera, selected, systemId, downloading, onClose]);

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
                    selected === i
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "border-border/30 bg-muted/30 text-foreground/70 hover:bg-muted/50"
                  }`}
                  key={res.label}
                  onClick={() => setSelected(i)}
                  variant="outline"
                >
                  {res.label}
                </Button>
              ))}
            </div>
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
