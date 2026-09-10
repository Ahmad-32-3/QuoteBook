"""Run the frozen AS vs fixed protocol. Prints success_pct next to the baseline."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from inventory_quotes.ablate import ablation, print_table
from inventory_quotes.eval import evaluate, print_report

METRICS = "metrics.json"


def main():
    m = evaluate()
    with open(METRICS, "w") as f:
        json.dump(m, f, indent=2)
    print_report(m)
    print()
    rows = ablation()
    print_table(rows)
    if m["success_pct"] < 85:
        sys.exit(f"HARD FAIL: success_pct {m['success_pct']:.1f} under floor 85")


if __name__ == "__main__":
    main()
