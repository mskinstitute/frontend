---
id: python-intermediate-project-bank-account-class-system
slug: project-bank-account-class-system
course: python-for-intermediate
chapter: "5: Object-Oriented Programming (Intermediate)"
topic: "5.5 Project: Bank Account Class System"
title: "Project: Bank Account Class System in Python"
description: "Master project: bank account class system in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 25
keywords:
  - python project bank account class system
  - python intermediate
  - python project: bank account class system
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Bank Account Class System

In this end-of-chapter project, we unify all key Object-Oriented concepts covered in this module—**Classes, Encapsulation, Inheritance, Method Overriding, Polymorphism, and Abstraction**—to architect a comprehensive **Banking System Engine**.

---

## 1. System Architecture & Requirements

Our system models a financial institution managing multiple account types:
1. **`Account` (Abstract Base Class)**: Defines the common interface and encapsulates state (`account_number`, `holder_name`, and protected `_balance`).
2. **`SavingsAccount` (Subclass)**: Requires a minimum balance and supports accruing monthly interest.
3. **`CheckingAccount` (Subclass)**: Permits an overdraft limit for transactions exceeding available funds, with per-transaction overdraft fees.
4. **Transaction Logging**: Automatically tracks timestamped audit logs for every deposit and withdrawal.
5. **Polymorphic Bank Manager**: Iterates over heterogeneous accounts to execute monthly maintenance routines seamlessly.

---

## 2. Complete Object-Oriented Code

