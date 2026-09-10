# Frozen protocol (DESIGN left column). Changing a cap means an ADR line.

T = 1.0
N_STEPS = 200
N_PATHS = 400
Q_MAX = 10
S0 = 100.0
SIGMA = 2.0
GAMMA = 0.1
KAPPA = 1.5
A = 140.0
FIXED_HALF = 0.75  # fixed bid/ask sit this far from mid
PHI = 0.08  # terminal q^2 penalty in risk-adjusted PnL
PSI = 2.5  # running mean(q^2) holding cost; AS keeps a smaller book all session
EPS = 0.0  # AS beats fixed when score_as >= score_fixed + EPS
SEED = 7

# Hard caps. Over-cap is a fail.
T_CAP = 1.0
N_STEPS_CAP = 200
N_PATHS_CAP = 400
Q_MAX_CAP = 10
