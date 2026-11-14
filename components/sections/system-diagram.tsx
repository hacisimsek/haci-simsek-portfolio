import { useTranslations } from 'next-intl';
import { SEPARATOR } from '@/lib/utils';

// The sketch beside the name and the picture of the story below it, one
// drawing: a request in through the gateway, onto the Kafka bus, out to the
// services. Each story step adds a layer (data-at): the log's partitions, a
// skipped redelivery, a failed payment with its compensation, and the trace.
// Which layers show is CSS: none in the hero, the reached ones while the story
// scrolls, all of them when `finished`. One accent pulse travels the route in
// the hero; SMIL keeps it off document.getAnimations(), so nothing waiting for
// entrance motion to settle waits on it. Decorative: the steps say it in words.
const NODES = [
  { x: 40, y: 200, label: 'client' },
  { x: 150, y: 200, label: 'gateway' },
  { x: 270, y: 200, label: 'order' },
  { x: 270, y: 318, label: 'postgres' },
  { x: 500, y: 110, label: 'payment' },
  { x: 500, y: 200, label: 'inventory' },
  { x: 500, y: 290, label: 'shipping' },
];

// Node boxes are W wide, room for "inventory" at the drawing's type size.
const W = 80;
const EDGES = [
  'M80 200 H110',
  'M190 200 H230',
  'M270 222 V296',
  'M310 200 H385',
  'M385 110 V290',
  'M385 110 H460',
  'M385 200 H460',
  'M385 290 H460',
];
const BUS = 4;

// Ends at the payment node's edge, where the pulse fades instead of
// parking on the label.
const ROUTE = 'M84 200 H270 H385 V110 H460';

// Events written to the three partitions, as [lane x, y].
const EVENTS = [
  [377, 132],
  [385, 148],
  [393, 140],
  [377, 172],
  [385, 236],
  [393, 184],
  [377, 248],
  [385, 262],
  [393, 252],
];

const SPANS = [
  { name: 'gateway', from: 0, to: 100, tone: 'fill-accent/70' },
  { name: 'order-svc', from: 8, to: 40, tone: 'fill-accent/70' },
  { name: 'kafka publish', from: 20, to: 30, tone: 'fill-accent/70' },
  { name: 'payment-svc', from: 34, to: 58, tone: 'fill-destructive/80' },
  { name: 'inventory-svc', from: 62, to: 88, tone: 'fill-primary/80' },
];
const TRACK = { x: 150, width: 390 };
// The redelivered event and the order whose payment fails.
const DUPLICATE = 1045;
const FAILED = 1049;

// A label a line per clause: 'a, b' -> ['a,', 'b'].
const clauses = (text: string) => text.split(/(?<=,) /);

export default function SystemDiagram({
  className,
  finished = false,
}: {
  className?: string;
  /** Every layer shown: the story's still picture. */
  finished?: boolean;
}) {
  const msg = useTranslations('SystemStory');
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
      viewBox="0 62 560 382"
      aria-hidden
      data-diagram
      className={`font-mono text-[13px] ${finished ? 'system-finished' : ''} ${className ?? ''}`}
    >
      <text
        x="385"
        y="86"
        textAnchor="middle"
        className="system-kafka fill-muted-foreground"
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

      {/* 01 Events, not calls: the bus is a partitioned log the order is
          written to once. */}
      <g className="system-overlay" data-at="0">
        <text x="385" y="86" textAnchor="middle" className="fill-foreground">
          {msg('topic')} orders
        </text>
        <path
          d="M190 200 H230 M310 200 H385"
          fill="none"
          strokeWidth={2}
          className="stroke-accent"
        />
        {[377, 393].map((x) => (
          <path
            key={x}
            d={`M${x} 110 V290`}
            fill="none"
            strokeWidth={1.5}
            className="stroke-accent/60"
          />
        ))}
        {EVENTS.map(([x, y], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={2.5}
            className="system-event fill-accent"
            style={{ transitionDelay: `${index * 60}ms` }}
          />
        ))}
      </g>

      {NODES.map((node, index) => (
        <g
          key={node.label}
          className="system-edge"
          style={{ animationDelay: `${0.2 + index * 0.07}s` }}
        >
          <rect
            x={node.x - W / 2}
            y={node.y - 18}
            width={W}
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

      {/* 02 Safe to deliver twice: an event comes again and is skipped. */}
      <g className="system-overlay" data-at="1">
        <rect
          x="465"
          y="187"
          width={W}
          height="36"
          rx="10"
          fill="none"
          strokeDasharray="3 3"
          className="stroke-accent/50"
        />
        <rect
          x="460"
          y="182"
          width={W}
          height="36"
          rx="10"
          fill="none"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          className="stroke-accent"
        />
        {/* From just right of the lanes, a line per clause, so a longer
            translation never runs across them or off the drawing. */}
        <text x="404" y="240" className="fill-accent text-[12px]">
          <tspan x="404">#{DUPLICATE}</tspan>
          {clauses(msg('skipped')).map((line) => (
            <tspan key={line} x="404" dy="13">
              {line}
            </tspan>
          ))}
        </text>
      </g>

      {/* 03 Failure has a plan: payment fails, the saga gives the stock back. */}
      <g className="system-overlay" data-at="2">
        <rect
          x="460"
          y="92"
          width={W}
          height="36"
          rx="10"
          strokeWidth={2}
          className="fill-destructive/10 stroke-destructive"
        />
        <text
          x="500"
          y="80"
          textAnchor="middle"
          className="fill-destructive text-[12px]"
        >
          {msg('circuit')}
        </text>
        <path
          d="M460 122 H401 V194 H460"
          fill="none"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          className="stroke-primary"
        />
        <text x="405" y="155" className="fill-primary text-[12px]">
          {/* The event, then "(saga)" under it. */}
          {`← ${msg('compensation')}`.split(/ (?=\()/).map((line, index) => (
            <tspan key={line} x="405" dy={index ? 13 : 0}>
              {line}
            </tspan>
          ))}
        </text>
      </g>

      {/* 04 One trace, end to end. */}
      <g className="system-overlay" data-at="3">
        <text x="40" y="362" className="fill-muted-foreground text-[12px]">
          {msg('trace')} #{FAILED}
          {SEPARATOR}184 ms
        </text>
        {SPANS.map((span, index) => {
          const y = 372 + index * 15;
          return (
            <g key={span.name}>
              <text
                x="40"
                y={y + 6}
                className="fill-muted-foreground text-[12px]"
              >
                {span.name}
              </text>
              <rect
                x={TRACK.x}
                y={y}
                width={TRACK.width}
                height="6"
                rx="3"
                className="fill-foreground/5"
              />
              <rect
                x={TRACK.x + (span.from / 100) * TRACK.width}
                y={y}
                width={((span.to - span.from) / 100) * TRACK.width}
                height="6"
                rx="3"
                className={`system-bar ${span.tone}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              />
            </g>
          );
        })}
      </g>

      <g className="system-pulses">
        {pulse(10, 'fill-accent/20')}
        {pulse(4, 'fill-accent')}
      </g>
    </svg>
  );
}
