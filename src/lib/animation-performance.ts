/**
 * Animation Performance Optimization
 * Ensures smooth 60fps animations and efficient rendering
 */

// ─────────────────────────────────────────────────────────────────
// WILL-CHANGE HINTS
// ─────────────────────────────────────────────────────────────────

export const animationHints = {
  // For elements that will be transformed
  transform: "will-change: transform;",
  // For elements that will change opacity
  opacity: "will-change: opacity;",
  // For elements that will change both
  both: "will-change: transform, opacity;",
};

// ─────────────────────────────────────────────────────────────────
// REDUCE MOTION PREFERENCES
// ─────────────────────────────────────────────────────────────────

export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const getAnimationDuration = (fullDuration: number): number => {
  return prefersReducedMotion() ? 0.1 : fullDuration;
};

// ─────────────────────────────────────────────────────────────────
// DEBOUNCE & THROTTLE FOR SCROLL/RESIZE
// ─────────────────────────────────────────────────────────────────

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ─────────────────────────────────────────────────────────────────
// LAZY LOADING CONFIGURATION
// ─────────────────────────────────────────────────────────────────

export const lazyLoadConfig = {
  // Intersection Observer options for lazy loading
  observer: {
    root: null,
    rootMargin: "50px",
    threshold: 0.01,
  },
  // Image loading strategy
  loading: "lazy" as const,
  // Decode strategy
  decoding: "async" as const,
};

// ─────────────────────────────────────────────────────────────────
// ANIMATION FRAME OPTIMIZATION
// ─────────────────────────────────────────────────────────────────

export const useAnimationFrame = (callback: (time: number) => void) => {
  let frameId: number;

  const animate = (time: number) => {
    callback(time);
    frameId = requestAnimationFrame(animate);
  };

  const start = () => {
    frameId = requestAnimationFrame(animate);
  };

  const stop = () => {
    cancelAnimationFrame(frameId);
  };

  return { start, stop };
};

// ─────────────────────────────────────────────────────────────────
// GPU ACCELERATION HINTS
// ─────────────────────────────────────────────────────────────────

export const gpuAccelerationClasses = {
  // Force GPU acceleration with transform3d
  gpu: "transform: translateZ(0); backface-visibility: hidden;",
  // Optimize for animations
  optimized: "transform: translate3d(0, 0, 0); will-change: transform;",
};

// ─────────────────────────────────────────────────────────────────
// MOTION PREFERENCE VARIANTS
// ─────────────────────────────────────────────────────────────────

export const getMotionVariants = (fullMotion: any, reducedMotion: any) => {
  return prefersReducedMotion() ? reducedMotion : fullMotion;
};

// ─────────────────────────────────────────────────────────────────
// PERFORMANCE MONITORING
// ─────────────────────────────────────────────────────────────────

export const measureAnimationPerformance = (animationName: string, callback: () => void) => {
  if (typeof window === "undefined" || !window.performance) return;

  const startMark = `${animationName}-start`;
  const endMark = `${animationName}-end`;
  const measureName = `${animationName}-duration`;

  performance.mark(startMark);
  callback();
  performance.mark(endMark);

  try {
    performance.measure(measureName, startMark, endMark);
    const measure = performance.getEntriesByName(measureName)[0];
    console.log(`${animationName} took ${measure.duration.toFixed(2)}ms`);
  } catch (e) {
    console.error(`Failed to measure ${animationName}:`, e);
  }
};

// ─────────────────────────────────────────────────────────────────
// BATCH DOM UPDATES
// ─────────────────────────────────────────────────────────────────

export const batchDOMUpdates = (updates: Array<() => void>) => {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
};

// ─────────────────────────────────────────────────────────────────
// PRELOAD IMAGES FOR SMOOTH TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        }),
    ),
  );
};

// ─────────────────────────────────────────────────────────────────
// ANIMATION FRAME RATE DETECTION
// ─────────────────────────────────────────────────────────────────

export const detectFrameRate = (): Promise<number> => {
  return new Promise((resolve) => {
    let frames = 0;
    const lastTime = performance.now();

    const countFrames = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        resolve(frames);
      } else {
        requestAnimationFrame(countFrames);
      }
    };

    requestAnimationFrame(countFrames);
  });
};
