/**
 * The click-again rule for a permission pill, kept apart from the screen so it
 * can be checked on its own.
 *
 * One click arms a change and shows what it would do. A second click on the same
 * pill, after a short guard and before the window closes, confirms it. A
 * reflexive double-click lands inside the guard and is ignored, so it can never
 * confirm what the first click only proposed.
 */
export const CONFIRM_WINDOW_MS = 3000;
export const CONFIRM_GUARD_MS = 300;

export type ArmedPill = { id: string; key: string; at: number } | null;

export type PillClick = 'arm' | 'confirm' | 'ignore';

export function pillClick(
  armed: ArmedPill,
  target: { id: string; key: string },
  now: number,
): PillClick {
  const same = armed && armed.id === target.id && armed.key === target.key;
  if (!same) return 'arm';
  const waited = now - armed.at;
  if (waited < CONFIRM_GUARD_MS) return 'ignore';
  // Past the window the pill has already fallen back, so this is a fresh start.
  if (waited > CONFIRM_WINDOW_MS) return 'arm';
  return 'confirm';
}
