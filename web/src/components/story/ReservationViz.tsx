const W = 440
const H = 200
const mid = 100

export function ReservationViz() {
  const q = 4
  const tau = 1
  const gamma = 0.1
  const sigma = 2
  const kappa = 1.5
  const r = mid - q * gamma * sigma * sigma * tau
  const spr = gamma * sigma * sigma * tau + (2 / gamma) * Math.log(1 + gamma / kappa)
  const bid = r - spr / 2
  const ask = r + spr / 2
  const fxBid = mid - 0.75
  const fxAsk = mid + 0.75
  const x = (p: number) => 40 + ((p - 94) / 10) * 360
  return (
    <div className="teach-card">
      <h3 className="teach-card__title">Long inventory slides the whole quote down</h3>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="rv-title rv-desc">
        <title id="rv-title">Reservation price sits below the mid when inventory is long</title>
        <desc id="rv-desc">
          A price axis. The mid is in the center. A reservation mark sits left of the mid because
          the desk is long four units. Bid and ask wrap that reservation, so both sit lower than a
          fixed gap around the mid.
        </desc>
        <line x1={40} y1={90} x2={400} y2={90} stroke="var(--line-rule)" strokeWidth="1" />
        <Mark x={x(mid)} y={90} color="var(--fg-hi)" label="mid 100" />
        <Mark x={x(r)} y={90} color="var(--good)" label={`reservation ${r.toFixed(1)}`} />
        <Mark x={x(bid)} y={128} color="var(--accent)" label={`lean buy ${bid.toFixed(1)}`} />
        <Mark x={x(ask)} y={52} color="var(--accent)" label={`lean sell ${ask.toFixed(1)}`} />
        <line x1={x(fxBid)} y1={160} x2={x(fxAsk)} y2={160} stroke="var(--amber)" strokeWidth="3" className="bar-grow" />
        <text x={x(mid)} y={178} textAnchor="middle" fill="var(--amber)" fontSize="10">
          fixed gap {fxBid.toFixed(2)} – {fxAsk.toFixed(2)}
        </text>
      </svg>
      <p className="meta" style={{ margin: '0.5rem 0 0', textTransform: 'none', letterSpacing: 0 }}>
        Sketch at q = +4, start of the session. The formula has a name (Avellaneda–Stoikov). The
        picture is the point: both quotes move down so the long book can shrink.
      </p>
    </div>
  )
}

function Mark({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g className="path-node">
      <circle cx={x} cy={y} r="5" fill={color} />
      <text x={x} y={y - 12} textAnchor="middle" fill={color} fontSize="10" fontWeight="600">
        {label}
      </text>
    </g>
  )
}
