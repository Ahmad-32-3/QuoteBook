type Tool = {
  name: string
  tag: string
  plain: string
  tech: string
}

const TOOLS: Tool[] = [
  {
    name: 'Python + numpy',
    tag: 'sim',
    plain: 'Builds the fake market: a wandering midprice and random arrivals that hit my quotes.',
    tech: 'Vectorized Brownian mids and Poisson fills across 400 paths. Quotes at each step see only the current mid and inventory.',
  },
  {
    name: 'Reservation quotes',
    tag: 'model',
    plain: 'When I am long I slide both prices down so it is easier to sell and harder to buy.',
    tech: 'Avellaneda–Stoikov reservation r = s − q γ σ² (T−t), plus a closed-form spread. Bid and ask sit around r, not around the mid.',
  },
  {
    name: 'Fixed-spread baseline',
    tag: 'compare',
    plain: 'The naive desk: the same gap above and below the mid, no matter how lopsided the book is.',
    tech: 'Bid = mid − 0.75, ask = mid + 0.75. Same Brownian paths and the same arrival draws as the leaning quotes.',
  },
  {
    name: 'pytest',
    tag: 'check',
    plain: 'Stops two cheats: peeking at a future mid, and letting inventory grow past the cap.',
    tech: 'Injection tests: a quote function that reads mids[-1] must raise, and |q| > 10 must raise.',
  },
  {
    name: 'Vite + React + Tailwind',
    tag: 'page',
    plain: 'This walkthrough. The numbers are baked into one file so the page does not call a server.',
    tech: 'Static data.ts. Hand SVG charts on the editorial tokens. No HTTP, no Redis, no auth.',
  },
]

export function StackGrid() {
  return (
    <ul className="stack-grid">
      {TOOLS.map((t) => (
        <li key={t.name} className="stack-tool">
          <div className="stack-tool__head">
            <span className="stack-tool__name">{t.name}</span>
            <span className="stack-tool__tag">{t.tag}</span>
          </div>
          <p className="stack-tool__plain">{t.plain}</p>
          <p className="stack-tool__tech">{t.tech}</p>
        </li>
      ))}
    </ul>
  )
}