```python
from abc import ABC, abstractmethod
from datetime import datetime


class Account(ABC):
    """Abstract Base Class representing a generic bank account."""

    def __init__(self, account_no: str, holder_name: str, initial_deposit: float = 0.0):
        if initial_deposit < 0:
            raise ValueError("Initial deposit cannot be negative.")
        self.account_no = account_no
        self.holder_name = holder_name
        self._balance = float(initial_deposit)
        self.transactions = []
        self._record_transaction("Account Opened", initial_deposit)

    @property
    def balance(self) -> float:
        """Encapsulated getter for account balance."""
        return self._balance

    def deposit(self, amount: float) -> bool:
        """Deposits a positive amount into the account."""
        if amount <= 0:
            print(f"[{self.account_no}] Deposit amount must be positive.")
            return False
        self._balance += amount
        self._record_transaction("Deposit", amount)
        print(f"[{self.account_no}] Deposited ₹{amount:,.2f}. New Balance: ₹{self._balance:,.2f}")
        return True

    @abstractmethod
    def withdraw(self, amount: float) -> bool:
        """Abstract method enforced across all account types."""
        pass

    @abstractmethod
    def monthly_maintenance(self):
        """Executes account-specific end-of-month routines."""
        pass

    def _record_transaction(self, tx_type: str, amount: float):
        """Internal helper for logging transaction ledger records."""
        entry = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "type": tx_type,
            "amount": amount,
            "resulting_balance": self._balance
        }
        self.transactions.append(entry)

    def print_statement(self):
        """Prints a formatted ledger of all transactions."""
        print(f"\n===== Account Statement: {self.account_no} ({self.holder_name}) =====")
        print(f"Account Type: {self.__class__.__name__}")
        print(f"{'Timestamp':<20} | {'Type':<18} | {'Amount':<12} | {'Balance'}")
        print("-" * 65)
        for tx in self.transactions:
            print(f"{tx['timestamp']:<20} | {tx['type']:<18} | ₹{tx['amount']:<11.2f} | ₹{tx['resulting_balance']:,.2f}")
        print(f"Current Available Balance: ₹{self._balance:,.2f}\n")


class SavingsAccount(Account):
    """Savings account featuring interest accumulation and minimum balance rules."""

    def __init__(self, account_no: str, holder_name: str, initial_deposit: float, 
                 interest_rate: float = 0.04, min_balance: float = 1000.0):
        super().__init__(account_no, holder_name, initial_deposit)
        self.interest_rate = interest_rate
        self.min_balance = min_balance

    def withdraw(self, amount: float) -> bool:
        if amount <= 0:
            print(f"[{self.account_no}] Invalid withdrawal amount.")
            return False
        if (self._balance - amount) < self.min_balance:
            print(f"[{self.account_no}] Withdrawal declined: Must maintain minimum balance of ₹{self.min_balance:,.2f}.")
            return False

        self._balance -= amount
        self._record_transaction("Withdrawal", amount)
        print(f"[{self.account_no}] Withdrew ₹{amount:,.2f}. Balance: ₹{self._balance:,.2f}")
        return True

    def monthly_maintenance(self):
        """Calculates and deposits monthly accrued interest."""
        monthly_interest = (self._balance * self.interest_rate) / 12
        self._balance += monthly_interest
        self._record_transaction("Interest Credited", monthly_interest)
        print(f"[{self.account_no}] Interest Credited: ₹{monthly_interest:,.2f}. New Balance: ₹{self._balance:,.2f}")


class CheckingAccount(Account):
    """Checking account with overdraft protection and transaction fees."""

    def __init__(self, account_no: str, holder_name: str, initial_deposit: float, 
                 overdraft_limit: float = 5000.0, fee: float = 20.0):
        super().__init__(account_no, holder_name, initial_deposit)
        self.overdraft_limit = overdraft_limit
        self.transaction_fee = fee

    def withdraw(self, amount: float) -> bool:
        if amount <= 0:
            print(f"[{self.account_no}] Invalid withdrawal amount.")
            return False

        total_deduction = amount
        # Apply fee if overdraft is utilized
        if (self._balance - amount) < 0:
            total_deduction += self.transaction_fee
            print(f"[{self.account_no}] Overdraft used. A fee of ₹{self.transaction_fee:.2f} applies.")

        if (self._balance - total_deduction) < -self.overdraft_limit:
            print(f"[{self.account_no}] Withdrawal declined: Exceeds overdraft limit of ₹{self.overdraft_limit:,.2f}.")
            return False

        self._balance -= total_deduction
        self._record_transaction("Withdrawal (Checking)", total_deduction)
        print(f"[{self.account_no}] Withdrew ₹{amount:,.2f} (Total debited: ₹{total_deduction:,.2f}). Balance: ₹{self._balance:,.2f}")
        return True

    def monthly_maintenance(self):
        print(f"[{self.account_no}] Checking account verified. No maintenance charges this cycle.")


class Bank:
    """Manages an aggregate collection of diverse account types polymorphically."""

    def __init__(self, name: str):
        self.name = name
        self.accounts = {}

    def add_account(self, account: Account):
        self.accounts[account.account_no] = account
        print(f"Account {account.account_no} registered with {self.name}.")

    def run_monthly_audit(self):
        """Polymorphic dispatch: Calls monthly_maintenance on each account."""
        print(f"\n--- Running Monthly Bank Audit for {self.name} ---")
        for acc in self.accounts.values():
            acc.monthly_maintenance()
```

---

## 3. Execution Simulation

