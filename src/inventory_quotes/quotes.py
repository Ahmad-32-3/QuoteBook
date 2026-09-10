"""Avellaneda–Stoikov reservation quotes and a fixed-spread baseline.

Quotes at time t may only see the current mid, inventory, and clock.
"""

import numpy as np

from . import const


def reservation_price(mid, q, tau, gamma=const.GAMMA, sigma=const.SIGMA):
    return mid - q * gamma * sigma**2 * tau


def as_spread(tau, gamma=const.GAMMA, sigma=const.SIGMA, kappa=const.KAPPA):
    return gamma * sigma**2 * tau + (2.0 / gamma) * np.log(1.0 + gamma / kappa)


def as_quotes(mid, q, t, T=const.T, gamma=const.GAMMA, sigma=const.SIGMA, kappa=const.KAPPA):
    tau = max(T - t, 0.0)
    r = reservation_price(mid, q, tau, gamma=gamma, sigma=sigma)
    half = as_spread(tau, gamma=gamma, sigma=sigma, kappa=kappa) / 2.0
    return float(r - half), float(r + half)


def fixed_quotes(mid, half=const.FIXED_HALF):
    return float(mid - half), float(mid + half)


def check_no_future_mid(quote_fn, mids, dt=None):
    """Raise if quotes at step i change when later mids are poisoned."""
    mids = np.asarray(mids, float)
    n = len(mids)
    if n < 3:
        raise ValueError("need a path")
    for i in range(n - 1):
        a = quote_fn(i, mids)
        poisoned = mids.copy()
        poisoned[i + 1 :] = poisoned[i] + 25.0
        b = quote_fn(i, poisoned)
        if not np.allclose(a, b, rtol=0, atol=1e-12):
            raise ValueError("future mid leak")


def check_inventory_bound(q, q_max=const.Q_MAX):
    q = np.asarray(q, float)
    if np.any(np.abs(q) > q_max + 1e-9):
        raise ValueError("inventory cap")
