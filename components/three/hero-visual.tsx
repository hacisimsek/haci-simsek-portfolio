'use client';

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { deviceTier, shouldLoadSphere, type Tier } from '@/lib/perf';
import { cn } from '@/lib/utils';

const ParticleSphere = lazy(() => import('./particle-sphere'));

type Stage = 'orb' | 'loading' | 'sphere' | 'fallback';

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
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      cancelIdle = whenIdle(() => {
        setTier(detected);
        setStage('loading');
      });
    });
    observer.observe(node);
    return () => {
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
          stage === 'sphere' && 'opacity-0'
        )}
      >
        {children}
      </div>
      {showSphere ? (
        <Suspense fallback={null}>
          <ParticleSphere
            tier={tier}
            onReady={() => setStage('sphere')}
            onFallback={() => setStage('fallback')}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
