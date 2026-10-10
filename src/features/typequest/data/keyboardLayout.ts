import { FingerName, KeyDefinition } from '../types';

export const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1: Numbers
  [
    { key: '`', shiftKey: '~', code: 'Backquote', finger: 'left-pinky' },
    { key: '1', shiftKey: '!', code: 'Digit1', finger: 'left-pinky' },
    { key: '2', shiftKey: '@', code: 'Digit2', finger: 'left-ring' },
    { key: '3', shiftKey: '#', code: 'Digit3', finger: 'left-middle' },
    { key: '4', shiftKey: '$', code: 'Digit4', finger: 'left-index' },
    { key: '5', shiftKey: '%', code: 'Digit5', finger: 'left-index' },
    { key: '6', shiftKey: '^', code: 'Digit6', finger: 'right-index' },
    { key: '7', shiftKey: '&', code: 'Digit7', finger: 'right-index' },
    { key: '8', shiftKey: '*', code: 'Digit8', finger: 'right-middle' },
    { key: '9', shiftKey: '(', code: 'Digit9', finger: 'right-ring' },
    { key: '0', shiftKey: ')', code: 'Digit0', finger: 'right-pinky' },
    { key: '-', shiftKey: '_', code: 'Minus', finger: 'right-pinky' },
    { key: '=', shiftKey: '+', code: 'Equal', finger: 'right-pinky' },
    { key: 'Backspace', code: 'Backspace', finger: 'right-pinky', width: 'w-16 sm:w-20' },
  ],
  // Row 2: Top / QWERTY
  [
    { key: 'Tab', code: 'Tab', finger: 'left-pinky', width: 'w-14 sm:w-16' },
    { key: 'q', shiftKey: 'Q', code: 'KeyQ', finger: 'left-pinky' },
    { key: 'w', shiftKey: 'W', code: 'KeyW', finger: 'left-ring' },
    { key: 'e', shiftKey: 'E', code: 'KeyE', finger: 'left-middle' },
    { key: 'r', shiftKey: 'R', code: 'KeyR', finger: 'left-index' },
    { key: 't', shiftKey: 'T', code: 'KeyT', finger: 'left-index' },
    { key: 'y', shiftKey: 'Y', code: 'KeyY', finger: 'right-index' },
    { key: 'u', shiftKey: 'U', code: 'KeyU', finger: 'right-index' },
    { key: 'i', shiftKey: 'I', code: 'KeyI', finger: 'right-middle' },
    { key: 'o', shiftKey: 'O', code: 'KeyO', finger: 'right-ring' },
    { key: 'p', shiftKey: 'P', code: 'KeyP', finger: 'right-pinky' },
    { key: '[', shiftKey: '{', code: 'BracketLeft', finger: 'right-pinky' },
    { key: ']', shiftKey: '}', code: 'BracketRight', finger: 'right-pinky' },
    { key: '\\', shiftKey: '|', code: 'Backslash', finger: 'right-pinky', width: 'w-12 sm:w-14' },
  ],
  // Row 3: Home Row
  [
    { key: 'Caps', code: 'CapsLock', finger: 'left-pinky', width: 'w-16 sm:w-18' },
    { key: 'a', shiftKey: 'A', code: 'KeyA', finger: 'left-pinky' },
    { key: 's', shiftKey: 'S', code: 'KeyS', finger: 'left-ring' },
    { key: 'd', shiftKey: 'D', code: 'KeyD', finger: 'left-middle' },
    { key: 'f', shiftKey: 'F', code: 'KeyF', finger: 'left-index' },
    { key: 'g', shiftKey: 'G', code: 'KeyG', finger: 'left-index' },
    { key: 'h', shiftKey: 'H', code: 'KeyH', finger: 'right-index' },
    { key: 'j', shiftKey: 'J', code: 'KeyJ', finger: 'right-index' },
    { key: 'k', shiftKey: 'K', code: 'KeyK', finger: 'right-middle' },
    { key: 'l', shiftKey: 'L', code: 'KeyL', finger: 'right-ring' },
    { key: ';', shiftKey: ':', code: 'Semicolon', finger: 'right-pinky' },
    { key: "'", shiftKey: '"', code: 'Quote', finger: 'right-pinky' },
    { key: 'Enter', code: 'Enter', finger: 'right-pinky', width: 'w-16 sm:w-20' },
  ],
  // Row 4: Bottom Row
  [
    { key: 'Shift', code: 'ShiftLeft', finger: 'left-pinky', width: 'w-20 sm:w-24' },
    { key: 'z', shiftKey: 'Z', code: 'KeyZ', finger: 'left-pinky' },
    { key: 'x', shiftKey: 'X', code: 'KeyX', finger: 'left-ring' },
    { key: 'c', shiftKey: 'C', code: 'KeyC', finger: 'left-middle' },
    { key: 'v', shiftKey: 'V', code: 'KeyV', finger: 'left-index' },
    { key: 'b', shiftKey: 'B', code: 'KeyB', finger: 'left-index' },
    { key: 'n', shiftKey: 'N', code: 'KeyN', finger: 'right-index' },
    { key: 'm', shiftKey: 'M', code: 'KeyM', finger: 'right-index' },
    { key: ',', shiftKey: '<', code: 'Comma', finger: 'right-middle' },
    { key: '.', shiftKey: '>', code: 'Period', finger: 'right-ring' },
    { key: '/', shiftKey: '?', code: 'Slash', finger: 'right-pinky' },
    { key: 'Shift', code: 'ShiftRight', finger: 'right-pinky', width: 'w-20 sm:w-24' },
  ],
  // Row 5: Space Bar & Modifiers
  [
    { key: 'Ctrl', code: 'ControlLeft', finger: 'left-pinky', width: 'w-12 sm:w-14' },
    { key: 'Alt', code: 'AltLeft', finger: 'thumb', width: 'w-12 sm:w-14' },
    { key: ' ', code: 'Space', finger: 'thumb', width: 'flex-1 max-w-sm sm:max-w-md' },
    { key: 'Alt', code: 'AltRight', finger: 'thumb', width: 'w-12 sm:w-14' },
    { key: 'Ctrl', code: 'ControlRight', finger: 'right-pinky', width: 'w-12 sm:w-14' },
  ],
];

