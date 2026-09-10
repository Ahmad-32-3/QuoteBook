import { AblationGridViz } from './components/story/AblationGridViz'
import { LeanQuotesViz } from './components/story/LeanQuotesViz'
import { ReservationViz } from './components/story/ReservationViz'
import { ScoreBarsViz } from './components/story/ScoreBarsViz'
import { StackGrid } from './components/story/StackGrid'
import { StoryBeat } from './components/story/StoryBeat'
import { PROTOCOL, RESULT, SCORE_ROWS } from './data'

const TOC = [
  { href: '#problem', label: 'The problem' },
  { href: '#solution', label: 'The solution' },
  { href: '#result', label: 'The result' },
  { href: '#stack', label: 'Tech stack' },
  { href: '#decisions', label: 'Design decisions' },
  { href: '#future', label: 'Next / run / sectors' },
]

export function App() {
  return (
    <>
      <a className="skip-link" href="#problem">
        Skip to the walkthrough
      </a>

      <div className="masthead">
        <div className="masthead__inner">
          <div className="masthead__mark">
            <b>QuoteBook</b> · a walkthrough
          </div>
          <ul className="masthead__nav">
            <li>
              <a href="#problem">problem</a>
            </li>
            <li>
              <a href="#result">result</a>
            </li>
            <li>
              <a href="#decisions">decisions</a>
            </li>
            <li>
              <a href="#future">next</a>
            </li>
          </ul>
        </div>
      </div>

      <main className="page">
        <header className="page-hero">
          <p className="meta">Walkthrough · inventory-aware market making</p>
          <h1>QuoteBook</h1>
          <p className="lead">
            You post a buy price and a sell price. People hit them. If they keep selling to you, you
            pile up leftover stock. A fixed gap around the middle of the market keeps inviting more
            of the same, and the book gets lopsided. I lean the quotes when I am long: I make it
            easier for people to buy from me and harder to sell to me. Then I run that against a
            fixed gap on the same fake paths. The number I trust is how often the leaning quotes
            finish with a better risk-adjusted score.
          </p>
          <p className="intro-detail">
            {RESULT.successPct}% of {PROTOCOL.nPaths} paths (
            {RESULT.winCount} of {PROTOCOL.nPaths}). The fixed-spread desk wins the rest. This is a
            synthetic Brownian mid with Poisson fills, not a live exchange.
          </p>
          <nav aria-label="On this page">
            <ul className="toc">
              {TOC.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <StoryBeat
          id="problem"
          kicker="The problem"
          title="A fixed gap keeps inviting the wrong fills"
          caption="Same mid in both rows. Up top the buy and sell prices stay glued to the mid while leftover stock grows. Below, both prices slide down so the pile can shrink."
          visual={<LeanQuotesViz />}
        >
          <p>
            Picture a desk that always stands in the middle of a market. It shows a price it will
            buy at and a price it will sell at. That is the job: earn the gap between those two
            prices as people trade against you.
          </p>
          <p>
            The failure is easy to picture. Say a run of sellers hits your buy price. Now you are
            long. If you leave both quotes sitting the same distance from the mid, the next seller
            still sees an attractive buy price, so you get even longer. The leftover stock is a bet
            the mid will not drop. When it does, the book is a mess.
          </p>
          <p>
            I wanted quotes that notice the pile and lean against it, measured on the same paths as
            a desk that never leans.
          </p>
        </StoryBeat>

        <StoryBeat
          id="solution"
          kicker="The solution"
          title="Slide both quotes down when you are long"
          caption="At leftover stock of +4, the reservation mark sits left of the mid. The leaning buy and sell wrap that mark. The amber bar is the fixed gap, still centered on 100."
          visual={<ReservationViz />}
        >
          <p>
            The rule is ordinary English first. If I am long, I want to sell. So I drop my sell
            price (easier for someone to buy from me) and I also drop my buy price (less inviting
            for the next seller). If I am short, I do the mirror image. The quotes lean.
          </p>
          <p>
            The formula that does this is Avellaneda–Stoikov: a reservation price that sits off the
            mid by leftover inventory, times risk aversion, times variance, times time left, plus a
            spread that widens a little when you are picky about risk. I did not invent it. I
            implemented the thin version and filled it with Poisson arrivals on a Brownian mid.
          </p>
          <p>
            The baseline is the naive desk: buy at mid minus 0.75, sell at mid plus 0.75, inventory
            ignored. Both desks see the same mid path and the same random arrival draws. I cap
            leftover stock at {PROTOCOL.qMax} units and stop quoting the heavy side if we hit it.
          </p>
        </StoryBeat>

        <StoryBeat
          id="result"
          kicker="The result"
          title="Leaning wins on 92.5% of the same paths"
          caption="Risk-adjusted score puts a cost on sitting in inventory. Raw terminal wealth actually favors the fixed gap a little, because that desk holds a bigger leftover pile that sometimes marks up."
          visual={
            <>
              <ScoreBarsViz />
              <AblationGridViz />
            </>
          }
        >
          <p>
            On {PROTOCOL.nPaths} paths of {PROTOCOL.nSteps} steps, the leaning quotes beat the
            fixed gap on {RESULT.successPct}% of them. The floor I set was 85%. I wanted the number
            up near 90 to 95, and that is where it landed.
          </p>
          <p>
            The score is not raw cash. It is terminal wealth minus a penalty for leftover stock at
            the end minus a running cost for how big the book was during the session. A fixed gap
            often finishes with more cash because it never steps out of the way, but it also
            finishes with more than twice the leftover inventory (mean |q| {RESULT.meanAbsQFixed}{' '}
            vs {RESULT.meanAbsQAs}). Once sitting in that pile has a cost, leaning wins.
          </p>
          <table className="choice-table">
            <caption className="sr-only">Leaning quotes versus a fixed spread on the same paths</caption>
            <thead>
              <tr>
                <th scope="col">On the same 400 paths</th>
                <th scope="col">Lean</th>
                <th scope="col">Fixed gap</th>
              </tr>
            </thead>
            <tbody>
              {SCORE_ROWS.map((r) => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  <td style={{ color: r.better === 'as' ? 'var(--good)' : 'var(--fg)' }}>{r.as}</td>
                  <td style={{ color: r.better === 'fixed' ? 'var(--good)' : 'var(--fg)' }}>{r.fixed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </StoryBeat>

        <section className="story-beat" id="stack">
          <p className="story-kicker">Tech stack</p>
          <h2>What runs under the hood, and why</h2>
          <p className="stack-intro">
            I kept the stack small on purpose. Each card is one tool: what it does in plain terms,
            then how it works.
          </p>
          <StackGrid />
        </section>

        <StoryBeat
          id="decisions"
          kicker="Design decisions"
          title="The calls I made, in plain words"
          caption="What I first reached for, and what I shipped instead."
          visual={
            <div className="teach-card">
              <h3 className="teach-card__title">What I wanted vs. what I built</h3>
              <table className="choice-table">
                <caption className="sr-only">Design decisions</caption>
                <thead>
                  <tr>
                    <th scope="col">First instinct</th>
                    <th scope="col">What I built</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Live exchange tape</td>
                    <td>Synthetic mid + Poisson fills, so inventory PnL is measurable</td>
                  </tr>
                  <tr>
                    <td>Headline on raw cash</td>
                    <td>Path-wise risk-adjusted score, with the fixed gap printed next to it</td>
                  </tr>
                  <tr>
                    <td>A multi-asset book</td>
                    <td>One name, one inventory, a hard cap of 10</td>
                  </tr>
                  <tr>
                    <td>A chart library</td>
                    <td>Hand SVG on the same editorial tokens as the EEG walkthrough</td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        >
          <p>
            I scored path by path, not just the average. An average can hide a strategy that blows
            up on a minority of paths. The headline is the fraction of paths where leaning finishes
            ahead, with ε locked at 0.
          </p>
          <p>
            Raw terminal wealth favors the fixed gap here. That is expected: that desk never backs
            away, so it harvests more spread and holds more leftover stock. I put the holding cost
            in the score because that is the actual job. A market maker who is proud of cash while
            sitting on a huge book is not done.
          </p>
          <p>
            γ and κ stay at the usual paper values (0.1 and 1.5). The ablation grid is there so you
            can see the locked pair is not a one-off. Weak lean at the same fill decay drops under
            85%.
          </p>
        </StoryBeat>

        <StoryBeat
          id="future"
          kicker="Improve / next / run / sectors"
          title="What is still weak, and who can use the finding"
          caption="Caps are frozen: T=1, 200 steps, 400 paths, leftover stock at most 10. Going over a cap is a fail."
          visual={
            <div className="teach-card">
              <h3 className="teach-card__title">Run it locally</h3>
              <ol className="stack-list">
                <li>
                  <code>python -m pytest tests/test_eval.py -q</code>
                </li>
                <li>
                  <code>python scripts/run.py</code> prints AS vs fixed, then the γ/κ grid
                </li>
                <li>
                  <code>npm --prefix web install</code> then <code>npm --prefix web run dev</code>
                </li>
              </ol>
              <p className="meta" style={{ margin: '0.75rem 0 0', textTransform: 'none', letterSpacing: 0 }}>
                No dataset download. The market is generated.
              </p>
            </div>
          }
        >
          <p>
            The market is a toy on purpose, but it is not a tiny toy: 400 paths, 200 steps, a real
            inventory cap. It still is not a tape. There is no adverse selection beyond the
            Brownian mid, no queue, no latency. A next step is a Hawkes arrival process, or a
            mid that jumps when I get filled.
          </p>
          <p>
            Prop MM research can use the same score to reject a quote rule that only looks good on
            average cash. Crypto LP sandboxes can paste the lean rule into a simulator before they
            post on a live pool. Exchange simulators can use the leak test (quotes must not see a
            future mid) as a unit of hygiene.
          </p>
        </StoryBeat>

        <footer
          style={{
            borderTop: '1px solid var(--line-rule)',
            paddingTop: 'var(--space-6)',
            marginTop: 'var(--space-6)',
            color: 'var(--fg-low)',
            fontSize: 'var(--fs-sm)',
          }}
        >
          <p style={{ maxWidth: 'var(--measure)' }}>
            I wanted quotes that respect leftover stock, measured against a fixed gap on the same
            synthetic paths. {RESULT.successPct}% is the number I will stand behind on this protocol.
            Not a live market-making product.
          </p>
        </footer>
      </main>
    </>
  )
}
