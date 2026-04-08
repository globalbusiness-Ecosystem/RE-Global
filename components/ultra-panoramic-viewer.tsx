'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UltraPanormicViewerProps {
  panoramaUrl: string;
  title: string;
  onClose: () => void;
}

export const UltraPanormicViewer = ({
  panoramaUrl,
  title,
  onClose,
}: UltraPanormicViewerProps) => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number>();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State refs for viewer control
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });
  const zoomRef = useRef(1);



  // Load panorama image
  useEffect(() => {
    const loadImage = () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageRef.current = img;
        setIsLoading(false);
      };
      img.onerror = () => {
        console.error('Failed to load panorama:', panoramaUrl);
        setIsLoading(false);
      };
      img.src = panoramaUrl;
    };

    loadImage();
  }, [panoramaUrl]);

  // Main render loop
  useEffect(() => {
    if (isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    // Render function
    const render = () => {
      const img = imageRef.current;
      if (!img) return;

      const { yaw, pitch } = rotationRef.current;
      const zoom = zoomRef.current;

      // Clear canvas
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Calculate source crop
      const srcX = ((yaw / 360) % 1) * img.width;
      const srcY = ((pitch / 180 + 0.5) % 1) * img.height;
      const sourceWidth = img.width / zoom;
      const sourceHeight = img.height / zoom;

      // Clamp
      const clampedX = Math.max(0, Math.min(srcX, img.width - sourceWidth));
      const clampedY = Math.max(0, Math.min(srcY, img.height - sourceHeight));

      // Draw panorama
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        clampedX,
        clampedY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );
    };

    // Animation loop
    const handleFrame = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(handleFrame);
    };

    animationFrameRef.current = requestAnimationFrame(handleFrame);

    // Event handlers
    const handleMouseDown = (e: MouseEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      rotationRef.current.yaw -= deltaX * 0.5;
      rotationRef.current.pitch += deltaY * 0.5;

      rotationRef.current.pitch = Math.max(
        -90,
        Math.min(90, rotationRef.current.pitch)
      );

      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current += e.deltaY > 0 ? -0.1 : 0.1;
      zoomRef.current = Math.max(1, Math.min(3, zoomRef.current));
    };

    const handleResize = () => setupCanvas();

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        dragRef.current.isDragging = true;
        dragRef.current.startX = e.touches[0].clientX;
        dragRef.current.startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.isDragging) return;
      e.preventDefault();

      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - dragRef.current.startX;
        const deltaY = e.touches[0].clientY - dragRef.current.startY;

        rotationRef.current.yaw -= deltaX * 0.5;
        rotationRef.current.pitch += deltaY * 0.5;

        rotationRef.current.pitch = Math.max(
          -90,
          Math.min(90, rotationRef.current.pitch)
        );

        dragRef.current.startX = e.touches[0].clientX;
        dragRef.current.startY = e.touches[0].clientY;
      }

      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dist = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        // Simple pinch zoom
        if (dragRef.current.startX && dist) {
          const ratio = dist / dragRef.current.startX;
          zoomRef.current *= ratio;
          zoomRef.current = Math.max(1, Math.min(3, zoomRef.current));
          dragRef.current.startX = dist;
        }
      }
    };

    const handleTouchEnd = () => {
      dragRef.current.isDragging = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLoading]);

  const handleResetView = () => {
    rotationRef.current.yaw = 0;
    rotationRef.current.pitch = 0;
    zoomRef.current = 1;
  };

  const handleFullscreen = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isFullscreen) {
      try {
        await canvas.requestFullscreen();
        setIsFullscreen(true);
      } catch {}
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ display: isLoading ? 'none' : 'block' }}
      />

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            <p className="text-foreground">{title}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {!isLoading && (
        <>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-accent text-accent-foreground hover:opacity-80 transition-opacity"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <div className="absolute top-4 left-4 z-50">
            <p className="text-foreground font-semibold text-sm">{title}</p>
            <p className="text-muted-foreground text-xs">360° Panoramic View</p>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-16 z-50 flex gap-2">
            <button
              onClick={handleResetView}
              className="p-2 rounded-lg bg-accent/10 border border-accent hover:bg-accent/20 transition-colors"
              title="Reset view"
            >
              <RotateCcw className="w-5 h-5 text-accent" />
            </button>

            <button
              onClick={handleFullscreen}
              className="p-2 rounded-lg bg-accent/10 border border-accent hover:bg-accent/20 transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-accent" />
              ) : (
                <Maximize2 className="w-5 h-5 text-accent" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UltraPanormicViewer;
