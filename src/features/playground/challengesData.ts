import { CodeChallenge } from './types';

export const CODING_CHALLENGES: CodeChallenge[] = [
  // PYTHON CHALLENGES
  {
    id: 'py-palindrome',
    title: 'Palindrome String Checker',
    difficulty: 'Easy',
    language: 'python',
    category: 'Strings & Logic',
    description: `Write a program that takes a string and prints **True** if it is a palindrome (reads the same backwards as forwards), ignoring letter case, otherwise prints **False**.`,
    starterCode: `# Check if a word is a palindrome
word = input()

# Your code here
cleaned = word.lower()
is_pal = (cleaned == cleaned[::-1])
print(is_pal)
`,
    testCases: [
      { input: 'radar', expectedOutput: 'True', explanation: "'radar' reads same forwards and backwards." },
      { input: 'Python', expectedOutput: 'False', explanation: "'Python' backwards is 'nohtyP'." },
      { input: 'Madam', expectedOutput: 'True', explanation: "Case-insensitive palindrome check." },
    ],
    hints: [
      'Convert the input string to lowercase first using .lower()',
      'You can reverse a string in Python easily using slicing: s[::-1]',
    ],
  },
  {
    id: 'py-two-sum',
    title: 'Sum of Evens in a List',
    difficulty: 'Easy',
    language: 'python',
    category: 'Loops & Lists',
    description: `Given space-separated integers from input, calculate and print the sum of all even numbers.`,
    starterCode: `# Read space-separated numbers
nums = list(map(int, input().split()))

# Calculate sum of evens
even_sum = sum(x for x in nums if x % 2 == 0)
print(even_sum)
`,
    testCases: [
      { input: '1 2 3 4 5 6', expectedOutput: '12', explanation: '2 + 4 + 6 = 12' },
      { input: '10 21 30 43 50', expectedOutput: '90', explanation: '10 + 30 + 50 = 90' },
      { input: '1 3 5 7', expectedOutput: '0', explanation: 'No even numbers' },
    ],
    hints: [
      'Use modulo operator (%) to check if a number is even: num % 2 == 0',
      'Accumulate with sum() or a for loop',
    ],
  },
  {
    id: 'py-fibonacci',
    title: 'Nth Fibonacci Number',
    difficulty: 'Medium',
    language: 'python',
    category: 'Algorithms & Math',
    description: `Given an integer N (1-indexed), compute and print the Nth Fibonacci number, where F(1) = 0, F(2) = 1, F(3) = 1, F(4) = 2, F(5) = 3...`,
    starterCode: `n = int(input())

def get_fib(n):
    if n <= 1:
        return 0
    if n == 2:
        return 1
    a, b = 0, 1
    for _ in range(n - 2):
        a, b = b, a + b
    return b

print(get_fib(n))
`,
    testCases: [
      { input: '1', expectedOutput: '0' },
      { input: '5', expectedOutput: '3' },
      { input: '10', expectedOutput: '34' },
    ],
    hints: [
      'Keep track of previous two values in variables a and b',
      'Update: a, b = b, a + b in a loop',
    ],
  },

  // C / C++ CHALLENGES
  {
    id: 'cpp-reverse-array',
    title: 'Reverse an Array in C++',
    difficulty: 'Easy',
    language: 'cpp',
    category: 'Arrays & Pointers',
    description: `Read the size N followed by N integers. Print the array in reversed order separated by spaces.`,
    starterCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // Print reversed
    for (int i = n - 1; i >= 0; i--) {
        cout << arr[i] << (i == 0 ? "" : " ");
    }
    cout << endl;
    return 0;
}
`,
    testCases: [
      { input: '5 1 2 3 4 5', expectedOutput: '5 4 3 2 1' },
      { input: '3 10 20 30', expectedOutput: '30 20 10' },
    ],
    hints: ['Loop backwards starting at index n - 1 down to 0'],
  },
  {
    id: 'c-factorial',
    title: 'Factorial Calculator in C',
    difficulty: 'Easy',
    language: 'c',
    category: 'Loops & Functions',
    description: `Read a non-negative integer N and print N! (factorial of N). 0! = 1.`,
    starterCode: `#include <stdio.h>

long long factorial(int n) {
    long long res = 1;
    for (int i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        printf("%lld\\n", factorial(n));
    }
    return 0;
}
`,
    testCases: [
      { input: '5', expectedOutput: '120' },
      { input: '0', expectedOutput: '1' },
      { input: '7', expectedOutput: '5040' },
    ],
    hints: ['Use long long for the accumulator to prevent integer overflow.'],
  },
  {
    id: 'cpp-vector-sum',
    title: 'Array Sum & Maximum in C++',
    difficulty: 'Easy',
    language: 'cpp',
    category: 'Vectors & Math',
    description: `Read N followed by N space-separated integers. Print the sum and maximum element separated by space.`,
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    long long sum = 0;
    int maxVal = -1e9;

    for (int i = 0; i < n; i++) {
        cin >> arr[i];
        sum += arr[i];
        if (arr[i] > maxVal) maxVal = arr[i];
    }

    cout << sum << " " << maxVal << endl;
    return 0;
}
`,
    testCases: [
      { input: '5 10 20 5 40 15', expectedOutput: '90 40' },
      { input: '3 -5 -2 -10', expectedOutput: '-17 -2' },
      { input: '1 42', expectedOutput: '42 42' },
    ],
    hints: ['Accumulate sum in long long and track maximum with std::max or an if check.'],
  },
  {
    id: 'c-pointer-swap',
    title: 'Swap Two Numbers with Pointers in C',
    difficulty: 'Easy',
    language: 'c',
    category: 'Pointers',
    description: `Read two integers A and B, call a swap function with pointers, and print the swapped values separated by a space.`,
    starterCode: `#include <stdio.h>

void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        swap(&a, &b);
        printf("%d %d\\n", a, b);
    }
    return 0;
}
`,
    testCases: [
      { input: '10 20', expectedOutput: '20 10' },
      { input: '-5 99', expectedOutput: '99 -5' },
      { input: '0 0', expectedOutput: '0 0' },
    ],
    hints: ['Pass the addresses (&a, &b) to the swap function and dereference them (*x, *y).'],
  },

  // JAVA CHALLENGES
  {
    id: 'java-max-element',
    title: 'Find Maximum in Array',
    difficulty: 'Easy',
    language: 'java',
    category: 'Arrays & OOP',
    description: `Read an integer N, then N integers. Print the maximum value in the array.`,
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (val > max) max = val;
        }
        System.out.println(max);
    }
}
`,
    testCases: [
      { input: '5 3 9 1 7 4', expectedOutput: '9' },
      { input: '3 -5 -2 -10', expectedOutput: '-2' },
    ],
    hints: ['Initialize max to Integer.MIN_VALUE.'],
  },

  // JAVASCRIPT CHALLENGES
  {
    id: 'js-fizzbuzz',
    title: 'Classic FizzBuzz',
    difficulty: 'Easy',
    language: 'javascript',
    category: 'Conditionals',
    description: `For numbers 1 to 15, print "FizzBuzz" if divisible by both 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, or the number itself.`,
    starterCode: `for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
`,
    testCases: [
      {
        input: '',
        expectedOutput: `1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz`,
      },
    ],
    hints: ['Check for divisible by 15 (both 3 and 5) first!'],
  },

  // SQL CHALLENGES
  {
    id: 'sql-high-scores',
    title: 'Filter High Scoring Students',
    difficulty: 'Easy',
    language: 'sql',
    category: 'SQL SELECT & WHERE',
    description: `Query all students with a score >= 85, sorted by score descending.`,
    starterCode: `CREATE TABLE students (id INT, name TEXT, score INT);
INSERT INTO students VALUES (1, 'Aman', 92), (2, 'Priya', 78), (3, 'Rahul', 88), (4, 'Neha', 82);

-- Write your SELECT query:
SELECT name, score FROM students WHERE score >= 85 ORDER BY score DESC;
`,
    testCases: [
      {
        input: '',
        expectedOutput: `Aman, 92\nRahul, 88`,
      },
    ],
    hints: ['Use WHERE score >= 85 and ORDER BY score DESC'],
  },
];
