"use client";

import { useEffect, useRef, useState } from "react";

const BASE_WIDTH = 1536;
const BASE_HEIGHT = 3328;
const DISPLAY_WIDTH = 420;
const DOWNLOAD_SCALE = 5; // 1536 * 5 = 7680px wide (≈8K)

type Resolution = {
  width: number;
  height: number;
};

function renderWallpaper(
  canvas: HTMLCanvasElement,
  { width, height }: Resolution,
  pixelRatio: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if ("reset" in ctx && typeof (ctx as unknown as { reset: () => void }).reset === "function") {
    (ctx as unknown as { reset: () => void }).reset();
  } else {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio);
  }
  ctx.scale(pixelRatio, pixelRatio);

  drawScene(ctx, width, height);
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  paintBackground(ctx, width, height);
  paintEnergyHalo(ctx, width, height);
  paintDustVortices(ctx, width, height);
  paintLightning(ctx, width, height);
  paintGroundEmbers(ctx, width, height);
  paintShivaSilhouette(ctx, width, height);
  paintSerpent(ctx, width, height);
  paintForegroundMist(ctx, width, height);

  ctx.restore();
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#05070f");
  gradient.addColorStop(0.3, "#0b1124");
  gradient.addColorStop(0.65, "#06090f");
  gradient.addColorStop(1, "#020205");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const aurora = ctx.createRadialGradient(
    width * 0.5,
    height * 0.38,
    width * 0.05,
    width * 0.5,
    height * 0.38,
    width * 0.55,
  );

  aurora.addColorStop(0, "rgba(90, 153, 255, 0.55)");
  aurora.addColorStop(0.3, "rgba(38, 79, 170, 0.4)");
  aurora.addColorStop(0.6, "rgba(16, 32, 70, 0.18)");
  aurora.addColorStop(1, "rgba(4, 8, 17, 0)");

  ctx.fillStyle = aurora;
  ctx.fillRect(0, 0, width, height);
}

