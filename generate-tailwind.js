// Generate Tailwind-compatible CSS for all classes used in this project
// Run with: node generate-tailwind.js > src/tailwind-generated.css

const colors = {
  'white': '#ffffff',
  'black': '#000000',
  'gray-300': '#d1d5db',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'red-400': '#f87171',
  'red-500': '#ef4444',
  'red-800': '#991b1b',
  'red-900': '#7f1d1d',
  'emerald-300': '#6ee7b7',
  'emerald-400': '#34d399',
  'emerald-500': '#10b981',
  'emerald-600': '#059669',
  'emerald-700': '#047857',
  'amber-300': '#fcd34d',
  'amber-400': '#fbbf24',
  'amber-500': '#f59e0b',
  'amber-600': '#d97706',
  'blue-300': '#93c5fd',
  'blue-400': '#60a5fa',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'green-300': '#86efac',
  'purple-500': '#a855f7',
  'purple-600': '#9333ea',
  'purple-900': '#581c87',
  'yellow-400': '#facc15',

  // Custom
  'gold': '#D4AF37',
  'gold-dark': '#B8960C',
  'gold-light': '#E8C84A',
  'felt': '#1a6b3c',
  'felt-dark': '#145a31',
  'felt-light': '#1e7d46',
  'casino-black': '#0a0a0f',
  'casino-slate': '#141420',
  'casino-card': '#1c1c2e',
  'casino-surface': '#1e1e30',
  'casino-border': 'rgba(255,255,255,0.08)',
  'chip-red': '#C41E3A',
  'chip-blue': '#1E5AA8',
  'chip-green': '#1B8C4F',
  'chip-black': '#1a1a2e',
  'chip-purple': '#7B2D8E',
  'chip-orange': '#D4712A',
  'chip-gold': '#D4AF37',
};

