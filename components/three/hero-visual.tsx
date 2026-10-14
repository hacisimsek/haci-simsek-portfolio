'use client';

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { deviceTier, shouldLoadSphere, type Tier } from '@/lib/perf';
import { cn } from '@/lib/utils';

type Stage = 'orb' | 'loading' | 'sphere' | 'fallback';

type SphereProps = {
  tier: 'mid' | 'high';
  onReady: () => void;
  onFallback: () => void;
};

function readTier(): Tier {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return deviceTier({
    cores: nav.hardwareConcurrency ?? 4,
    memory: nav.deviceMemory,
    saveData: nav.connection?.saveData ?? false,
    coarsePointer: matchMedia('(pointer: coarse)').matches,
  });
}

function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

function whenIdle(callback: () => void) {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 1500);
  return () => clearTimeout(id);
}

// Shows the CSS orb (children) first and swaps in the WebGL sphere once the
// visual is on screen, the browser is idle and the device can afford it.
export default function HeroVisual({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>('orb');
  const [tier, setTier] = useState<'mid' | 'high'>('high');
  const [Sphere, setSphere] = useState<ComponentType<SphereProps> | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const detected = readTier();
    const allowed = shouldLoadSphere({
      tier: detected,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      webgl2: hasWebGL2(),
    });
    if (!allowed || detected === 'low') return;

    let cancelIdle: (() => void) | undefined;
    let cancelled = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      // A decorative extra: if its chunk fails to load (stale deploy, flaky
      // network, blocker) the orb simply stays.
      cancelIdle = whenIdle(() => {
        import('./particle-sphere')
          .then((module) => {
            if (cancelled) return;
            setTier(detected);
            setSphere(() => module.default);
            setStage('loading');
          })
          .catch(() => {
            if (!cancelled) setStage('fallback');
          });
      });
    });
    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
      cancelIdle?.();
    };
  }, []);

  const showSphere = stage === 'loading' || stage === 'sphere';

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
    >
      <div
        className={cn(
          'transition-opacity duration-700',
          stage === 'sphere' && 'orb-paused opacity-0'
        )}
      >
        {children}
      </div>
      {showSphere && Sphere ? (
        <Sphere
          tier={tier}
          onReady={() => setStage('sphere')}
          onFallback={() => setStage('fallback')}
        />
      ) : null}
    </div>
  );
}
