# Modern Random Sampling: Generator & BitGenerator

Random number generation is indispensable across scientific computing: simulating physical stochastic processes, initializing weights in deep learning networks, shuffling datasets for cross-validation, and conducting Monte Carlo risk assessments.

In 2019 (NumPy 1.17+), NumPy introduced a major modernization of its random sampling subsystem, replacing the legacy `np.random.seed()` functions with the **`Generator` and `BitGenerator` architecture**.

---

## 1. Why the Legacy `np.random.seed()` is Discouraged

In older tutorials and legacy codebases, you will frequently encounter:
```python
# LEGACY APPROACH (Avoid in modern NumPy!)
# np.random.seed(42)
# np.random.rand(5)
```

The legacy interface has major architectural shortcomings:
1. **Global Mutable State:** `np.random.seed()` alters a global singleton state. If an imported library calls `np.random.seed()`, it silently contaminates your own random sequence!
2. **Outdated RNG Algorithm:** Relies on the 1990s Mersenne Twister (MT19937), which fails modern statistical randomness benchmarks (e.g. TestU01 BigCrush) and has large state memory overhead.
3. **Statistical Inefficiencies in Box-Muller:** Gaussian generation in the legacy API is slower and exhibits minor precision bias.

---

## 2. The Modern Standard: `np.random.default_rng()`

Modern NumPy separates random number generation into two distinct layers:
- **BitGenerator (e.g. PCG64):** Generates raw streams of random 64-bit unsigned integers.
- **Generator:** Transforms raw bits into specific statistical distributions (Uniform, Normal, Poisson, etc.).

Initialize a generator using `np.random.default_rng(seed)`:

```python
import numpy as np

# Create an independent, thread-safe random generator instance
rng = np.random.default_rng(seed=42)

# Generate 5 uniform random floats in [0.0, 1.0)
uniform_floats = rng.random(5)
print("Uniform floats:
", uniform_floats)

# Generate random integers between 1 and 100 (inclusive of 1, exclusive of 101)
random_ints = rng.integers(low=1, high=101, size=(2, 3))
print("
Random 2x3 Integers:
", random_ints)
```

---

## 3. Sampling from Statistical Distributions

The modern `Generator` provides methods for dozens of probability distributions:

```python
# 1. Normal (Gaussian) Distribution: mean=100, std=15 (e.g. IQ scores)
iq_scores = rng.normal(loc=100.0, scale=15.0, size=5)
print("Normal samples:   ", np.round(iq_scores, 1))

# 2. Uniform Distribution in interval [min, max)
sensor_noise = rng.uniform(low=-0.5, high=0.5, size=5)
print("Uniform noise:    ", np.round(sensor_noise, 3))

# 3. Binomial Distribution: n trials, p probability (e.g. coin flips)
coin_tosses = rng.binomial(n=10, p=0.5, size=5)
print("Binomial (heads): ", coin_tosses)

# 4. Poisson Distribution: lambda rate (e.g. web traffic requests per second)
server_requests = rng.poisson(lam=20.0, size=5)
print("Poisson requests: ", server_requests)
```

---

## 4. Shuffling and Random Choices

```python
cards = np.array(["Ace", "King", "Queen", "Jack", "10", "9"])

# 1. In-place shuffle (mutates array)
rng.shuffle(cards)
print("Shuffled cards:", cards)

# 2. Out-of-place permutation (returns a copy)
permuted = rng.permutation(cards)
print("Permuted copy: ", permuted)

# 3. Random choice with or without replacement
participants = np.array(["Alice", "Bob", "Charlie", "David", "Emma"])

# Draw 2 winners without replacement (cannot pick same person twice)
lottery_winners = rng.choice(participants, size=2, replace=False)
print("Lottery winners:", lottery_winners)
```

---

# Multiple Choice Questions

### 1. What is the recommended modern method to instantiate a random number generator in NumPy?
A. `np.random.seed(42)`
B. `np.random.default_rng(seed)`
C. `np.random.RandomState(seed)`
D. `np.random.init()`
**Answer:** B
**Explanation:** `np.random.default_rng(seed)` creates an independent `Generator` instance powered by the modern PCG64 BitGenerator, avoiding global state contamination.

---

### 2. Why is relying on global `np.random.seed()` problematic in production software?
A. It only works on 32-bit systems
B. It mutates global state, meaning external packages or concurrent threads can unpredictably disrupt your random sequence
C. It generates non-numeric values
D. It has been completely deleted from Python
**Answer:** B
**Explanation:** Global state causes silent coupling between modules and threads. An isolated `Generator` instance ensures deterministic, encapsulated reproducibility.

---

### 3. Which modern `Generator` method generates random integers in a specified range?
A. `rng.randint()`
B. `rng.integers()`
C. `rng.random_int()`
D. `rng.sample_int()`
**Answer:** B
**Explanation:** In the modern `Generator` API, `rng.integers(low, high, size)` is the standard method for producing discrete uniform integer random variables.

---

### 4. What does setting `replace=False` accomplish in `rng.choice(items, size=k, replace=False)`?
A. It replaces missing values with zero
B. It samples without replacement, guaranteeing no element is chosen more than once
C. It keeps the original array unchanged
D. It sorts the selected choices
**Answer:** B
**Explanation:** `replace=False` specifies sampling without replacement, so each selected element is removed from the candidate pool for subsequent draws.

---

### 5. What default BitGenerator algorithm powers `np.random.default_rng()`?
A. Mersenne Twister (MT19937)
B. PCG64
C. Linear Congruential Generator (LCG)
D. SHA-256
**Answer:** B
**Explanation:** Modern NumPy uses PCG64 (Permuted Congruential Generator 64-bit) as its default BitGenerator due to its excellent statistical properties, speed, and compact state size.

---