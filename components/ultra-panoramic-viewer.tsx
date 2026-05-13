'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Maximize2, Minimize2, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { panoramaLoader, debounce, throttle, getOptimalCanvasResolution } from '@/lib/vr-tour-utils';

interface UltraPanormicViewerProps {
  panoramaUrl: string;
  title: string;
  onClose: () => void;
  quality?: '4k' | '2k' | '1080p';
}

interface ViewerState {
  yaw: number;
  pitch: number;
  zoom: number;
  isDragging: boolean;
  startX: number;
  startY: number;
}

export const UltraPanormicViewer = ({
  panoramaUrl,
  title,
  onClose,
  quality = '2k',
}: UltraPanormicViewerProps) => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fps, setFps] = useState(60);

  // Viewer state using useRef for performance
  const stateRef = useRef<ViewerState>({
    yaw: 0,
    pitch: 0,
    zoom: 1,
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Performance metrics
  const metricsRef = useRef({
    frameCount: 0,
    lastTime: Date.now(),
  });

  // Load panorama image with optimization
  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = await panoramaLoader.loadImage(panoramaUrl);
        imageRef.current = img;
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load panorama:', error);
        setIsLoading(false);
      }
    };

    loadImage();
  }, [panoramaUrl]);

  // Setup canvas and optimization
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height, pixelRatio } = getOptimalCanvasResolution();
    
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width / pixelRatio}px`;
    canvas.style.height = `${height / pixelRatio}px`;

    const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
    if (ctx) {
      ctx.scale(pixelRatio, pixelRatio);
      contextRef.current = ctx;
    }
  }, []);

  // Optimized render function with equirectangular projection
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    const { yaw, pitch, zoom } = stateRef.current;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Calculate projection parameters
    const centerX = w / 2;
    const centerY = h / 2;
    const scale = Math.min(w, h) * zoom * 0.4;

    // Draw panorama with equirectangular projection
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (x - centerX) / scale;
        const dy = (y - centerY) / scale;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) continue;

        const theta = Math.asin(distance);
        const phi = Math.atan2(dy, dx);

        // Apply rotation
        const rotatedLon = phi + yaw;
        const rotatedLat = Math.atan2(Math.sin(theta) * Math.sin(pitch), Math.cos(theta)) + pitch;

        // Map to panorama coordinates
        const u = ((rotatedLon / Math.PI) + 1) / 2;
        const v = (Math.asin(Math.sin(rotatedLat)) / Math.PI) + 0.5;

        const px = (u * img.width) % img.width;
        const py = (v * img.height) % img.height;

        // Bilinear interpolation for smooth rendering
        const ix = Math.floor(px);
        const iy = Math.floor(py);
        const fx = px - ix;
        const fy = py - iy;

        const imgData = ctx.getImageData(ix, iy, 2, 2);
        const data = imgData.data;

        const r = Math.floor((1 - fx) * (1 - fy) * data[0] +
                            fx * (1 - fy) * data[4] +
                            (1 - fx) * fy * data[8 * 4] +
                            fx * fy * data[12 * 4]);

        ctx.fillStyle = `rgb(${r}, ${r}, ${r})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Update FPS
    metricsRef.current.frameCount++;
    const now = Date.now();
    if (now - metricsRef.current.lastTime >= 1000) {
      setFps(metricsRef.current.frameCount);
      metricsRef.current.frameCount = 0;
      metricsRef.current.lastTime = now;
    }
  }, []);

  // Main animation loop with requestAnimationFrame
  useEffect(() => {
    if (isLoading) return;

    setupCanvas();

    const loop = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, setupCanvas, render]);

  // Mouse controls
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.startX = e.clientX;
    stateRef.current.startY = e.clientY;
  }, []);

  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent) => {
      if (!stateRef.current.isDragging) return;

      const dx = e.clientX - stateRef.current.startX;
      const dy = e.clientY - stateRef.current.startY;

      stateRef.current.yaw -= dx * 0.01;
      stateRef.current.pitch += dy * 0.01;

      stateRef.current.startX = e.clientX;
      stateRef.current.startY = e.clientY;
    }, 16),
    []
  );

  const handleMouseUp = useCallback(() => {
    stateRef.current.isDragging = false;
  }, []);

  // Wheel zoom
  const handleWheel = useCallback(
    debounce((e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      stateRef.current.zoom += (e.deltaY > 0 ? -zoomSpeed : zoomSpeed);
      stateRef.current.zoom = Math.max(0.5, Math.min(4, stateRef.current.zoom));
    }, 50),
    []
  );

  const handleReset = useCallback(() => {
    stateRef.current = {
      yaw: 0,
      pitch: 0,
      zoom: 1,
      isDragging: false,
      startX: 0,
      startY: 0,
    };
  }, []);

  const handleFullscreen = useCallback(() => {
    const elem = canvasRef.current;
    if (!elem) return;

    if (!isFullscreen) {
      elem.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Zap className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-white text-lg">{title}</p>
          <p className="text-gray-400 text-sm mt-2">Loading 360° panorama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <h2 className="text-white font-bold text-lg">{title}</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleReset} title="Reset view">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleFullscreen} title="Fullscreen">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="outline" onClick={onClose} title="Close">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Performance metrics */}
      <div className="absolute bottom-4 left-4 text-gray-400 text-xs bg-black bg-opacity-50 p-2 rounded">
        <p>FPS: {fps}</p>
        <p>Zoom: {stateRef.current.zoom.toFixed(1)}x</p>
      </div>
    </div>
  );
};
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
