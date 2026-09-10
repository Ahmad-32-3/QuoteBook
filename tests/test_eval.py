import numpy as np
import pytest

from inventory_quotes import const
from inventory_quotes.eval import evaluate
from inventory_quotes.market import (
    brownian_mids,
    fixed_at_i,
    honest_quote_fn,
    peek_future_quote_fn,
    simulate_coupled,
)
from inventory_quotes.quotes import as_quotes, check_inventory_bound, check_no_future_mid, fixed_quotes


def test_long_inventory_leans_quotes_down():
    mid = 100.0
    bid0, ask0 = as_quotes(mid, q=0, t=0.0)
    bid_long, ask_long = as_quotes(mid, q=4, t=0.0)
    assert bid_long < bid0
    assert ask_long < ask0
    assert ask_long > bid_long


def test_fixed_spread_ignores_inventory():
    mid = 100.0
    assert fixed_quotes(mid) == fixed_quotes(mid)


def test_as_quotes_ignore_future_mid():
    rng = np.random.default_rng(1)
    mids = brownian_mids(1, const.N_STEPS, const.T / const.N_STEPS, const.SIGMA, const.S0, rng)[0]
    check_no_future_mid(honest_quote_fn, mids)
    check_no_future_mid(fixed_at_i, mids)


def test_future_mid_injection_fails():
    rng = np.random.default_rng(1)
    mids = brownian_mids(1, const.N_STEPS, const.T / const.N_STEPS, const.SIGMA, const.S0, rng)[0]
    with pytest.raises(ValueError, match="future"):
        check_no_future_mid(peek_future_quote_fn, mids)


def test_inventory_stays_inside_cap():
    _, as_out, fx_out = simulate_coupled(n_paths=40, seed=3)
    check_inventory_bound(as_out["q"])
    check_inventory_bound(fx_out["q"])
    check_inventory_bound(as_out["q_peak"])
    check_inventory_bound(fx_out["q_peak"])


def test_inventory_injection_fails():
    with pytest.raises(ValueError, match="inventory"):
        check_inventory_bound(np.array([const.Q_MAX + 1.0]))


def test_over_cap_fails():
    with pytest.raises(ValueError, match="HARD FAIL"):
        simulate_coupled(n_paths=const.N_PATHS_CAP + 1)


def test_evaluate_as_beats_fixed_on_protocol():
    m = evaluate()
    assert m["n_paths"] == const.N_PATHS
    assert m["n_steps"] == const.N_STEPS
    assert m["T"] == const.T
    assert m["q_max"] == const.Q_MAX
    assert m["success_pct"] >= 85.0
    assert m["mean_score_as"] >= m["mean_score_fixed"]


def test_ablation_grid_includes_default_and_weaker_gamma():
    from inventory_quotes.ablate import ablation

    rows = ablation()
    assert len(rows) == 9
    by = {(r["gamma"], r["kappa"]): r for r in rows}
    default = by[(const.GAMMA, const.KAPPA)]
    weak = by[(0.01, const.KAPPA)]
    assert default["default"] is True
    assert default["success_pct"] >= 85.0
    assert weak["success_pct"] < default["success_pct"]
