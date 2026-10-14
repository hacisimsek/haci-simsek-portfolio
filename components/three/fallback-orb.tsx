import { cn } from '@/lib/utils';

// Pure CSS stand-in for the WebGL sphere: painted with the page, never blocks
// it, and the only visual on phones, slow devices and reduced motion.
export default function FallbackOrb({ className }: { className?: string }) {
  return (
    <div
      data-orb
      aria-hidden
      className={cn('orb aspect-square w-full max-w-[560px]', className)}
    >
      <div className="orb-core" />
      <div className="orb-ring" />
    </div>
  );
}
