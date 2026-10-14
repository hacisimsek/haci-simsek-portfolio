import { Fragment } from 'react';

// Renders **bold** markers from content strings. An unmatched marker is kept
// as literal text.
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        /^\*\*[^*]+\*\*$/.test(part) ? (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}
