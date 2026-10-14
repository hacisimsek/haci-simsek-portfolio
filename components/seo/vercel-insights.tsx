import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Outside Vercel builds next.config.ts aliases both packages to a stub that
// renders nothing; the /_vercel/insights endpoints exist only on Vercel.
export default function VercelInsights() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
