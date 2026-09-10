"""Path-wise success: AS risk-adjusted PnL vs fixed spread on the same mids."""

import numpy as np

from . import const
from .market import simulate_coupled


def evaluate(
    n_paths=const.N_PATHS,
    seed=const.SEED,
    gamma=const.GAMMA,
    kappa=const.KAPPA,
    eps=const.EPS,
    **kwargs,
):
    mids, as_out, fx_out = simulate_coupled(
        n_paths=n_paths, seed=seed, gamma=gamma, kappa=kappa, **kwargs
    )
    wins = as_out["score"] >= fx_out["score"] + eps
    success_pct = 100.0 * float(np.mean(wins))
    return {
        "success_pct": success_pct,
        "n_paths": int(n_paths),
        "n_steps": int(mids.shape[1] - 1),
        "T": const.T,
        "eps": float(eps),
        "gamma": float(gamma),
        "kappa": float(kappa),
        "phi": float(kwargs.get("phi", const.PHI)),
        "psi": float(kwargs.get("psi", const.PSI)),
        "q_max": int(kwargs.get("q_max", const.Q_MAX)),
        "sigma": float(kwargs.get("sigma", const.SIGMA)),
        "fixed_half": float(kwargs.get("fixed_half", const.FIXED_HALF)),
        "seed": int(seed),
        "mean_score_as": float(np.mean(as_out["score"])),
        "mean_score_fixed": float(np.mean(fx_out["score"])),
        "mean_wealth_as": float(np.mean(as_out["wealth"])),
        "mean_wealth_fixed": float(np.mean(fx_out["wealth"])),
        "mean_abs_q_as": float(np.mean(np.abs(as_out["q"]))),
        "mean_abs_q_fixed": float(np.mean(np.abs(fx_out["q"]))),
        "mean_q_peak_as": float(np.mean(as_out["q_peak"])),
        "mean_q_peak_fixed": float(np.mean(fx_out["q_peak"])),
        "win_count": int(np.sum(wins)),
    }


def print_report(m):
    print(
        f"AS vs fixed  success_pct {m['success_pct']:.1f}  "
        f"(AS {m['win_count']}/{m['n_paths']} paths, eps={m['eps']})"
    )
    print(
        f"mean score  AS {m['mean_score_as']:.3f}  |  fixed {m['mean_score_fixed']:.3f}  "
        f"|  mean |q_T|  AS {m['mean_abs_q_as']:.2f}  fixed {m['mean_abs_q_fixed']:.2f}"
    )
    print(
        f"mean wealth AS {m['mean_wealth_as']:.3f}  |  fixed {m['mean_wealth_fixed']:.3f}  "
        f"|  T {m['T']} steps {m['n_steps']} q_max {m['q_max']} gamma {m['gamma']} kappa {m['kappa']}"
    )
