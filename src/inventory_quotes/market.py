"""Synthetic Brownian mid and Poisson fills. Same path noise for both strategies."""

import numpy as np

from . import const
from .quotes import as_quotes, check_inventory_bound, fixed_quotes


def brownian_mids(n_paths, n_steps, dt, sigma, s0, rng):
    dW = rng.normal(0.0, np.sqrt(dt), size=(n_paths, n_steps))
    return np.concatenate([np.full((n_paths, 1), s0), s0 + np.cumsum(sigma * dW, axis=1)], axis=1)


def _simulate(mids, u_bid, u_ask, mode, gamma, kappa, q_max, phi, psi, A, sigma, T, fixed_half):
    n_paths, n_steps = u_bid.shape
    dt = T / n_steps
    cash = np.zeros(n_paths)
    q = np.zeros(n_paths)
    q2_acc = np.zeros(n_paths)
    q_peak = np.zeros(n_paths)
    for i in range(n_steps):
        t = i * dt
        tau = max(T - t, 0.0)
        mid = mids[:, i]
        if mode == "as":
            r = mid - q * gamma * sigma**2 * tau
            half = (gamma * sigma**2 * tau + (2.0 / gamma) * np.log(1.0 + gamma / kappa)) / 2.0
            bid = r - half
            ask = r + half
        else:
            bid = mid - fixed_half
            ask = mid + fixed_half
        can_buy = q < q_max
        can_sell = q > -q_max
        depth_b = np.maximum(mid - bid, 0.0)
        depth_a = np.maximum(ask - mid, 0.0)
        p_bid = 1.0 - np.exp(-A * np.exp(-kappa * depth_b) * dt)
        p_ask = 1.0 - np.exp(-A * np.exp(-kappa * depth_a) * dt)
        hit_b = can_buy & (u_bid[:, i] < p_bid)
        hit_a = can_sell & (u_ask[:, i] < p_ask)
        cash = cash - bid * hit_b + ask * hit_a
        q = q + hit_b.astype(float) - hit_a.astype(float)
        q2_acc = q2_acc + q * q
        q_peak = np.maximum(q_peak, np.abs(q))
    check_inventory_bound(q, q_max=q_max)
    check_inventory_bound(q_peak, q_max=q_max)
    wealth = cash + q * mids[:, -1]
    mean_q2 = q2_acc / n_steps
    score = wealth - phi * q * q - psi * mean_q2
    return {"score": score, "wealth": wealth, "q": q, "q_peak": q_peak, "mean_q2": mean_q2}


def simulate_coupled(
    n_paths=const.N_PATHS,
    n_steps=const.N_STEPS,
    T=const.T,
    sigma=const.SIGMA,
    s0=const.S0,
    gamma=const.GAMMA,
    kappa=const.KAPPA,
    q_max=const.Q_MAX,
    phi=const.PHI,
    psi=const.PSI,
    A=const.A,
    fixed_half=const.FIXED_HALF,
    seed=const.SEED,
):
    if T > const.T_CAP + 1e-12:
        raise ValueError(f"HARD FAIL: T {T} over cap {const.T_CAP}")
    if n_steps > const.N_STEPS_CAP:
        raise ValueError(f"HARD FAIL: n_steps {n_steps} over cap {const.N_STEPS_CAP}")
    if n_paths > const.N_PATHS_CAP:
        raise ValueError(f"HARD FAIL: n_paths {n_paths} over cap {const.N_PATHS_CAP}")
    if q_max > const.Q_MAX_CAP:
        raise ValueError(f"HARD FAIL: q_max {q_max} over cap {const.Q_MAX_CAP}")
    rng = np.random.default_rng(seed)
    dt = T / n_steps
    mids = brownian_mids(n_paths, n_steps, dt, sigma, s0, rng)
    u_bid = rng.random((n_paths, n_steps))
    u_ask = rng.random((n_paths, n_steps))
    as_out = _simulate(mids, u_bid, u_ask, "as", gamma, kappa, q_max, phi, psi, A, sigma, T, fixed_half)
    fx_out = _simulate(mids, u_bid, u_ask, "fixed", gamma, kappa, q_max, phi, psi, A, sigma, T, fixed_half)
    return mids, as_out, fx_out


def honest_quote_fn(i, mids, q=0.0, T=const.T, n_steps=const.N_STEPS):
    t = i * (T / n_steps)
    return as_quotes(float(mids[i]), q, t, T=T)


def peek_future_quote_fn(i, mids, q=0.0, T=const.T, n_steps=const.N_STEPS):
    t = i * (T / n_steps)
    return as_quotes(float(mids[-1]), q, t, T=T)


def fixed_at_i(i, mids):
    return fixed_quotes(float(mids[i]))
