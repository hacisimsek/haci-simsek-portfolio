export const TERMINAL_OPEN_EVENT = 'terminal:open';

// Anything can open the terminal without importing it: the palette, the 404
// page, future buttons.
export function openTerminal() {
  window.dispatchEvent(new Event(TERMINAL_OPEN_EVENT));
}
