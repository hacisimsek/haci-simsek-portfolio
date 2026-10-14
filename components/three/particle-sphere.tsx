'use client';

import { useEffect, useEffectEvent, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { degrade, isSlow, POINTS, type Quality } from '@/lib/perf';
import { cssColorToRgb } from '@/lib/three/colors';
import { fibonacciSphere } from '@/lib/three/fibonacci';
import { fragmentShader, vertexShader } from './shaders';

const FPS_WINDOW = 2000;

function makeGeometry(count: number) {
  const { positions, offsets } = fibonacciSphere(count, 7);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aOffset', new BufferAttribute(offsets, 1));
  return geometry;
}

function readPalette() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const token = (name: string) => style.getPropertyValue(name).trim();
  return {
    dark: root.classList.contains('dark'),
    a: cssColorToRgb(token('--primary')),
    b: cssColorToRgb(token('--accent')),
  };
}

export default function ParticleSphere({
  tier,
  onReady,
  onFallback,
}: {
  tier: 'mid' | 'high';
  onReady: () => void;
  onFallback: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const ready = useEffectEvent(onReady);
  const fallback = useEffectEvent(onFallback);

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      fallback();
      return;
    }
    const canvas = renderer.domElement;
    canvas.dataset.sphere = '';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'absolute inset-0 h-full w-full';
    container.append(canvas);

    let quality: Quality = { dpr: 1.75, tier };
    const scene = new Scene();
    const camera = new PerspectiveCamera(40, 1, 0.1, 20);
    camera.position.z = 4.2;
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: [10, 10] },
        uScroll: { value: 0 },
        uSize: { value: 26 },
        uPixelRatio: { value: 1 },
        uOpacity: { value: 1 },
        uColorA: { value: new Color() },
        uColorB: { value: new Color() },
      },
    });
    const points = new Points(makeGeometry(POINTS[tier]), material);
    scene.add(points);

    // Lenis toggles classes on <html> on every scroll; only a real theme
    // change needs new colours.
    let paletteDark: boolean | undefined;
    function applyPalette() {
      const dark = document.documentElement.classList.contains('dark');
      if (dark === paletteDark) return;
      paletteDark = dark;
      const palette = readPalette();
      material.uniforms.uColorA.value.setRGB(...palette.a);
      material.uniforms.uColorB.value.setRGB(...palette.b);
      material.blending = palette.dark ? AdditiveBlending : NormalBlending;
      material.uniforms.uOpacity.value = palette.dark ? 0.9 : 0.75;
      canvas.dataset.palette = palette.dark ? 'dark' : 'light';
    }

    // The effective ratio is re-derived on every resize so moving to a
    // high-density screen or zooming re-renders sharply.
    // Cached so pointer moves never force a layout.
    let rect = canvas.getBoundingClientRect();
    function measure() {
      rect = canvas.getBoundingClientRect();
    }

    function resize() {
      if (quality === 'fallback') return;
      const ratio = Math.min(window.devicePixelRatio, quality.dpr);
      if (ratio !== renderer.getPixelRatio()) {
        renderer.setPixelRatio(ratio);
        material.uniforms.uPixelRatio.value = ratio;
      }
      measure();
      const { width, height } = container!.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    applyPalette();
    resize();

    // ResizeObserver misses a pixel-ratio change at the same CSS size (moving
    // the window to another monitor), so watch the resolution too.
    let resolution: MediaQueryList | undefined;
    function watchResolution() {
      resolution?.removeEventListener('change', onResolution);
      resolution = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      resolution.addEventListener('change', onResolution);
    }
    function onResolution() {
      resize();
      watchResolution();
    }
    watchResolution();

    // Pointer in normalised device coordinates, eased towards its target.
    const target = [10, 10];
    const pointer = material.uniforms.uPointer.value as number[];
    const section = container.closest('section') ?? container;
    function onPointerMove(event: PointerEvent) {
      target[0] = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target[1] = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    }
    function onPointerLeave() {
      target[0] = target[1] = 10;
    }
    section.addEventListener('pointermove', onPointerMove as EventListener);
    window.addEventListener('scroll', measure, { passive: true });
    section.addEventListener('pointerleave', onPointerLeave);

    let visible = true;
    let frame = 0;
    let first = true;
    let frames = 0;
    let windowStart = 0;
    let lastFrame = 0;
    let minDelta = Infinity;
    // The first window overlaps page-load work, so it is not judged.
    let warmedUp = false;
    let disposed = false;
    const start = performance.now();

    function tick(now: number) {
      frame = 0;
      const time = (now - start) / 1000;
      material.uniforms.uTime.value = time;
      material.uniforms.uScroll.value = Math.min(
        1,
        window.scrollY / window.innerHeight
      );
      pointer[0] += (target[0] - pointer[0]) * 0.08;
      pointer[1] += (target[1] - pointer[1]) * 0.08;
      points.rotation.y = time * 0.08;
      points.rotation.x = Math.sin(time * 0.1) * 0.15;
      renderer.render(scene, camera);

      if (first) {
        first = false;
        ready();
      }

      frames += 1;
      if (lastFrame) minDelta = Math.min(minDelta, now - lastFrame);
      lastFrame = now;
      if (!windowStart) windowStart = now;
      if (now - windowStart >= FPS_WINDOW) {
        const slow =
          warmedUp && isSlow({ frames, elapsed: now - windowStart, minDelta });
        warmedUp = true;
        frames = 0;
        windowStart = now;
        minDelta = Infinity;
        if (slow) {
          const previous = quality;
          quality = degrade(quality, window.devicePixelRatio);
          if (quality === 'fallback') {
            fallback();
            return;
          }
          if (previous !== 'fallback' && previous.tier !== quality.tier) {
            points.geometry.dispose();
            points.geometry = makeGeometry(POINTS[quality.tier]);
          }
          resize();
        }
      }
      schedule();
    }

    function schedule() {
      const running = visible && !document.hidden && !disposed;
      canvas.dataset.running = String(running);
      if (running && !frame) frame = requestAnimationFrame(tick);
      if (!running && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        // A paused window must not count as a slow one.
        frames = 0;
        windowStart = 0;
        lastFrame = 0;
        minDelta = Infinity;
      }
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    visibility.observe(container);
    document.addEventListener('visibilitychange', schedule);

    const sizes = new ResizeObserver(resize);
    sizes.observe(container);

    const theme = new MutationObserver(applyPalette);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    function onContextLost(event: Event) {
      event.preventDefault();
      fallback();
    }
    canvas.addEventListener('webglcontextlost', onContextLost);

    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      sizes.disconnect();
      theme.disconnect();
      resolution?.removeEventListener('change', onResolution);
      document.removeEventListener('visibilitychange', schedule);
      section.removeEventListener(
        'pointermove',
        onPointerMove as EventListener
      );
      section.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      window.removeEventListener('scroll', measure);
      points.geometry.dispose();
      material.dispose();
      renderer.dispose();
      // dispose() keeps the GL context; release it so remounts don't pile up.
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [tier]);

  return <div ref={host} className="absolute inset-0" />;
}
