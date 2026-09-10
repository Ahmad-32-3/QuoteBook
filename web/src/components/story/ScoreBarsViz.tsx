import { RESULT } from '../../data'

const W = 440
const H = 168

export function ScoreBarsViz() {
  const maxScore = Math.max(RESULT.meanScoreAs, RESULT.meanScoreFixed, 1)
  const asW = 24 + (RESULT.meanScoreAs / maxScore) * 300
  const fxW = 24 + (Math.max(RESULT.meanScoreFixed, 0) / maxScore) * 300
  const qMax = Math.max(RESULT.meanAbsQAs, RESULT.meanAbsQFixed)
  const asQ = (RESULT.meanAbsQAs / qMax) * 300
  const fxQ = (RESULT.meanAbsQFixed / qMax) * 300
  return (
    <div className="teach-card">
      <h3 className="teach-card__title">Leaning wins the score, not the raw cash</h3>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="sb-title sb-desc">
        <title id="sb-title">Risk-adjusted score and leftover inventory for leaning quotes versus a fixed gap</title>
        <desc id="sb-desc">
          Two pairs of bars. The leaning quotes have a much higher risk-adjusted score and finish
          with less leftover inventory. The fixed gap keeps more leftover stock.
        </desc>
        <text x={12} y={22} fill="var(--fg-low)" fontSize="11">
          risk-adjusted score
        </text>
        <rect className="bar-grow" x={12} y={30} width={asW} height={18} fill="var(--good)" />
        <text x={asW + 18} y={44} fill="var(--good)" fontSize="11">
          lean {RESULT.meanScoreAs.toFixed(1)}
        </text>
        <rect className="bar-grow" x={12} y={54} width={fxW} height={18} fill="var(--amber)" style={{ animationDelay: '0.15s' }} />
        <text x={fxW + 18} y={68} fill="var(--amber)" fontSize="11">
          fixed {RESULT.meanScoreFixed.toFixed(1)}
        </text>
        <text x={12} y={100} fill="var(--fg-low)" fontSize="11">
          leftover |inventory|
        </text>
        <rect className="bar-grow" x={12} y={108} width={asQ} height={18} fill="var(--good)" style={{ animationDelay: '0.25s' }} />
        <text x={asQ + 18} y={122} fill="var(--good)" fontSize="11">
          lean {RESULT.meanAbsQAs.toFixed(1)}
        </text>
        <rect className="bar-grow" x={12} y={132} width={fxQ} height={18} fill="var(--amber)" style={{ animationDelay: '0.35s' }} />
        <text x={fxQ + 18} y={146} fill="var(--amber)" fontSize="11">
          fixed {RESULT.meanAbsQFixed.toFixed(1)}
        </text>
      </svg>
      <dl className="stat-grid" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
        <div>
          <dt>paths leaning wins</dt>
          <dd className="stat-ok">{RESULT.successPct}%</dd>
        </div>
        <div>
          <dt>fixed-spread baseline</dt>
          <dd>{(100 - RESULT.successPct).toFixed(1)}%</dd>
        </div>
      </dl>
    </div>
  )
}
