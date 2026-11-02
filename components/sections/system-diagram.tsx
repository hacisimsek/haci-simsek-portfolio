// A quiet sketch of the work beside the name: a request in through the
// gateway, onto the Kafka bus, out to the services. One accent pulse travels
// the route every few seconds; SMIL keeps it off document.getAnimations(), so
// nothing waiting for entrance motion to settle waits on it. Decorative: the
// headline says the same in words.
const NODES = [
  { x: 40, y: 200, label: 'client' },
  { x: 150, y: 200, label: 'gateway' },
  { x: 270, y: 200, label: 'order' },
  { x: 270, y: 318, label: 'postgres' },
  { x: 500, y: 110, label: 'payment' },
  { x: 500, y: 200, label: 'inventory' },
  { x: 500, y: 290, label: 'shipping' },
];

const EDGES = [
  'M70 200 H118',
  'M182 200 H236',
  'M270 222 V296',
  'M304 200 H385',
  'M385 110 V290',
  'M385 110 H466',
  'M385 200 H466',
  'M385 290 H466',
];
const BUS = 4;

// Ends at the payment node's edge, where the pulse fades instead of
// parking on the label.
const ROUTE = 'M74 200 H270 H385 V110 H466';

export default function SystemDiagram({ className }: { className?: string }) {
  const pulse = (r: number, tone: string) => (
    <circle r={r} className={`system-pulse ${tone}`}>
      <animateMotion
        dur="4s"
        begin="1.4s"
        repeatCount="indefinite"
        path={ROUTE}
        keyPoints="0;1;1"
        keyTimes="0;0.55;1"
        calcMode="linear"
      />
      <animate
        attributeName="opacity"
        dur="4s"
        begin="1.4s"
        repeatCount="indefinite"
        values="0;1;1;0;0"
        keyTimes="0;0.05;0.5;0.58;1"
      />
    </circle>
  );

  return (
    <svg
      viewBox="0 0 560 380"
      aria-hidden
      className={`font-mono text-[12px] ${className ?? ''}`}
    >
      <text
        x="385"
        y="86"
        textAnchor="middle"
        className="fill-muted-foreground"
      >
        kafka
      </text>
      {EDGES.map((d, index) => (
        <path
          key={d}
          d={d}
          fill="none"
          className={`system-edge ${index === BUS ? 'stroke-accent/70' : 'stroke-muted-foreground/55'}`}
          strokeWidth={index === BUS ? 2.5 : 1.5}
          style={{ animationDelay: `${0.3 + index * 0.08}s` }}
        />
      ))}
      {NODES.map((node, index) => (
        <g
          key={node.label}
          className="system-edge"
          style={{ animationDelay: `${0.2 + index * 0.07}s` }}
        >
          <rect
            x={node.x - 34}
            y={node.y - 18}
            width="68"
            height="36"
            rx="10"
            className="fill-card stroke-muted-foreground/40"
          />
          <text
            x={node.x}
            y={node.y + 4}
            textAnchor="middle"
            className="fill-foreground"
          >
            {node.label}
          </text>
        </g>
      ))}
      {pulse(10, 'fill-accent/20')}
      {pulse(4, 'fill-accent')}
    </svg>
  );
}
