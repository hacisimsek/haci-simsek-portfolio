'use client';

import { useSyncExternalStore } from 'react';
import type { Locale } from '@/content';
import { formatClock } from '@/lib/clock';

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(timer);
}

const currentMinute = () => Math.floor(Date.now() / 60_000);
// The server can't know the visitor's "now"; it renders a placeholder that
// hydrates cleanly and the client fills in the time.
const noMinute = () => null;

export default function LocalTime({ locale }: { locale: Locale }) {
  const minute = useSyncExternalStore(subscribe, currentMinute, noMinute);
  if (minute === null) {
    return <span className="tabular-nums">--:--</span>;
  }
  const date = new Date(minute * 60_000);
  return (
    <time dateTime={date.toISOString()} className="tabular-nums">
      {formatClock(date, locale)}
    </time>
  );
}