function paintEnergyHalo(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.translate(width / 2, height * 0.45);

  const maxRadius = width * 0.58;

  const layers = 6;
  for (let i = 0; i < layers; i++) {
    const radius = maxRadius * (1 - i * 0.12);
    const gradient = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
    gradient.addColorStop(0, `rgba(75, 140, 255, ${0.38 - i * 0.04})`);
    gradient.addColorStop(0.5, `rgba(47, 102, 255, ${0.16 - i * 0.02})`);
    gradient.addColorStop(1, "rgba(12, 24, 64, 0)");

    ctx.globalAlpha = 0.85 - i * 0.12;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      radius,
      radius * (0.82 - i * 0.03),
      (Math.PI / 180) * (i * 12),
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  ctx.restore();
}

function paintDustVortices(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const particleCount = 480;
  for (let i = 0; i < particleCount; i++) {
    const t = i / particleCount;
    const angle = t * Math.PI * 5.8 + Math.random() * 0.4;
    const radius = width * (0.15 + Math.pow(t, 1.2) * 0.5);
    const cx = width / 2 + Math.cos(angle) * radius * 0.55;
    const cy = height * 0.72 + Math.sin(angle) * radius * 0.18;

    const size = Math.random() * width * 0.004 + width * 0.001;

    const hue = 24 + Math.random() * 16;
    const saturation = 60 + Math.random() * 20;
    const lightness = 40 + Math.random() * 30;
    const alpha = 0.05 + Math.random() * 0.25;

    ctx.fillStyle = `hsla(${hue} ${saturation}% ${lightness}% / ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy,
      size * (1.8 + Math.random()),
      size * (0.6 + Math.random()),
      angle * 0.9,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}

function paintLightning(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const bolts = [
    {
      start: { x: width * 0.12, y: height * 0.22 },
      end: { x: width * 0.46, y: height * 0.46 },
    },
    {
      start: { x: width * 0.78, y: height * 0.16 },
      end: { x: width * 0.56, y: height * 0.44 },
    },
    {
      start: { x: width * 0.88, y: height * 0.48 },
      end: { x: width * 0.62, y: height * 0.58 },
    },
  ];

  for (const bolt of bolts) {
    drawLightningBolt(ctx, bolt.start, bolt.end, width);
  }
}

function drawLightningBolt(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  width: number,
) {
  ctx.save();

  const segments = 16;
  const path: Array<{ x: number; y: number }> = [start];

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const baseX = start.x + (end.x - start.x) * t;
    const baseY = start.y + (end.y - start.y) * t;
    const displacement =
      (Math.sin(t * Math.PI * 2.2) * width * 0.045 * (1 - Math.abs(t - 0.5))) /
      1.4;
    path.push({
      x: baseX + (Math.random() - 0.5) * displacement,
      y: baseY + (Math.random() - 0.5) * width * 0.02,
    });
  }
  path.push(end);

  ctx.globalCompositeOperation = "screen";

  ctx.lineCap = "round";

  const glowColor = "rgba(110, 205, 255, 0.6)";
  const coreColor = "rgba(224, 244, 255, 0.92)";

  ctx.strokeStyle = glowColor;
  ctx.lineWidth = width * 0.018;
  ctx.shadowColor = "rgba(120, 210, 255, 0.7)";
  ctx.shadowBlur = width * 0.04;
  ctx.beginPath();
  for (let i = 0; i < path.length; i++) {
    const point = path[i];
    if (i === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();

  ctx.shadowBlur = width * 0.012;
  ctx.lineWidth = width * 0.006;
  ctx.strokeStyle = coreColor;
  ctx.beginPath();
  for (let i = 0; i < path.length; i++) {
    const point = path[i];
    if (i === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();

  ctx.restore();
}

function paintGroundEmbers(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
  gradient.addColorStop(0, "rgba(16, 7, 0, 0)");
  gradient.addColorStop(0.35, "rgba(40, 20, 5, 0.2)");
  gradient.addColorStop(1, "rgba(120, 58, 20, 0.55)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  const emberCount = 380;
  for (let i = 0; i < emberCount; i++) {
    const x = Math.random() * width;
    const y =
      height * 0.68 + Math.pow(Math.random(), 1.4) * height * 0.32 * Math.random();
    const size = (Math.random() ** 2) * width * 0.007 + width * 0.002;
    const flicker = Math.random() * 0.15 + 0.1;

    ctx.fillStyle = `rgba(255, ${180 + Math.random() * 40}, ${
      120 + Math.random() * 40
    }, ${flicker})`;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      size,
      size * (0.6 + Math.random() * 0.7),
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}

function paintShivaSilhouette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.save();
  const scale = width / BASE_WIDTH;
  ctx.translate(width / 2, height * 0.6);
  ctx.scale(scale, scale);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const silhouette = new Path2D();
  silhouette.moveTo(-80, -780);
  silhouette.quadraticCurveTo(-130, -620, -162, -470);
  silhouette.bezierCurveTo(-210, -280, -320, -160, -260, 40);
  silhouette.quadraticCurveTo(-150, -40, -76, -12);
  silhouette.quadraticCurveTo(-20, -80, 55, -110);
  silhouette.quadraticCurveTo(140, -145, 220, -280);
  silhouette.quadraticCurveTo(240, -320, 210, -360);
  silhouette.quadraticCurveTo(160, -420, 60, -410);
  silhouette.quadraticCurveTo(90, -520, 92, -640);
  silhouette.quadraticCurveTo(96, -760, 32, -780);
  silhouette.closePath();

  ctx.fillStyle = "rgba(9, 16, 36, 0.94)";
  ctx.shadowColor = "rgba(30, 80, 200, 0.4)";
  ctx.shadowBlur = 60;
  ctx.fill(silhouette);

  ctx.lineWidth = 18;
  ctx.strokeStyle = "rgba(118, 176, 255, 0.55)";
  ctx.stroke(silhouette);

  ctx.shadowBlur = 0;

  // Right leg
  const rightLeg = new Path2D();
  rightLeg.moveTo(78, -150);
  rightLeg.quadraticCurveTo(140, -30, 200, 260);
  rightLeg.quadraticCurveTo(160, 310, 90, 300);
  rightLeg.quadraticCurveTo(40, 140, 40, -20);
  rightLeg.closePath();

  ctx.fillStyle = "rgba(12, 20, 40, 0.92)";
  ctx.fill(rightLeg);
  ctx.stroke(rightLeg);

  // Left leg
  const leftLeg = new Path2D();
  leftLeg.moveTo(-60, -140);
  leftLeg.quadraticCurveTo(-180, 40, -220, 360);
  leftLeg.quadraticCurveTo(-140, 420, -60, 360);
  leftLeg.quadraticCurveTo(-18, 220, 10, 20);
  leftLeg.quadraticCurveTo(20, -110, -20, -140);
  leftLeg.closePath();

  ctx.fill(leftLeg);
  ctx.stroke(leftLeg);

  // Arms
  const rightArm = new Path2D();
  rightArm.moveTo(70, -460);
  rightArm.quadraticCurveTo(210, -520, 300, -360);
  rightArm.quadraticCurveTo(240, -300, 150, -260);
  rightArm.quadraticCurveTo(70, -300, 70, -380);
  rightArm.closePath();
  ctx.fill(rightArm);
  ctx.stroke(rightArm);

  const leftArm = new Path2D();
  leftArm.moveTo(-90, -430);
  leftArm.quadraticCurveTo(-240, -470, -330, -300);
  leftArm.quadraticCurveTo(-250, -250, -150, -240);
  leftArm.quadraticCurveTo(-60, -260, -70, -340);
  leftArm.closePath();
  ctx.fill(leftArm);
  ctx.stroke(leftArm);

  // Trident silhouette
  ctx.save();
  ctx.translate(240, -350);
  const trident = new Path2D();
  trident.moveTo(10, -380);
  trident.quadraticCurveTo(60, -420, 56, -300);
  trident.quadraticCurveTo(80, -320, 90, -350);
  trident.quadraticCurveTo(120, -260, 90, -200);
  trident.quadraticCurveTo(80, -170, 90, -140);
  trident.lineTo(50, -100);
  trident.lineTo(50, 220);
  trident.lineTo(-20, 220);
  trident.lineTo(-20, -100);
  trident.lineTo(-60, -140);
  trident.quadraticCurveTo(-50, -170, -60, -200);
  trident.quadraticCurveTo(-92, -260, -60, -360);
  trident.quadraticCurveTo(-43, -320, -20, -300);
  trident.quadraticCurveTo(-20, -420, 20, -380);
  trident.closePath();
  ctx.fillStyle = "rgba(25, 60, 120, 0.9)";
  ctx.fill(trident);
  ctx.stroke(trident);
  ctx.restore();

  // Face highlight
  ctx.save();
  ctx.translate(-8, -680);
  const faceGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 120);
  faceGlow.addColorStop(0, "rgba(147, 200, 255, 0.8)");
  faceGlow.addColorStop(1, "rgba(30, 70, 140, 0)");
  ctx.fillStyle = faceGlow;
  ctx.beginPath();
  ctx.ellipse(0, 0, 120, 140, Math.PI / 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function paintSerpent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.save();
  const scale = width / BASE_WIDTH;
  ctx.translate(width / 2 + 120 * scale, height * 0.36);
  ctx.scale(scale, scale);

  const bodyPath = new Path2D();
  bodyPath.moveTo(-30, -20);
  bodyPath.bezierCurveTo(120, -260, 80, -450, 20, -540);
  bodyPath.bezierCurveTo(-20, -580, -90, -520, -70, -460);
  bodyPath.bezierCurveTo(-20, -280, -10, 40, -60, 280);
  bodyPath.bezierCurveTo(-80, 380, -30, 460, 50, 430);
  bodyPath.bezierCurveTo(140, 390, 210, 260, 160, 180);
  bodyPath.bezierCurveTo(110, 100, 60, 20, -10, -10);

  ctx.lineWidth = 32;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(44, 94, 160, 0.92)";
  ctx.shadowColor = "rgba(66, 142, 255, 0.6)";
  ctx.shadowBlur = 50;
  ctx.stroke(bodyPath);

  ctx.lineWidth = 18;
  ctx.strokeStyle = "rgba(120, 205, 255, 0.9)";
  ctx.shadowBlur = 20;
  ctx.stroke(bodyPath);

  // Eyes
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(70, 160, 255, 0.92)";
  ctx.beginPath();
  ctx.ellipse(45, -480, 28, 18, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(13, 28, 60, 0.92)";
  ctx.beginPath();
  ctx.ellipse(52, -480, 10, 12, Math.PI / 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(70, 160, 255, 0.92)";
  ctx.beginPath();
  ctx.ellipse(-20, -506, 24, 16, -Math.PI / 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(13, 28, 60, 0.92)";
  ctx.beginPath();
  ctx.ellipse(-14, -505, 8, 11, -Math.PI / 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function paintForegroundMist(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const mistLayers = 4;
  for (let i = 0; i < mistLayers; i++) {
    const gradient = ctx.createRadialGradient(
      width * (0.2 + i * 0.2),
      height * (0.74 + i * 0.06),
      width * 0.02,
      width * (0.2 + i * 0.2),
      height * (0.74 + i * 0.06),
      width * 0.4,
    );
    gradient.addColorStop(0, `rgba(120, 150, 220, ${0.12 - i * 0.02})`);
    gradient.addColorStop(1, "rgba(10, 20, 40, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      width * (0.2 + i * 0.2),
      height * (0.78 + i * 0.04),
      width * 0.46,
      height * 0.14,
      (Math.PI / 10) * i,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  ctx.restore();

  const vignette = ctx.createLinearGradient(0, height * 0.55, 0, height);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, height * 0.55, width, height * 0.45);
}

function clampResolution() {
  const aspect = BASE_HEIGHT / BASE_WIDTH;
  const width = Math.min(DISPLAY_WIDTH, Math.floor(window.innerWidth * 0.9));
  return {
    width,
    height: Math.round(width * aspect),
  };
}

export function WallpaperCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [lastRender, setLastRender] = useState<Resolution | null>(null);

  useEffect(() => {
    function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setIsRendering(true);
      const resolution = clampResolution();
      const pixelRatio = window.devicePixelRatio || 1;
      renderWallpaper(canvas, resolution, pixelRatio);
      setLastRender(resolution);
      setIsRendering(false);
    }

    const frame = requestAnimationFrame(draw);

    const handleResize = () => {
      requestAnimationFrame(draw);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDownload = async () => {
    const displayCanvas = canvasRef.current;
    if (!displayCanvas) return;

    setIsRendering(true);
    await new Promise((resolve) => setTimeout(resolve, 10));

    const offscreen = document.createElement("canvas");
    const highRes = {
      width: BASE_WIDTH * DOWNLOAD_SCALE,
      height: BASE_HEIGHT * DOWNLOAD_SCALE,
    };
    renderWallpaper(offscreen, highRes, 1);

    offscreen.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "shiva-tandav-8k-wallpaper.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        setIsRendering(false);
      },
      "image/png",
      1,
    );
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="max-w-full rounded-[46px] border border-white/5 bg-[#05070f] shadow-[0_32px_90px_-30px_rgba(35,100,255,0.6)]"
        aria-label="भगवान शिव का तांडव वॉलपेपर"
      />
      <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isRendering}
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_35px_-18px_rgba(34,139,230,0.9)] transition hover:translate-y-[-1px] hover:bg-blue-400 disabled:cursor-progress disabled:opacity-70 sm:w-auto"
        >
          {isRendering ? "Rendering…" : "Download 8K"}
        </button>
        {lastRender && (
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Preview {lastRender.width} × {lastRender.height}
          </p>
        )}
      </div>
    </div>
  );
}
