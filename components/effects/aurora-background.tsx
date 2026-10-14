// Four slowly drifting colour fields behind the page. Pure CSS: transforms
// only, no blur filter, and static when the visitor prefers reduced motion.
export default function AuroraBackground() {
  return (
    <div data-aurora aria-hidden="true" className="aurora">
      <span data-blob className="aurora-blob aurora-blob-1" />
      <span data-blob className="aurora-blob aurora-blob-2" />
      <span data-blob className="aurora-blob aurora-blob-3" />
      <span data-blob className="aurora-blob aurora-blob-4" />
    </div>
  );
}
