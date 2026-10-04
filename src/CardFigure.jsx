// Small diagrams for cards where a picture explains faster than a sentence.
// Each one is plain SVG on a 200x104 grid, drawn with the page's own colours.
const AXIS = 'var(--line-strong)'
const INK = 'var(--muted)'
const KEY = 'var(--accent)'
const WARN = 'var(--warn-mid)'

const axes = <g stroke={AXIS} strokeWidth="1"><path d="M22 88 H190" /><path d="M22 10 V88" /></g>

const FIGURES = {
  tree: {
    label: 'A profit tree splitting into revenue and cost, then price and volume',
    art: <g fill="none" stroke={AXIS}><rect x="76" y="6" width="48" height="18" rx="2" /><rect x="26" y="42" width="48" height="18" rx="2" /><rect x="126" y="42" width="48" height="18" rx="2" /><rect x="4" y="78" width="40" height="18" rx="2" /><rect x="56" y="78" width="40" height="18" rx="2" /><path d="M100 24 V33 H50 V42 M100 33 H150 V42 M50 60 V69 H24 V78 M50 69 H76 V78" /></g>,
    text: [[100, 19, 'Profit'], [50, 55, 'Revenue'], [150, 55, 'Cost'], [24, 91, 'Price'], [76, 91, 'Volume']],
  },
  scale: {
    label: 'Unit cost falling as volume rises',
    art: <g fill="none"><path d="M22 20 C70 20 90 74 190 78" stroke={KEY} strokeWidth="2" />{axes}</g>,
    text: [[104, 100, 'Volume'], [56, 16, 'Cost per unit']],
  },
  waterfall: {
    label: 'Revenue less costs leaving profit',
    art: <g>{axes}<rect x="32" y="24" width="30" height="64" fill={KEY} opacity=".85" /><rect x="74" y="24" width="30" height="30" fill={WARN} opacity=".7" /><rect x="116" y="54" width="30" height="20" fill={WARN} opacity=".45" /><rect x="158" y="74" width="26" height="14" fill={KEY} /></g>,
    text: [[47, 100, 'Sales'], [89, 100, 'Direct'], [131, 100, 'Fixed'], [171, 100, 'Profit']],
  },
  'cash-cycle': {
    label: 'Cash cycle from stock to receivables and back to cash',
    art: <g fill="none" stroke={AXIS}><circle cx="100" cy="49" r="34" strokeDasharray="4 4" /><circle cx="100" cy="15" r="9" fill="var(--surface)" stroke={KEY} /><circle cx="134" cy="49" r="9" fill="var(--surface)" stroke={KEY} /><circle cx="100" cy="83" r="9" fill="var(--surface)" stroke={KEY} /><circle cx="66" cy="49" r="9" fill="var(--surface)" stroke={KEY} /></g>,
    text: [[100, 6, 'Cash'], [163, 52, 'Stock'], [100, 100, 'Sales'], [34, 52, 'Owed']],
  },
  breakeven: {
    label: 'Revenue crossing total cost at the break-even volume',
    art: <g fill="none">{axes}<path d="M22 70 H190" stroke={AXIS} strokeDasharray="3 3" /><path d="M22 70 L190 30" stroke={WARN} strokeWidth="2" /><path d="M22 88 L190 14" stroke={KEY} strokeWidth="2" /><circle cx="108" cy="50" r="3.5" fill={KEY} stroke="none" /><path d="M108 50 V88" stroke={AXIS} strokeDasharray="3 3" /></g>,
    text: [[108, 100, 'Break-even'], [172, 10, 'Revenue'], [172, 26, 'Cost']],
  },
  timeline: {
    label: 'Future cash flows discounted back to today',
    art: <g fill="none">{axes}<path d="M60 88 V44 M100 88 V52 M140 88 V58 M180 88 V64" stroke={KEY} strokeWidth="2" /><path d="M60 40 C50 24 34 24 26 34" stroke={AXIS} strokeDasharray="3 3" /><path d="M26 34 l-3 -6 m3 6 l6 -2" stroke={AXIS} /></g>,
    text: [[26, 100, 'Today'], [60, 100, 'Yr 1'], [100, 100, 'Yr 2'], [140, 100, 'Yr 3'], [180, 100, 'Yr 4']],
  },
  spread: {
    label: 'Bid below ask, with the spread between them',
    art: <g>{<path d="M22 88 H190" stroke={AXIS} />}<rect x="40" y="36" width="46" height="18" rx="2" fill={KEY} opacity=".2" stroke={KEY} /><rect x="120" y="36" width="46" height="18" rx="2" fill={WARN} opacity=".2" stroke={WARN} /><path d="M92 45 H114" stroke={AXIS} strokeDasharray="3 3" /></g>,
    text: [[63, 32, 'Bid'], [143, 32, 'Ask'], [103, 70, 'Spread']],
  },
  payoff: {
    label: 'Call option payoff: flat loss, then rising profit above the strike',
    art: <g fill="none">{axes}<path d="M22 60 H110 L180 20" stroke={KEY} strokeWidth="2" /><path d="M22 48 H190" stroke={AXIS} strokeDasharray="3 3" /><path d="M110 60 V88" stroke={AXIS} strokeDasharray="3 3" /></g>,
    text: [[110, 100, 'Strike'], [56, 72, 'Premium lost'], [168, 14, 'Profit']],
  },
  drawdown: {
    label: 'An equity curve falling from a peak to a trough',
    art: <g fill="none">{axes}<path d="M22 70 C50 40 62 30 82 28 C104 26 116 70 132 74 C152 78 170 46 190 36" stroke={KEY} strokeWidth="2" /><path d="M82 28 V74" stroke={WARN} strokeDasharray="3 3" /><path d="M82 74 H132" stroke={WARN} strokeDasharray="3 3" /></g>,
    text: [[82, 20, 'Peak'], [140, 88, 'Trough']],
  },
  'yield-curve': {
    label: 'A normal upward sloping yield curve',
    art: <g fill="none">{axes}<path d="M22 74 C70 44 120 32 190 26" stroke={KEY} strokeWidth="2" /></g>,
    text: [[104, 100, 'Maturity'], [46, 16, 'Yield']],
  },
  normal: {
    label: 'A bell curve with one standard deviation either side of the mean',
    art: <g fill="none">{axes}<path d="M22 88 C60 88 62 20 106 20 C150 20 152 88 190 88" stroke={KEY} strokeWidth="2" /><path d="M78 88 V34 M134 88 V34" stroke={AXIS} strokeDasharray="3 3" /><path d="M106 88 V20" stroke={AXIS} /></g>,
    text: [[106, 100, 'Mean'], [72, 30, '-1 sd'], [142, 30, '+1 sd']],
  },
  skew: {
    label: 'A right skewed distribution where the mean sits above the median',
    art: <g fill="none">{axes}<path d="M22 88 C46 88 48 24 72 24 C104 24 120 78 190 86" stroke={KEY} strokeWidth="2" /><path d="M72 88 V30" stroke={AXIS} /><path d="M96 88 V44" stroke={WARN} strokeDasharray="3 3" /></g>,
    text: [[66, 100, 'Median'], [124, 100, 'Mean']],
  },
  scatter: {
    label: 'A scatter of points rising together',
    art: <g>{axes}<g fill={KEY}><circle cx="42" cy="76" r="3" /><circle cx="60" cy="66" r="3" /><circle cx="76" cy="70" r="3" /><circle cx="92" cy="54" r="3" /><circle cx="108" cy="58" r="3" /><circle cx="124" cy="40" r="3" /><circle cx="142" cy="44" r="3" /><circle cx="160" cy="28" r="3" /><circle cx="176" cy="32" r="3" /></g></g>,
    text: [],
  },
  regression: {
    label: 'A fitted line through scattered points',
    art: <g>{axes}<g fill={INK} opacity=".55"><circle cx="46" cy="74" r="3" /><circle cx="66" cy="60" r="3" /><circle cx="84" cy="68" r="3" /><circle cx="104" cy="50" r="3" /><circle cx="124" cy="52" r="3" /><circle cx="144" cy="36" r="3" /><circle cx="168" cy="30" r="3" /></g><path d="M34 78 L182 28" stroke={KEY} strokeWidth="2" fill="none" /></g>,
    text: [],
  },
  cohort: {
    label: 'Retention curves for two joining groups',
    art: <g fill="none">{axes}<path d="M22 22 C60 40 100 52 190 58" stroke={KEY} strokeWidth="2" /><path d="M22 22 C56 52 96 72 190 80" stroke={WARN} strokeWidth="2" strokeDasharray="4 3" /></g>,
    text: [[104, 100, 'Months since joining'], [50, 16, 'Still active']],
  },
  compounding: {
    label: 'Compound growth pulling away from straight-line growth',
    art: <g fill="none">{axes}<path d="M22 84 L190 44" stroke={AXIS} strokeDasharray="4 3" /><path d="M22 84 C90 82 140 60 190 14" stroke={KEY} strokeWidth="2" /></g>,
    text: [[160, 60, 'Simple'], [150, 12, 'Compound']],
  },
  bottleneck: {
    label: 'Three process steps where the middle one is slowest',
    art: <g fill="none" stroke={AXIS}><rect x="16" y="34" width="44" height="30" rx="2" /><rect x="78" y="34" width="44" height="30" rx="2" stroke={WARN} strokeWidth="2" /><rect x="140" y="34" width="44" height="30" rx="2" /><path d="M60 49 H78 M122 49 H140" /></g>,
    text: [[38, 53, '80/hr'], [100, 53, '50/hr'], [162, 53, '70/hr'], [100, 80, 'Line runs at 50']],
  },
  'supply-demand': {
    label: 'Supply and demand curves crossing at the market price',
    art: <g fill="none">{axes}<path d="M32 20 L180 82" stroke={WARN} strokeWidth="2" /><path d="M32 82 L180 20" stroke={KEY} strokeWidth="2" /><circle cx="106" cy="51" r="3.5" fill={KEY} stroke="none" /><path d="M106 51 H22 M106 51 V88" stroke={AXIS} strokeDasharray="3 3" /></g>,
    text: [[170, 14, 'Supply'], [170, 90, 'Demand'], [12, 48, 'P']],
  },
  funnel: {
    label: 'A purchase funnel narrowing from awareness to repeat',
    art: <g fill={KEY}><rect x="24" y="14" width="152" height="16" rx="2" opacity=".85" /><rect x="44" y="36" width="112" height="16" rx="2" opacity=".65" /><rect x="62" y="58" width="76" height="16" rx="2" opacity=".45" /><rect x="80" y="80" width="40" height="16" rx="2" opacity=".3" /></g>,
    text: [],
  },
}

export const FIGURE_KEYS = Object.keys(FIGURES)

export default function CardFigure({ name }) {
  const figure = FIGURES[name]
  if (!figure) return null
  return <svg className="card-figure" viewBox="0 0 200 104" role="img" aria-label={figure.label}>
    {figure.art}
    {figure.text.map(([x, y, label]) => <text key={label} x={x} y={y} textAnchor="middle" fontSize="9" fill={INK}>{label}</text>)}
  </svg>
}
