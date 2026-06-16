"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const blobs = [
      // Bottom-right mass (moved from top-left)
      { x: 0, y: 0, r: 0, baseR: 0, baseX: 0, baseY: 0, rColor: 27, gColor: 103, bColor: 179, aBase: 0.5 },
      // Top-right mass
      { x: 0, y: 0, r: 0, baseR: 0, baseX: 0, baseY: 0, rColor: 27, gColor: 103, bColor: 179, aBase: 0.4 },
      // Bottom-left mass
      { x: 0, y: 0, r: 0, baseR: 0, baseX: 0, baseY: 0, rColor: 27, gColor: 103, bColor: 179, aBase: 0.2 },
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const minDim = Math.min(width, height);
      // Contain radii so they don't flood the center of the screen
      blobs[0].baseR = minDim * 0.6;
      blobs[1].baseR = minDim * 0.7;
      blobs[2].baseR = minDim * 0.8;
      blobs.forEach(b => b.r = b.baseR);
      
      // Update bases in case of resize
      // Moved from top-left to bottom-right
      blobs[0].baseX = width;
      blobs[0].baseY = height;
      
      blobs[1].baseX = width;
      blobs[1].baseY = 0;

      blobs[2].baseX = 0;
      blobs[2].baseY = height;
    };

    const animateAmbient = (blob: any, rangeScale: number) => {
      gsap.to(blob, {
        x: blob.baseX + (Math.random() - 0.5) * width * rangeScale,
        y: blob.baseY + (Math.random() - 0.5) * height * rangeScale,
        r: blob.baseR * (0.5 + Math.random() * 1.0), // Extreme radius fluctuation (50% to 150%)
        duration: 3 + Math.random() * 5, // Even faster, more erratic gas-like movement
        ease: "sine.inOut",
        onComplete: () => animateAmbient(blob, rangeScale),
      });
    };

    const init = () => {
      resize();
      window.addEventListener("resize", resize);

      // Start all blobs at their corner anchors
      blobs.forEach(b => {
        b.x = b.baseX;
        b.y = b.baseY;
      });

      // Restrict movement range to keep them near the corners
      animateAmbient(blobs[0], 0.2);
      animateAmbient(blobs[1], 0.3);
      animateAmbient(blobs[2], 0.2);

      gsap.ticker.add(render);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Warm, creamy off-white background base
      ctx.fillStyle = "#F4F0EA";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "source-over"; // normal blending

      blobs.forEach((blob) => {
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.r
        );

        // Smooth 2-stop gradient for seamless bleeding edge
        gradient.addColorStop(
          0,
          `rgba(${blob.rColor}, ${blob.gColor}, ${blob.bColor}, ${blob.aBase})`
        );
        gradient.addColorStop(
          1,
          `rgba(${blob.rColor}, ${blob.gColor}, ${blob.bColor}, 0)`
        );

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    init();

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      gsap.killTweensOf(blobs);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
      />
      <div
        className="absolute -inset-[50%] z-[1] w-[200%] h-[200%] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          animation: "grain 8s steps(10) infinite",
        }}
      />
      <style jsx>{`
        @keyframes grain {
          0%,
          100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-5%, -10%);
          }
          20% {
            transform: translate(-15%, 5%);
          }
          30% {
            transform: translate(7%, -25%);
          }
          40% {
            transform: translate(-5%, 25%);
          }
          50% {
            transform: translate(-15%, 10%);
          }
          60% {
            transform: translate(15%, 0%);
          }
          70% {
            transform: translate(0%, 15%);
          }
          80% {
            transform: translate(3%, 35%);
          }
          90% {
            transform: translate(-10%, 10%);
          }
        }
      `}</style>
    </>
  );
}
