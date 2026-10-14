// index === entries.length means the prompt is on a fresh, empty line.
export type History = { entries: string[]; index: number };

export const emptyHistory: History = { entries: [], index: 0 };

export function push(history: History, command: string): History {
  const value = command.trim();
  const entries =
    !value || history.entries.at(-1) === value
      ? history.entries
      : [...history.entries, value];
  return { entries, index: entries.length };
}

export function up(history: History) {
  const index = Math.max(0, history.index - 1);
  return {
    history: { ...history, index },
    value: history.entries[index] ?? '',
  };
}

export function down(history: History) {
  const index = Math.min(history.entries.length, history.index + 1);
  return {
    history: { ...history, index },
    value: history.entries[index] ?? '',
  };
}
