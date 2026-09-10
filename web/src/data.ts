// Frozen numbers from `python scripts/run.py` (seed 7). The page reads only this file.

export const ILLUSTRATIVE = false

export const PROTOCOL = {
  T: 1,
  nSteps: 200,
  nPaths: 400,
  qMax: 10,
  sigma: 2,
  gamma: 0.1,
  kappa: 1.5,
  fixedHalf: 0.75,
  phi: 0.08,
  psi: 2.5,
  eps: 0,
  seed: 7,
}

export const RESULT = {
  successPct: 92.5,
  winCount: 370,
  meanScoreAs: 50.63,
  meanScoreFixed: 0.42,
  meanWealthAs: 56.91,
  meanWealthFixed: 59.58,
  meanAbsQAs: 2.36,
  meanAbsQFixed: 5.29,
  meanPeakAs: 4.1,
  meanPeakFixed: 8.24,
}

export const ABLATION = [
  { gamma: 0.01, kappa: 0.5, successPct: 98.2 },
  { gamma: 0.01, kappa: 1.5, successPct: 80.8 },
  { gamma: 0.01, kappa: 3.0, successPct: 72.8 },
  { gamma: 0.1, kappa: 0.5, successPct: 100.0 },
  { gamma: 0.1, kappa: 1.5, successPct: 92.5, isDefault: true },
  { gamma: 0.1, kappa: 3.0, successPct: 98.2 },
  { gamma: 0.5, kappa: 0.5, successPct: 100.0 },
  { gamma: 0.5, kappa: 1.5, successPct: 79.5 },
  { gamma: 0.5, kappa: 3.0, successPct: 81.0 },
]

export const SCORE_ROWS = [
  { label: 'Risk-adjusted score', as: '50.6', fixed: '0.4', better: 'as' as const },
  { label: 'Terminal wealth (raw cash + leftover stock)', as: '56.9', fixed: '59.6', better: 'fixed' as const },
  { label: 'Mean leftover |inventory|', as: '2.4', fixed: '5.3', better: 'as' as const },
  { label: 'Mean peak |inventory|', as: '4.1', fixed: '8.2', better: 'as' as const },
  { label: 'Paths where leaning wins', as: '370 / 400', fixed: '30 / 400', better: 'as' as const },
]
