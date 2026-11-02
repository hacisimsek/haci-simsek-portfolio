// A headline the reader lights up by scrolling: each word goes from the
// muted text colour (still readable, so contrast holds) to full as `progress` (0 to 1) passes its slice of `range`. Scrolling back dims
// it again, so the motion is always tied to the scroll. Plain inline styles,
// so nothing here is an animation the browser has to track.
export default function ScrubHeadline({
  id,
  text,
  progress,
  range: [start, end],
  className,
}: {
  id?: string;
  text: string;
  progress: number;
  range: [number, number];
  className?: string;
}) {
  const words = text.split(' ');
  const step = (end - start) / words.length;
  return (
    <h2 id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, index) => {
          const lit = Math.min(
            1,
            Math.max(0, (progress - start - index * step) / step)
          );
          return (
            <span
              key={index}
              className="inline-block"
              style={{
                color: `color-mix(in oklab, var(--foreground) ${Math.round(lit * 100)}%, var(--muted-foreground))`,
                transform: `translateY(${(1 - lit) * 0.18}em)`,
              }}
            >
              {word}
              {'\u00a0'}
            </span>
          );
        })}
      </span>
    </h2>
  );
}
