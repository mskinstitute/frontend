---
id: project-2-number-guessing-game
slug: project-2-number-guessing-game
course: cpp-for-beginners
chapter: 8: Beginner Projects & Capstones
topic: "Project 2: Number Guessing Game with High Score Tracking"
difficulty: Beginner
readingTime: 14
order: 34
keywords: ["number guessing game","random number","high scores","game loop"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🎲 Capstone Project 2: Number Guessing Game with High Score Tracking

## Introduction
Interactive games teach core control flow, loop mechanics, dynamic feedback, and session metrics. In this project, you will build a **Number Guessing Game** that tracks the player's fewest guesses as a persistent high score.

---

## 🎯 Architecture
- Random number generation using `<random>` (the modern C++ replacement for legacy `rand()`).
- Feedback hints: "Too High", "Too Low", or "Congratulations!".
- Tracks attempts and retains the record session high score.

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <random>
#include <limits>

int main() {
    // Modern C++ Mersenne Twister random engine
    std::random_device rd;
    std::mt19937 generator(rd());
    std::uniform_int_distribution<int> distribution(1, 100);

    int bestScore = std::numeric_limits<int>::max();
    char playAgain = 'n';

    std::cout << "========================================\n";
    std::cout << "   MSK Institute C++ Guessing Game      \n";
    std::cout << "========================================\n";

    do {
        int secretNumber = distribution(generator);
        int attempts = 0;
        int guess = 0;
        bool guessed = false;

        std::cout << "\nI have picked a secret number between 1 and 100.\n";

        while (!guessed) {
            std::cout << "Enter your guess: ";
            if (!(std::cin >> guess)) {
                std::cout << "[ERROR]: Enter a valid number!\n";
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                continue;
            }

            ++attempts;

            if (guess < secretNumber) {
                std::cout << "📉 Too Low! Try a higher number.\n";
            } else if (guess > secretNumber) {
                std::cout << "📈 Too High! Try a lower number.\n";
            } else {
                std::cout << "🎉 Correct! You found the number in " << attempts << " attempts!\n";
                guessed = true;

                if (attempts < bestScore) {
                    bestScore = attempts;
                    std::cout << "🌟 NEW RECORD! Best score: " << bestScore << " attempts!\n";
                } else {
                    std::cout << "Best Score so far: " << bestScore << " attempts.\n";
                }
            }
        }

        std::cout << "\nPlay another round? (y/n): ";
        std::cin >> playAgain;

    } while (playAgain == 'y' || playAgain == 'Y');

    std::cout << "\nThanks for playing! Final High Score: " 
              << (bestScore == std::numeric_limits<int>::max() ? 0 : bestScore) << " attempts.\n";

    return 0;
}
```
