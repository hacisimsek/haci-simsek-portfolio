import { serializeJsonLd } from '@/lib/structured-data';

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // serializeJsonLd escapes "<", so the payload cannot close the tag.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
