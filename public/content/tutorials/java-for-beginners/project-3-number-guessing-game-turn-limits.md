---
id: project-3-number-guessing-game-turn-limits
slug: project-3-number-guessing-game-turn-limits
course: java-for-beginners
chapter: 8: Beginner Projects & Capstones
topic: "Project 3: Number Guessing Game with Turn Limits"
difficulty: Beginner
readingTime: 15
order: 37
keywords: ["number guessing game java","random number java","turn limits","game loop"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🎲 Capstone Project 3: Number Guessing Game with Turn Limits

## Introduction
This game generates a pseudo-random number and gives the player a limited number of guesses, providing real-time feedback hints ("Too High" or "Too Low").

---

## 💻 Full Source Code

```java
import java.util.Scanner;
import java.util.Random;

public class NumberGuessingGame {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        int secretNumber = random.nextInt(100) + 1; // 1 to 100
        int maxAttempts = 7;
        int attemptsTaken = 0;
        boolean hasWon = false;

        System.out.println("========================================");
        System.out.println("       MSK NUMBER GUESSING GAME         ");
        System.out.println("========================================");
        System.out.println("I've picked a secret number between 1 and 100.");
        System.out.printf("You have %d attempts to guess it!%n%n", maxAttempts);

        while (attemptsTaken < maxAttempts) {
            System.out.printf("Attempt %d/%d - Enter your guess: ", (attemptsTaken + 1), maxAttempts);
            int guess = scanner.nextInt();
            attemptsTaken++;

            if (guess == secretNumber) {
                System.out.printf("🎉 BINGO! You guessed the number in %d attempts!%n", attemptsTaken);
                hasWon = true;
                break;
            } else if (guess < secretNumber) {
                System.out.println("📉 Too Low! Try a higher number.");
            } else {
                System.out.println("📈 Too High! Try a lower number.");
            }
        }

        if (!hasWon) {
            System.out.printf("%n💥 GAME OVER! The secret number was: %d%n", secretNumber);
        }

        scanner.close();
    }
}
```
