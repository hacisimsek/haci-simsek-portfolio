// After a client-side navigation started from an overlay (the terminal), put
// focus at the top of the new page instead of leaving it on <body>.
export function focusMainAfterNavigation(fromPath: string, timeout = 5000) {
  const started = performance.now();
  function check() {
    if (window.location.pathname !== fromPath) {
      requestAnimationFrame(() =>
        document.getElementById('main')?.focus({ preventScroll: true })
      );
      return;
    }
    if (performance.now() - started < timeout) requestAnimationFrame(check);
  }
  requestAnimationFrame(check);
}
