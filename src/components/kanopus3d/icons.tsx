// Thin single-colour line icons, the same style as the About page's feature icons.
const PATHS = {
  shield: 'M12 2 4 5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z M9 12l2 2 4-4',
  pin: 'M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z M12 12a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  calendar: 'M4 6h16v15H4Z M4 11h16 M8 3v5 M16 3v5',
  users: 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M2 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5 M18 8a3 3 0 1 0 0-6 M17 12c2.5 0 5 2 5 5.5',
  coin: 'M12 3v2.5 M12 18.5V21 M8 7.5c0-1.7 1.7-2.8 4-2.8s4 1.1 4 2.8-1.7 2.3-4 2.3-4 .6-4 2.3 1.7 2.9 4 2.9 4-1.1 4-2.9',
  lamp: 'M12 3a4 4 0 0 1 4 4c0 2-1.5 3-2 4h-4c-.5-1-2-2-2-4a4 4 0 0 1 4-4Z M10 14h4 M12 14v7 M9 21h6',
  arch: 'M5 21V10a7 7 0 0 1 14 0v11 M9 21v-8a3 3 0 0 1 6 0v8',
  tree: 'M12 21v-5 M12 3l5 7h-3l4 6H6l4-6H7Z',
  play: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M10 8.5l5 3.5-5 3.5Z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  water: 'M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0 M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0',
  key: 'M8 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M12 12h9 M18 12v3 M21 12v2',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7v5l3 2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  phone: 'M6.5 3h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 5a2 2 0 0 1 2-2Z',
  chat: 'M4 5h16v11H9l-5 4Z',
  arrow: 'M7 17L17 7 M9 7h8v8',
  layers: 'm12 3 9 4.8-9 4.8-9-4.8L12 3Z M3 13l9 4.8 9-4.8 M3 17.4l9 4.8 9-4.8',
} as const

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 28, color = '#004385', stroke = 1.4 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}
