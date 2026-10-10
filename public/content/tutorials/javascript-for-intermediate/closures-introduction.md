# Closures Introduction in JavaScript

A **Closure** is one of the most powerful and fundamental concepts in JavaScript. A closure is the combination of a function bundled together with references to its surrounding lexical state (the lexical environment). In simple terms: **a closure gives a function access to its outer scope even after the outer function has finished executing!**

---

## 1. How Closures Work Under the Hood

Normally, when a function finishes executing, its local variables are removed from the Call Stack and garbage collected. 

However, if an inner function references variables from the outer function, **JavaScript preserves the outer scope in memory** as long as the inner function is alive:

```javascript
function createGreeter(greeting) {
  // 'greeting' is a local variable inside createGreeter

  return function(name) {
    // Inner function accesses 'greeting' from the parent scope:
    console.log(`${greeting}, ${name}!`);
  };
}

// createGreeter finishes executing and returns:
const sayHello = createGreeter("Hello");
const sayNamaste = createGreeter("Namaste");

// The returned functions still REMEMBER their original greeting!
sayHello("Sumit");   // "Hello, Sumit!"
sayNamaste("Aarav"); // "Namaste, Aarav!"
```

```
Memory Structure:
+-------------------------------------------------------------+
| Closure Scope (Preserved in Memory):                        |
| greeting: "Hello"                                           |
+-------------------------------------------------------------+
                           ^
                           |
            sayHello("Sumit")  ---> Output: "Hello, Sumit!"
```

---

## 2. Practical Application: Private Variables (Data Encapsulation)

JavaScript historically did not have private class fields. Closures provided the standard way to create private, encapsulated state:

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable! Not directly accessible from outside!

  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        console.log(`Deposited ₹${amount}. New balance: ₹${balance}`);
      }
    },
    withdraw(amount) {
      if (amount <= balance) {
        balance -= amount;
        console.log(`Withdrew ₹${amount}. New balance: ₹${balance}`);
      } else {
        console.log("Insufficient funds!");
      }
    },
    getBalance() {
      return balance;
    }
  };
}

const myAccount = createBankAccount(1000);
myAccount.deposit(500); // Deposited ₹500. New balance: ₹1500
console.log(myAccount.balance); // undefined! (Direct access is impossible!)
console.log(myAccount.getBalance()); // 1500 (Accessible only through closures!)
```

---

## 3. Function Factories

A closure allows you to create customizable function generators:

```javascript
function createMultiplier(multiplier) {
  return function(x) {
    return x * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30
```

---

## Practice Quiz

### Q1: What is a closure in JavaScript?
- A) A method that closes the browser window
- B) A function that retains access to variables from its outer lexical scope even after that outer function has returned
- C) A CSS transition effect
- D) An unhandled promise rejection
**Answer:** B
**Explanation:** A closure allows an inner function to remember and access variables from its containing lexical scope after the outer function has completed execution.

### Q2: Why are closures used to create "private variables" in JavaScript?
- A) They encrypt the code
- B) Variables enclosed in the outer function cannot be accessed or modified directly from the outside world, except through exposed closure methods
- C) They delete memory
- D) They work only in strict mode
**Answer:** B
**Explanation:** By declaring variables inside an outer function and returning methods that reference them, the variables remain shielded from outside access.

### Q3: What is the output of:
```javascript
function counter() {
  let count = 0;
  return () => ++count;
}
const c1 = counter();
c1();
console.log(c1());
```
- A) 1
- B) 2
- C) `undefined`
- D) `NaN`
**Answer:** B
**Explanation:** The first call `c1()` increments `count` to 1, and the second call increments `count` to 2.

### Q4: Do separate instances of a function factory share the same closure state?
- A) Yes, all closures share one global memory
- B) No, each invocation of the outer function generates an independent, isolated lexical environment in memory
- C) Only if they have the same name
- D) Only on Linux
**Answer:** B
**Explanation:** Each time the outer function runs, a fresh lexical environment is created, giving each closure its own distinct private state.

### Q5: Can closures cause memory leaks if misused?
- A) No, JavaScript memory is infinite
- B) Yes, retaining unnecessary references in closures prevents the Garbage Collector from freeing memory
- C) Only when using arrays
- D) Only in Node.js
**Answer:** B
**Explanation:** If closures hold large unused objects or DOM elements in memory, the garbage collector cannot reclaim that memory, potentially leading to leaks.
