import { ABLATION, PROTOCOL } from '../../data'

export function AblationGridViz() {
  const kappas = [0.5, 1.5, 3.0]
  const gammas = [0.01, 0.1, 0.5]
  return (
    <div className="teach-card">
      <h3 className="teach-card__title">How often leaning wins, if I turn the two knobs</h3>
      <table className="choice-table">
        <caption className="sr-only">
          Success percent for each pair of risk aversion and arrival decay
        </caption>
        <thead>
          <tr>
            <th scope="col">lean hard? (γ) \ fill decay (κ)</th>
            {kappas.map((k) => (
              <th key={k} scope="col">
                κ {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gammas.map((g) => (
            <tr key={g}>
              <th scope="row">γ {g}</th>
              {kappas.map((k) => {
                const cell = ABLATION.find((r) => r.gamma === g && r.kappa === k)
                const pct = cell?.successPct ?? 0
                const isDefault = g === PROTOCOL.gamma && k === PROTOCOL.kappa
                const color = pct >= 85 ? 'var(--good)' : 'var(--amber)'
                return (
                  <td key={k} style={{ color, fontWeight: isDefault ? 600 : 400 }}>
                    {pct.toFixed(1)}%{isDefault ? ' · locked' : ''}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="meta" style={{ margin: '0.75rem 0 0', textTransform: 'none', letterSpacing: 0 }}>
        Locked pair is the usual paper values (γ=0.1, κ=1.5). Weak lean at the same fill decay drops
        under the 85% floor. Easy fills (small κ) make leaning even more useful.
      </p>
    </div>
  )
}
