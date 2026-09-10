# QuoteBook

You post a buy price and a sell price. People hit them. If they keep selling to you, you pile up leftover stock. A fixed gap around the middle of the market keeps inviting more of the same.

I lean the quotes when I am long (Avellaneda-Stoikov-style reservation price and spread), then score that against a fixed gap on the same synthetic paths. The number I trust is how often leaning wins: 92.5% of 400 paths (fixed spread wins the rest).

Synthetic midprice plus Poisson arrivals. Cap on horizon and inventory. No live exchange.

## Run

```bash
python -m pytest tests/ -q
python scripts/run.py
npm --prefix web install
npm --prefix web run dev
```

`scripts/run.py` prints inventory-aware quotes vs fixed spread. Inventory bounds and no-future-mid leak checks live in pytest.

## Layout

- `src/` quote rule, arrival sim, score
- `scripts/run.py`
- `tests/` bound and leak checks
- `web/` case-study page
