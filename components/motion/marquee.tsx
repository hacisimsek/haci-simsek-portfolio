// CSS-only loop. The second copy only fills the gap while the first scrolls
// out, so assistive tech and keyboard focus skip it.
export default function Marquee({
  items,
  label,
  reverse = false,
}: {
  items: string[];
  label: string;
  reverse?: boolean;
}) {
  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} inert={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="meta-chip text-sm whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      role="region"
      aria-label={label}
      className="marquee"
      data-reverse={reverse || undefined}
    >
      {list(false)}
      {list(true)}
    </div>
  );
}