```python
# Initialize Bank
bank = Bank("Apex National Bank")

# Create Savings and Checking Accounts
savings = SavingsAccount("SB-1001", "Aarav Sharma", initial_deposit=5000.0, interest_rate=0.06)
checking = CheckingAccount("CA-2002", "Priya Verma", initial_deposit=2000.0, overdraft_limit=3000.0)

bank.add_account(savings)
bank.add_account(checking)

# Perform Transactions
savings.deposit(2500.0)
savings.withdraw(6000.0)  # Fails due to minimum balance requirement (₹1000)
savings.withdraw(4000.0)  # Succeeds

checking.withdraw(3500.0) # Triggers overdraft fee (Debits ₹3,520)

# Polymorphic Monthly Audit
bank.run_monthly_audit()

# Generate Statements
savings.print_statement()
checking.print_statement()
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Floating-Point Precision Drift
In production financial systems, never use standard floats for currency due to rounding anomalies (e.g. `0.1 + 0.2 != 0.3`). Use the `decimal.Decimal` module or store cents/paise as integers.

### 2. Allowing Direct Modification of `_balance`
Always route all balance updates through validated methods (`deposit`, `withdraw`) to maintain an unbroken audit trail.

---

---

## 💻 Try It Yourself: Extension Challenge - Fixed Deposit Account

### Challenge
Add a `FixedDepositAccount` subclass to the Banking System that locks funds for a specified term (in months) and computes compound interest upon monthly maintenance.

### Complete Solution
```python
class FixedDepositAccount:
    def __init__(self, account_no: str, holder_name: str, deposit: float, annual_rate: float = 7.5):
        self.account_no = account_no
        self.holder_name = holder_name
        self.balance = float(deposit)
        self.annual_rate = annual_rate

    def monthly_maintenance(self):
        monthly_interest = self.balance * (self.annual_rate / 12 / 100)
        self.balance += monthly_interest
        print(f"[{self.account_no}] Accrued Monthly FD Interest: ₹{monthly_interest:,.2f}. New Balance: ₹{self.balance:,.2f}")

fd = FixedDepositAccount("FD-901", "Aarav Sharma", 100000.0, 7.5)
fd.monthly_maintenance()
```

### Expected Output
```text
[FD-901] Accrued Monthly FD Interest: ₹625.00. New Balance: ₹100,625.00
```

---

## Practice Quiz

### 1. In this project, what stops an external script from instantiating `Account("AC-1", "Test")` directly?
A. Python file permissions
B. `Account` inherits from `ABC` and defines unimplemented `@abstractmethod`s
C. The `Account` class is private
D. It has no `__init__` constructor
**Answer:** B
**Explanation:** Inheriting from `abc.ABC` with at least one `@abstractmethod` makes the class abstract, preventing direct instantiation.
---

### 2. How is data encapsulation preserved for the account's cash balance?
A. Storing it as a read-only `@property` wrapping the protected `_balance` attribute
B. Making the variable global
C. Writing the balance to an encrypted text file after every call
D. Defining balance as a static method
**Answer:** A
**Explanation:** Storing balance in `self._balance` and exposing it via a `@property` allows external callers to read the balance without directly writing arbitrary values to it.
---

### 3. Which OOP principle allows `bank.run_monthly_audit()` to call `.monthly_maintenance()` on both savings and checking accounts without checking their exact class?
A. Data Sharding
B. Polymorphism
C. Composition
D. Garbage Collection
**Answer:** B
**Explanation:** Polymorphism enables a single loop to invoke the same method name (`monthly_maintenance`) across diverse object types, executing each class's custom logic automatically.
---

### 4. What does the `CheckingAccount` class do when a withdrawal pushes the balance below zero?
A. It throws an unrecoverable `AssertionError`
B. It permits the transaction up to its `overdraft_limit` and applies a transaction fee
C. It transfers funds from the nearest savings account automatically
D. It resets the balance to zero
**Answer:** B
**Explanation:** The overridden `withdraw()` method in `CheckingAccount` checks against `-self.overdraft_limit` and tacks on `self.transaction_fee`.
---

### 5. Why does `SavingsAccount.__init__` call `super().__init__(account_no, holder_name, initial_deposit)`?
A. To invoke the abstract base class's constructor and initialize shared attributes
B. To create an SQLite database table
C. To prevent other classes from subclassing `SavingsAccount`
D. To convert all numbers into floating-point decimals
**Answer:** A
**Explanation:** `super().__init__()` calls the parent `Account` constructor to properly initialize common fields and record the opening transaction in the ledger.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Types of Exceptions** (6: Exception Handling).

👉 **[Continue to Next Lesson: Types of Exceptions →](/tutorials/python-for-intermediate/types-of-exceptions)**