function hexToRgb(hex) {
  if (hex.startsWith('rgba')) return null;
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

function colorWithAlpha(name, alpha) {
  const c = colors[name];
  if (!c) return null;
  if (c.startsWith('rgba')) return c;
  const rgb = hexToRgb(c);
  if (!rgb) return null;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

const spacing = {
  '0': '0px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem',
  '2': '0.5rem', '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem',
  '4': '1rem', '5': '1.25rem', '6': '1.5rem', '8': '2rem',
  '10': '2.5rem', '12': '3rem', '14': '3.5rem', '16': '4rem',
  '20': '5rem', '40': '10rem', '48': '12rem',
  'px': '1px', 'auto': 'auto',
};

const css = [];

// Reset / base
css.push(`*, *::before, *::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: rgba(255,255,255,0.08); }`);
css.push(`html { line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }`);
css.push(`body { margin: 0; line-height: inherit; }`);
css.push(`h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }`);
css.push(`button, input, select, textarea { font-family: inherit; font-size: 100%; line-height: inherit; color: inherit; margin: 0; padding: 0; }`);
css.push(`button { cursor: pointer; background: transparent; }`);
css.push(`img, svg { display: block; max-width: 100%; }`);

// Layout
css.push(`.block { display: block; }`);
css.push(`.inline { display: inline; }`);
css.push(`.inline-block { display: inline-block; }`);
css.push(`.inline-flex { display: inline-flex; }`);
css.push(`.flex { display: flex; }`);
css.push(`.grid { display: grid; }`);
css.push(`.hidden { display: none; }`);

// Flex
css.push(`.flex-col { flex-direction: column; }`);
css.push(`.flex-wrap { flex-wrap: wrap; }`);
css.push(`.flex-1 { flex: 1 1 0%; }`);
css.push(`.flex-shrink-0 { flex-shrink: 0; }`);
css.push(`.items-center { align-items: center; }`);
css.push(`.items-end { align-items: flex-end; }`);
css.push(`.justify-center { justify-content: center; }`);
css.push(`.justify-between { justify-content: space-between; }`);

// Gap
for (const [k, v] of Object.entries(spacing)) {
  css.push(`.gap-${k.replace('.', '\\.')} { gap: ${v}; }`);
}

// Grid
css.push(`.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }`);
css.push(`.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }`);
css.push(`.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }`);

// Position
css.push(`.relative { position: relative; }`);
css.push(`.absolute { position: absolute; }`);
css.push(`.fixed { position: fixed; }`);

// Inset
css.push(`.inset-0 { inset: 0; }`);
css.push(`.top-0 { top: 0; }`);
css.push(`.top-4 { top: 1rem; }`);
css.push(`.top-16 { top: 4rem; }`);
css.push(`.bottom-0 { bottom: 0; }`);
css.push(`.bottom-2 { bottom: 0.5rem; }`);
css.push(`.left-4 { left: 1rem; }`);
css.push(`.left-1\\/2 { left: 50%; }`);

// Z-index
css.push(`.z-10 { z-index: 10; }`);
css.push(`.z-20 { z-index: 20; }`);
css.push(`.z-30 { z-index: 30; }`);
css.push(`.z-50 { z-index: 50; }`);

// Width & Height
for (const [k, v] of Object.entries(spacing)) {
  if (k === 'auto') continue;
  css.push(`.w-${k.replace('.', '\\.')} { width: ${v}; }`);
  css.push(`.h-${k.replace('.', '\\.')} { height: ${v}; }`);
}
css.push(`.w-full { width: 100%; }`);
css.push(`.h-full { height: 100%; }`);
css.push(`.w-px { width: 1px; }`);
css.push(`.w-\\[80\\%\\] { width: 80%; }`);
css.push(`.w-\\[140\\%\\] { width: 140%; }`);
css.push(`.max-w-xs { max-width: 20rem; }`);
css.push(`.min-h-\\[120px\\] { min-height: 120px; }`);

// Margin
for (const [k, v] of Object.entries(spacing)) {
  css.push(`.m-${k.replace('.', '\\.')} { margin: ${v}; }`);
  css.push(`.mx-${k.replace('.', '\\.')} { margin-left: ${v}; margin-right: ${v}; }`);
  css.push(`.my-${k.replace('.', '\\.')} { margin-top: ${v}; margin-bottom: ${v}; }`);
  css.push(`.mt-${k.replace('.', '\\.')} { margin-top: ${v}; }`);
  css.push(`.mb-${k.replace('.', '\\.')} { margin-bottom: ${v}; }`);
  css.push(`.ml-${k.replace('.', '\\.')} { margin-left: ${v}; }`);
  css.push(`.mr-${k.replace('.', '\\.')} { margin-right: ${v}; }`);
}
css.push(`.mx-auto { margin-left: auto; margin-right: auto; }`);
css.push(`.ml-auto { margin-left: auto; }`);
css.push(`.mt-auto { margin-top: auto; }`);

// Padding
for (const [k, v] of Object.entries(spacing)) {
  if (k === 'auto') continue;
  css.push(`.p-${k.replace('.', '\\.')} { padding: ${v}; }`);
  css.push(`.px-${k.replace('.', '\\.')} { padding-left: ${v}; padding-right: ${v}; }`);
  css.push(`.py-${k.replace('.', '\\.')} { padding-top: ${v}; padding-bottom: ${v}; }`);
  css.push(`.pt-${k.replace('.', '\\.')} { padding-top: ${v}; }`);
  css.push(`.pb-${k.replace('.', '\\.')} { padding-bottom: ${v}; }`);
  css.push(`.pr-${k.replace('.', '\\.')} { padding-right: ${v}; }`);
}
css.push(`.p-\\[3px\\] { padding: 3px; }`);

// Typography
css.push(`.text-\\[9px\\] { font-size: 9px; line-height: 1.2; }`);
css.push(`.text-\\[10px\\] { font-size: 10px; line-height: 1.2; }`);
css.push(`.text-\\[11px\\] { font-size: 11px; line-height: 1.3; }`);
css.push(`.text-\\[15px\\] { font-size: 15px; line-height: 1.4; }`);
css.push(`.text-xs { font-size: 0.75rem; line-height: 1rem; }`);
css.push(`.text-sm { font-size: 0.875rem; line-height: 1.25rem; }`);
css.push(`.text-base { font-size: 1rem; line-height: 1.5rem; }`);
css.push(`.text-lg { font-size: 1.125rem; line-height: 1.75rem; }`);
css.push(`.text-xl { font-size: 1.25rem; line-height: 1.75rem; }`);
css.push(`.text-2xl { font-size: 1.5rem; line-height: 2rem; }`);
css.push(`.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }`);
css.push(`.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }`);

css.push(`.font-normal { font-weight: 400; }`);
css.push(`.font-medium { font-weight: 500; }`);
css.push(`.font-semibold { font-weight: 600; }`);
css.push(`.font-bold { font-weight: 700; }`);

css.push(`.leading-none { line-height: 1; }`);
css.push(`.leading-relaxed { line-height: 1.625; }`);
css.push(`.tracking-tight { letter-spacing: -0.025em; }`);
css.push(`.tracking-wide { letter-spacing: 0.025em; }`);
css.push(`.tracking-wider { letter-spacing: 0.05em; }`);
css.push(`.tracking-widest { letter-spacing: 0.1em; }`);
css.push(`.uppercase { text-transform: uppercase; }`);
css.push(`.text-center { text-align: center; }`);
css.push(`.text-left { text-align: left; }`);
css.push(`.tabular-nums { font-variant-numeric: tabular-nums; }`);
css.push(`.whitespace-nowrap { white-space: nowrap; }`);

// Text colors
for (const [name, value] of Object.entries(colors)) {
  css.push(`.text-${name} { color: ${value}; }`);
}
// Text with opacity
css.push(`.text-white\\/30 { color: rgba(255,255,255,0.3); }`);
css.push(`.text-white\\/50 { color: rgba(255,255,255,0.5); }`);
css.push(`.text-white\\/90 { color: rgba(255,255,255,0.9); }`);
css.push(`.text-\\[\\#C41E3A\\] { color: #C41E3A; }`);
css.push(`.text-\\[\\#1a1a2e\\] { color: #1a1a2e; }`);

// Background colors
for (const [name, value] of Object.entries(colors)) {
  css.push(`.bg-${name} { background-color: ${value}; }`);
}

// BG with opacity
const bgOpacities = [
  ['black/30', '0,0,0', '0.3'], ['black/70', '0,0,0', '0.7'],
  ['white/5', '255,255,255', '0.05'], ['white/10', '255,255,255', '0.1'],
  ['emerald-500/15', '16,185,129', '0.15'], ['emerald-500/20', '16,185,129', '0.2'],
  ['emerald-500/30', '16,185,129', '0.3'], ['emerald-500/60', '16,185,129', '0.6'],
  ['emerald-600/60', '5,150,105', '0.6'], ['emerald-600/80', '5,150,105', '0.8'],
  ['red-500/15', '239,68,68', '0.15'], ['red-500/20', '239,68,68', '0.2'],
  ['red-500/30', '239,68,68', '0.3'],
  ['red-900/20', '127,29,29', '0.2'],
  ['amber-500/15', '245,158,11', '0.15'], ['amber-500/20', '245,158,11', '0.2'],
  ['blue-500/15', '59,130,246', '0.15'],
  ['purple-900/10', '88,28,135', '0.1'],
  ['gold/20', '212,175,55', '0.2'],
  ['gray-800/50', '31,41,55', '0.5'],
];
for (const [n, rgb, a] of bgOpacities) {
  css.push(`.bg-${n.replace('/', '\\/')} { background-color: rgba(${rgb}, ${a}); }`);
}

// Gradient backgrounds
css.push(`.bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }`);
css.push(`.from-casino-black { --tw-gradient-from: #0a0a0f; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }`);
css.push(`.from-amber-500 { --tw-gradient-from: #f59e0b; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }`);
css.push(`.via-casino-slate { --tw-gradient-stops: var(--tw-gradient-from), #141420, var(--tw-gradient-to, transparent); }`);
css.push(`.to-casino-black { --tw-gradient-to: #0a0a0f; }`);
css.push(`.to-casino-slate { --tw-gradient-to: #141420; }`);
css.push(`.to-amber-600 { --tw-gradient-to: #d97706; }`);
css.push(`.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }`);

// Border
css.push(`.border { border-width: 1px; }`);
css.push(`.border-2 { border-width: 2px; }`);
css.push(`.border-t { border-top-width: 1px; }`);
css.push(`.border-b-2 { border-bottom-width: 2px; }`);
// Border colors
css.push(`.border-white\\/5 { border-color: rgba(255,255,255,0.05); }`);
css.push(`.border-white\\/10 { border-color: rgba(255,255,255,0.1); }`);
css.push(`.border-amber-400\\/20 { border-color: rgba(251,191,36,0.2); }`);
css.push(`.border-amber-500\\/20 { border-color: rgba(245,158,11,0.2); }`);
css.push(`.border-emerald-500\\/20 { border-color: rgba(16,185,129,0.2); }`);
css.push(`.border-emerald-500\\/30 { border-color: rgba(16,185,129,0.3); }`);
css.push(`.border-emerald-600\\/30 { border-color: rgba(5,150,105,0.3); }`);
css.push(`.border-emerald-700\\/30 { border-color: rgba(4,120,87,0.3); }`);
css.push(`.border-red-500\\/20 { border-color: rgba(239,68,68,0.2); }`);
css.push(`.border-red-500\\/30 { border-color: rgba(239,68,68,0.3); }`);
css.push(`.border-red-800\\/20 { border-color: rgba(153,27,27,0.2); }`);
css.push(`.border-blue-500\\/20 { border-color: rgba(59,130,246,0.2); }`);
css.push(`.border-gray-700\\/30 { border-color: rgba(55,65,81,0.3); }`);
css.push(`.border-gold\\/30 { border-color: rgba(212,175,55,0.3); }`);

// Border radius
css.push(`.rounded-full { border-radius: 9999px; }`);
css.push(`.rounded-lg { border-radius: 0.5rem; }`);
css.push(`.rounded-xl { border-radius: 0.75rem; }`);
css.push(`.rounded-2xl { border-radius: 1rem; }`);
css.push(`.rounded-3xl { border-radius: 1.5rem; }`);
css.push(`.rounded-t-md { border-top-left-radius: 0.375rem; border-top-right-radius: 0.375rem; }`);
css.push(`.rounded-t-\\[50\\%\\] { border-top-left-radius: 50%; border-top-right-radius: 50%; }`);
css.push(`.rounded-b-\\[50\\%\\] { border-bottom-left-radius: 50%; border-bottom-right-radius: 50%; }`);

// Shadow
css.push(`.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); }`);
css.push(`.shadow-md { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }`);
css.push(`.shadow-glow-gold { box-shadow: 0 0 15px rgba(212,175,55,0.3); }`);
css.push(`.shadow-glow-green { box-shadow: 0 0 15px rgba(16,185,129,0.3); }`);
css.push(`.shadow-glow-blue { box-shadow: 0 0 15px rgba(59,130,246,0.3); }`);

// Opacity
css.push(`.opacity-30 { opacity: 0.3; }`);
css.push(`.opacity-40 { opacity: 0.4; }`);
css.push(`.opacity-50 { opacity: 0.5; }`);
css.push(`.opacity-70 { opacity: 0.7; }`);

// Overflow
css.push(`.overflow-hidden { overflow: hidden; }`);
css.push(`.overflow-x-auto { overflow-x: auto; }`);
css.push(`.overflow-y-auto { overflow-y: auto; }`);

// Transform
css.push(`.transform { transform: var(--tw-transform); }`);
css.push(`.rotate-180 { transform: rotate(180deg); }`);
css.push(`.-rotate-90 { transform: rotate(-90deg); }`);
css.push(`.-translate-x-1\\/2 { transform: translateX(-50%); }`);
css.push(`.-translate-y-20 { transform: translateY(-5rem); }`);
css.push(`.scale-105 { transform: scale(1.05); }`);
css.push(`.scale-110 { transform: scale(1.1); }`);

// Transition
css.push(`.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms; }`);
css.push(`.transition-colors { transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms; }`);
css.push(`.transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms; }`);
css.push(`.transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms; }`);
css.push(`.duration-200 { transition-duration: 200ms; }`);
css.push(`.duration-300 { transition-duration: 300ms; }`);
css.push(`.duration-500 { transition-duration: 500ms; }`);
css.push(`.duration-700 { transition-duration: 700ms; }`);

// Misc
css.push(`.select-none { user-select: none; -webkit-user-select: none; }`);
css.push(`.pointer-events-none { pointer-events: none; }`);
css.push(`.cursor-not-allowed { cursor: not-allowed; }`);
css.push(`.accent-emerald-500 { accent-color: #10b981; }`);

// Space-y
css.push(`.space-y-2\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.625rem; }`);
css.push(`.space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }`);
css.push(`.space-y-5 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.25rem; }`);

// Active variants
css.push(`.active\\:scale-95:active { transform: scale(0.95); }`);
css.push(`.active\\:scale-\\[0\\.96\\]:active { transform: scale(0.96); }`);
css.push(`.active\\:scale-\\[0\\.98\\]:active { transform: scale(0.98); }`);
css.push(`.active\\:bg-white\\/10:active { background-color: rgba(255,255,255,0.1); }`);
css.push(`.active\\:text-white:active { color: #ffffff; }`);
css.push(`.active\\:text-gray-300:active { color: #d1d5db; }`);
css.push(`.active\\:text-blue-300:active { color: #93c5fd; }`);
css.push(`.active\\:brightness-90:active { filter: brightness(0.9); }`);

// Animations (matching tailwind.config.js)
css.push(`
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes flipCard { 0% { transform: rotateY(180deg); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: rotateY(0); opacity: 1; } }
@keyframes chipBounce { 0% { transform: scale(0.8) translateY(10px); opacity: 0; } 60% { transform: scale(1.05) translateY(-2px); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
@keyframes countPulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
@keyframes shimmer { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes screenEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 5px rgba(212,175,55,0.3); } 50% { box-shadow: 0 0 20px rgba(212,175,55,0.6); } }
@keyframes dealCard { from { opacity: 0; transform: translateY(-40px) scale(0.8); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes popIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes barFill { from { width: 0%; } }
@keyframes pulse { 50% { opacity: .5; } }
`);

css.push(`.animate-fade-in { animation: fadeIn 0.3s ease-out; }`);
css.push(`.animate-slide-up { animation: slideUp 0.3s ease-out; }`);
css.push(`.animate-slide-down { animation: slideDown 0.3s ease-out; }`);
css.push(`.animate-flip-card { animation: flipCard 0.4s ease-in-out; }`);
css.push(`.animate-chip-bounce { animation: chipBounce 0.4s ease-out; }`);
css.push(`.animate-count-pulse { animation: countPulse 0.3s ease-out; }`);
css.push(`.animate-shimmer { animation: shimmer 2s ease-in-out infinite; }`);
css.push(`.animate-screen-enter { animation: screenEnter 0.25s ease-out; }`);
css.push(`.animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }`);
css.push(`.animate-deal-card { animation: dealCard 0.3s ease-out; }`);
css.push(`.animate-pop-in { animation: popIn 0.2s ease-out; }`);
css.push(`.animate-bar-fill { animation: barFill 0.6s ease-out; }`);
css.push(`.animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }`);

console.log(css.join('\n'));
