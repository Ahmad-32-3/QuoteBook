"""Ablation on risk aversion γ and fill-decay κ. Same paths protocol otherwise."""

from . import const
from .eval import evaluate

GAMMAS = (0.01, 0.1, 0.5)
KAPPAS = (0.5, 1.5, 3.0)


def ablation(n_paths=const.N_PATHS, seed=const.SEED):
    rows = []
    for gamma in GAMMAS:
        for kappa in KAPPAS:
            m = evaluate(n_paths=n_paths, seed=seed, gamma=gamma, kappa=kappa)
            rows.append(
                {
                    "gamma": gamma,
                    "kappa": kappa,
                    "success_pct": m["success_pct"],
                    "mean_score_as": m["mean_score_as"],
                    "mean_score_fixed": m["mean_score_fixed"],
                    "mean_abs_q_as": m["mean_abs_q_as"],
                    "default": gamma == const.GAMMA and kappa == const.KAPPA,
                }
            )
    return rows


def print_table(rows):
    print(f"{'gamma':>8}{'kappa':>8}{'success%':>10}{'score AS':>12}{'score fx':>12}{'|q|_AS':>8}  note")
    for r in rows:
        mark = " default" if r["default"] else ""
        print(
            f"{r['gamma']:8.2f}{r['kappa']:8.2f}{r['success_pct']:10.1f}"
            f"{r['mean_score_as']:12.2f}{r['mean_score_fixed']:12.2f}{r['mean_abs_q_as']:8.2f}{mark}"
        )
