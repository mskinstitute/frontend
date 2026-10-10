# Generating Random Numbers and the Dice Game Example

Generating random numbers is crucial for games, unique ID generation, simulations, password generators, and lottery drawings. JavaScript provides **`Math.random()`** as its pseudo-random number generator.

---

## 1. How `Math.random()` Works

`Math.random()` returns a floating-point, pseudo-random number in the range:
$$0 \le \text{result} < 1$$
- It can return **`0`** (inclusive).
- It approaches **`0.999999...`**, but **NEVER returns `1`**!

```javascript
console.log(Math.random()); // e.g. 0.428172948192
console.log(Math.random()); // e.g. 0.892019482711
```

---

## 2. Generating Random Integers in a Range

To transform that float into a useful integer range:

### Formula 1: Random Integer from 0 to $N - 1$:
```javascript
// Random integer from 0 to 9:
const rand0to9 = Math.floor(Math.random() * 10);
```

### Formula 2: The Universal Min-Max Formula (Inclusive):
To generate a random integer between `min` and `max` (inclusive):

```javascript
function getRandomInt(min, max) {
  // Enforce whole numbers:
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

```javascript
// Random number between 1 and 100:
const roll100 = getRandomInt(1, 100);

// Random number between -10 and 10:
const temp = getRandomInt(-10, 10);
```

---

## 3. Hands-On Project: Two-Player Dice Game

Let's build a practical script that simulates rolling two six-sided dice between Player 1 and Computer:

```javascript
function rollDie() {
  // Returns integer between 1 and 6 inclusive
  return Math.floor(Math.random() * 6) + 1;
}

function playDiceGame() {
  const playerRoll = rollDie();
  const computerRoll = rollDie();

  console.log(`🎲 You rolled: ${playerRoll}`);
  console.log(`🎲 Computer rolled: ${computerRoll}`);

  if (playerRoll > computerRoll) {
    console.log("🏆 Victory! You won the round!");
  } else if (computerRoll > playerRoll) {
    console.log("💥 Defeat! The computer won this time.");
  } else {
    console.log("🤝 It's a draw! Roll again.");
  }
}

playDiceGame();
```

---

## 4. Picking a Random Item from an Array

Combine `Math.random()` with `array.length` to select a random element:

```javascript
const colors = ["Crimson", "RoyalBlue", "Emerald", "Gold", "Violet"];

function getRandomItem(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

console.log(`Lucky color: ${getRandomItem(colors)}`);
```

---

## Practice Quiz

### Q1: What is the exact output range of `Math.random()` in JavaScript?
- A) Greater than or equal to 0, and strictly less than 1 ($[0, 1)$)
- B) Between 1 and 100
- C) Exactly 0 or 1
- D) Any 32-bit signed integer
**Answer:** A
**Explanation:** `Math.random()` returns a floating-point number from 0 (inclusive) up to, but not including, 1 (exclusive).

### Q2: What formula generates a random integer from 1 to 6 (like rolling a standard die)?
- A) `Math.floor(Math.random() * 6) + 1`
- B) `Math.random(1, 6)`
- C) `Math.ceil(Math.random() * 7)`
- D) `Math.round(Math.random() * 5)`
**Answer:** A
**Explanation:** `Math.random() * 6` yields $[0, 5.999...)$. Floored, it yields $\{0, 1, 2, 3, 4, 5\}$. Adding 1 shifts the range to $\{1, 2, 3, 4, 5, 6\}$.

### Q3: How do you select a random element from an array `const list = ["A", "B", "C", "D"]`?
- A) `list[Math.floor(Math.random() * list.length)]`
- B) `list.random()`
- C) `Math.choose(list)`
- D) `list[Math.random()]`
**Answer:** A
**Explanation:** Multiplying `Math.random()` by `list.length` and using `Math.floor()` generates a valid random index from 0 to `length - 1`.

### Q4: Why is `Math.floor()` preferred over `Math.round()` when generating random integer ranges?
- A) `Math.round()` produces a non-uniform probability distribution, giving edge values (min and max) half the probability of middle values
- B) `Math.round()` is deprecated
- C) `Math.floor()` is 100x faster
- D) `Math.round()` only works with negative numbers
**Answer:** A
**Explanation:** Because `Math.round()` splits the rounding interval at boundaries, the lowest and highest integers have only half the probability window of middle integers.

### Q5: What is the maximum value that `Math.floor(Math.random() * 10)` can return?
- A) 10
- B) 9
- C) 8
- D) 1
**Answer:** B
**Explanation:** Since `Math.random()` is strictly less than 1, multiplying by 10 is strictly less than 10. `Math.floor()` truncates down to a maximum integer of 9.
