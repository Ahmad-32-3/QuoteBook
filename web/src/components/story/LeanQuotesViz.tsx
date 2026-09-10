const W = 440
const H = 210

export function LeanQuotesViz() {
  return (
    <div className="teach-card">
      <h3 className="teach-card__title">Same mid. Two ways to quote it.</h3>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="lq-title lq-desc">
        <title id="lq-title">Fixed quotes stay centered on the mid while inventory grows; leaning quotes shift down</title>
        <desc id="lq-desc">
          Two panels. Top: a buy and sell price stay equally far from the mid as a pile of leftover
          stock grows. Bottom: both prices slide down as that pile grows, so selling gets easier.
        </desc>
        <Panel y={8} label="Fixed gap" lean={false} delay="0s" />
        <Panel y={112} label="Lean when long" lean delay="0.35s" />
      </svg>
      <ul className="legend">
        <li>
          <span className="swatch" style={{ background: 'var(--fg-hi)' }} />
          mid
        </li>
        <li>
          <span className="swatch" style={{ background: 'var(--accent)' }} />
          bid / ask
        </li>
        <li>
          <span className="swatch" style={{ background: 'var(--amber)' }} />
          leftover inventory
        </li>
      </ul>
    </div>
  )
}

function Panel({
  y,
  label,
  lean,
  delay,
}: {
  y: number
  label: string
  lean: boolean
  delay: string
}) {
  const midY = y + 42
  const shift = lean ? 18 : 0
  const bidY = midY + 14 + shift
  const askY = midY - 14 + shift
  const qH = lean ? 22 : 46
  return (
    <g>
      <text x={12} y={y + 12} fill="var(--fg-low)" fontSize="11">
        {label}
      </text>
      <line x1={36} y1={midY} x2={300} y2={midY} stroke="var(--fg-hi)" strokeWidth="1.6" />
      <line
        className="draw-line"
        x1={36}
        y1={askY}
        x2={300}
        y2={askY}
        stroke="var(--accent)"
        strokeWidth="2"
        pathLength={1}
        style={{ animationDelay: delay }}
      />
      <line
        className="draw-line"
        x1={36}
        y1={bidY}
        x2={300}
        y2={bidY}
        stroke="var(--accent)"
        strokeWidth="2"
        pathLength={1}
        style={{ animationDelay: delay }}
      />
      <text x={306} y={askY + 4} fill="var(--accent-bright)" fontSize="10">
        sell
      </text>
      <text x={306} y={bidY + 4} fill="var(--accent-bright)" fontSize="10">
        buy
      </text>
      <rect
        className="bar-grow"
        x={360}
        y={y + 72 - qH}
        width={42}
        height={qH}
        fill="var(--amber)"
        opacity="0.85"
        style={{ animationDelay: delay }}
      />
      <text x={381} y={y + 88} textAnchor="middle" fill="var(--fg-low)" fontSize="10">
        {lean ? 'small pile' : 'big pile'}
      </text>
    </g>
  )
}
