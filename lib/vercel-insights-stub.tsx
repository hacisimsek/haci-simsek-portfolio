// Stand-in for @vercel/analytics/next and @vercel/speed-insights/next outside
// Vercel builds (see next.config.ts), so their client code is not bundled.
export function Analytics() {
  return null;
}

export function SpeedInsights() {
  return null;
}
