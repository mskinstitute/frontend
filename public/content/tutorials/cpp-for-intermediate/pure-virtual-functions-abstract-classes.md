---
id: pure-virtual-functions-abstract-classes
slug: pure-virtual-functions-abstract-classes
course: cpp-for-intermediate
chapter: 3: Inheritance & Polymorphism
topic: "Pure Virtual Functions, Abstract Classes, and Interface Design"
difficulty: Intermediate
readingTime: 13
order: 14
keywords: ["pure virtual functions","abstract class","interface","contract programming","= 0 syntax"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📐 Pure Virtual Functions, Abstract Classes, and Interface Design

## Introduction
An **abstract class** defines an interface (a strict operational contract) that subclasses must implement. In C++, setting a virtual function signature to **`= 0`** designates it as a **pure virtual function**.

---

## 📝 Syntax & Abstract Classes

An abstract class cannot be directly instantiated:

```cpp
#include <iostream>
#include <string>

// Pure Abstract Interface
class IPaymentGateway {
public:
    virtual ~IPaymentGateway() = default;

    // Pure Virtual Functions (= 0)
    virtual bool processPayment(double amount) = 0;
    virtual std::string getGatewayName() const = 0;
};

// Concrete Implementation 1: UPI Gateway
class UpiPayment : public IPaymentGateway {
private:
    std::string m_upiId;
public:
    explicit UpiPayment(const std::string& upi) : m_upiId(upi) {}

    bool processPayment(double amount) override {
        std::cout << "[UPI]: Transferred ₹" << amount << " via UPI ID: " << m_upiId << "\n";
        return true;
    }

    std::string getGatewayName() const override {
        return "National Payments UPI Gateway";
    }
};

// Concrete Implementation 2: Credit Card Gateway
class CreditCardPayment : public IPaymentGateway {
private:
    std::string m_cardNumberMasked;
public:
    explicit CreditCardPayment(const std::string& card) : m_cardNumberMasked(card) {}

    bool processPayment(double amount) override {
        std::cout << "[CARD]: Charged ₹" << amount << " to Card ending in " << m_cardNumberMasked << "\n";
        return true;
    }

    std::string getGatewayName() const override {
        return "Secure VISA/MasterCard Gateway";
    }
};

// High-level Checkout service decoupled from concrete payment logic!
void checkoutStudent(IPaymentGateway& gateway, double courseFee) {
    std::cout << "Connecting to: " << gateway.getGatewayName() << "...\n";
    gateway.processPayment(courseFee);
    std::cout << "Payment confirmed! Enrollment active.\n";
}

int main() {
    UpiPayment upi("student@oksbi");
    CreditCardPayment card("4598");

    checkoutStudent(upi, 4999.0);
    std::cout << "---------------------------------\n";
    checkoutStudent(card, 7999.0);

    return 0;
}
```

---

## 💡 The Dependency Inversion Principle
By coding against abstract interfaces (`IPaymentGateway`) rather than rigid concrete implementations (`UpiPayment`), your systems become modular, swappable, and easily unit-tested.