export const FINGER_INFO: Record<
  FingerName,
  { label: string; hand: 'Left' | 'Right'; color: string; bgClass: string; textClass: string; borderClass: string }
> = {
  'left-pinky': {
    label: 'Left Pinky',
    hand: 'Left',
    color: '#EC4899', // Pink
    bgClass: 'bg-pink-500/15',
    textClass: 'text-pink-600 dark:text-pink-400',
    borderClass: 'border-pink-500/30',
  },
  'left-ring': {
    label: 'Left Ring',
    hand: 'Left',
    color: '#8B5CF6', // Purple
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-500/30',
  },
  'left-middle': {
    label: 'Left Middle',
    hand: 'Left',
    color: '#3B82F6', // Blue
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-500/30',
  },
  'left-index': {
    label: 'Left Index',
    hand: 'Left',
    color: '#10B981', // Emerald
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  thumb: {
    label: 'Both Thumbs (Spacebar)',
    hand: 'Left',
    color: '#F59E0B', // Amber
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  'right-index': {
    label: 'Right Index',
    hand: 'Right',
    color: '#06B6D4', // Cyan
    bgClass: 'bg-cyan-500/15',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    borderClass: 'border-cyan-500/30',
  },
  'right-middle': {
    label: 'Right Middle',
    hand: 'Right',
    color: '#3B82F6', // Blue
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-500/30',
  },
  'right-ring': {
    label: 'Right Ring',
    hand: 'Right',
    color: '#8B5CF6', // Purple
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-500/30',
  },
  'right-pinky': {
    label: 'Right Pinky',
    hand: 'Right',
    color: '#EC4899', // Pink
    bgClass: 'bg-pink-500/15',
    textClass: 'text-pink-600 dark:text-pink-400',
    borderClass: 'border-pink-500/30',
  },
};

export function findFingerForChar(char: string): FingerName | null {
  if (!char) return null;
  if (char === ' ') return 'thumb';

  const lower = char.toLowerCase();
  for (const row of KEYBOARD_ROWS) {
    for (const keyDef of row) {
      if (
        keyDef.key.toLowerCase() === lower ||
        (keyDef.shiftKey && keyDef.shiftKey === char)
      ) {
        return keyDef.finger;
      }
    }
  }
  return null;
}
