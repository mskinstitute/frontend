---
id: python-project-data-filtering-with-comprehensions
slug: project-data-filtering-with-comprehensions
course: python-for-intermediate
chapter: "1: Advanced Data Types & Comprehensions"
topic: "1.5 Project: Data Filtering with Comprehensions"
title: "Project: Data Filtering with Comprehensions"
description: "Build an end-to-end Flight Booking Intelligence Engine in Python using synergistic list, set, and dictionary comprehensions."
difficulty: Intermediate
readingTime: 16
order: 5
keywords:
  - project
  - data filtering
  - flight search engine
  - comprehensions project
  - list comprehension
  - set comprehension
  - dictionary comprehension
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Data Filtering with Comprehensions

Welcome to the Chapter 1 Capstone Project! In the preceding lessons, you mastered advanced list comprehensions, set comprehensions, dictionary comprehensions, and nested multi-dimensional structures.

Now, you will combine all these comprehension paradigms to build a production-grade **Domestic Flight Booking Intelligence Engine**. You will filter raw aviation manifests, deduplicate routes, aggregate airline pricing, and compute route matrices in declarative, high-speed Python.

---

## Real-World Analogy: MakeMyTrip Flight Search Engine

When a traveler searches for flights between Delhi and Bengaluru on a booking aggregator like MakeMyTrip or Ixigo:

```
+-------------------------------------------------------------------------+
|              FLIGHT SEARCH & INTELLIGENCE ENGINE PIPELINE               |
+-------------------------------------------------------------------------+
|                                                                         |
|  Raw Flight Feed (10,000+ flights from DGCA / Airport Radar)            |
|                              │                                          |
|                              ▼                                          |
|  1. Set Comprehension        ──> Extract Unique Airlines & Destination  |
|                                  Hubs for Dropdown Filter Menus         |
|                              │                                          |
|                              ▼                                          |
|  2. List Comprehension       ──> Filter flights by User Budget (₹),     |
|     with Walrus (:=)             Non-Stop status & Departure Window     |
|                              │                                          |
|                              ▼                                          |
|  3. Dict Comprehension       ──> Group Filtered Flights by Airline &    |
|                                  Compute Lowest Fare & Average Price    |
|                              │                                          |
|                              ▼                                          |
|  4. Nested Comprehension     ──> Generate City-to-City Route Availability|
|                                  Matrix for Quick Comparison            |
|                                                                         |
+-------------------------------------------------------------------------+
```

Every stage of this data pipeline can be executed concisely and expressively using Python's comprehension toolkit.

---

## Project Specification & Raw Dataset

The input data represents flight records received from domestic air traffic coordination:

```python
flight_manifest = [
    {"flight": "6E-204", "airline": "IndiGo", "origin": "DEL", "dest": "BOM", "price": 4800, "duration": 130, "stops": 0, "dep_hour": 6},
    {"flight": "AI-802", "airline": "Air India", "origin": "DEL", "dest": "BOM", "price": 6200, "duration": 140, "stops": 0, "dep_hour": 8},
    {"flight": "UK-955", "airline": "Vistara", "origin": "DEL", "dest": "BOM", "price": 7500, "duration": 135, "stops": 0, "dep_hour": 18},
    {"flight": "SG-123", "airline": "SpiceJet", "origin": "DEL", "dest": "BOM", "price": 3900, "duration": 210, "stops": 1, "dep_hour": 14},
    {"flight": "6E-551", "airline": "IndiGo", "origin": "DEL", "dest": "BLR", "price": 5400, "duration": 165, "stops": 0, "dep_hour": 9},
    {"flight": "AI-504", "airline": "Air India", "origin": "DEL", "dest": "BLR", "price": 6800, "duration": 170, "stops": 0, "dep_hour": 20},
    {"flight": "UK-812", "airline": "Vistara", "origin": "DEL", "dest": "BLR", "price": 8200, "duration": 160, "stops": 0, "dep_hour": 17},
    {"flight": "6E-901", "airline": "IndiGo", "origin": "BOM", "dest": "BLR", "price": 4200, "duration": 105, "stops": 0, "dep_hour": 11},
    {"flight": "SG-442", "airline": "SpiceJet", "origin": "BOM", "dest": "BLR", "price": 3600, "duration": 115, "stops": 0, "dep_hour": 22},
    {"flight": "AI-631", "airline": "Air India", "origin": "BOM", "dest": "DEL", "price": 5900, "duration": 145, "stops": 0, "dep_hour": 15},
    {"flight": "6E-718", "airline": "IndiGo", "origin": "BOM", "dest": "DEL", "price": 4900, "duration": 135, "stops": 0, "dep_hour": 19}
]
```

---

## Complete Production-Grade Implementation

Here is the modular, fully runnable Flight Intelligence Engine:

```python
"""
MSK Python Capstone: Domestic Flight Search & Intelligence Engine
Author: MSK Institute
"""

# Raw Aviation Data Feed
FLIGHT_MANIFEST = [
    {"flight": "6E-204", "airline": "IndiGo", "origin": "DEL", "dest": "BOM", "price": 4800, "duration": 130, "stops": 0, "dep_hour": 6},
    {"flight": "AI-802", "airline": "Air India", "origin": "DEL", "dest": "BOM", "price": 6200, "duration": 140, "stops": 0, "dep_hour": 8},
    {"flight": "UK-955", "airline": "Vistara", "origin": "DEL", "dest": "BOM", "price": 7500, "duration": 135, "stops": 0, "dep_hour": 18},
    {"flight": "SG-123", "airline": "SpiceJet", "origin": "DEL", "dest": "BOM", "price": 3900, "duration": 210, "stops": 1, "dep_hour": 14},
    {"flight": "6E-551", "airline": "IndiGo", "origin": "DEL", "dest": "BLR", "price": 5400, "duration": 165, "stops": 0, "dep_hour": 9},
    {"flight": "AI-504", "airline": "Air India", "origin": "DEL", "dest": "BLR", "price": 6800, "duration": 170, "stops": 0, "dep_hour": 20},
    {"flight": "UK-812", "airline": "Vistara", "origin": "DEL", "dest": "BLR", "price": 8200, "duration": 160, "stops": 0, "dep_hour": 17},
    {"flight": "6E-901", "airline": "IndiGo", "origin": "BOM", "dest": "BLR", "price": 4200, "duration": 105, "stops": 0, "dep_hour": 11},
    {"flight": "SG-442", "airline": "SpiceJet", "origin": "BOM", "dest": "BLR", "price": 3600, "duration": 115, "stops": 0, "dep_hour": 22},
    {"flight": "AI-631", "airline": "Air India", "origin": "BOM", "dest": "DEL", "price": 5900, "duration": 145, "stops": 0, "dep_hour": 15},
    {"flight": "6E-718", "airline": "IndiGo", "origin": "BOM", "dest": "DEL", "price": 4900, "duration": 135, "stops": 0, "dep_hour": 19}
]

# -------------------------------------------------------------
# Module 1: Extract Unique Hubs & Airlines (Set Comprehensions)
# -------------------------------------------------------------
def get_unique_network_metadata(manifest):
    """Uses set comprehensions to extract unique operational hubs and airlines."""
    origins = {f["origin"] for f in manifest}
    destinations = {f["dest"] for f in manifest}
    all_airports = origins | destinations  # Mathematical set union!
    airlines = {f["airline"] for f in manifest}
    return sorted(all_airports), sorted(airlines)

# -------------------------------------------------------------
# Module 2: User Search Query Filter (Advanced List Comprehension)
# -------------------------------------------------------------
def search_flights(manifest, origin, dest, max_budget=7000, non_stop_only=True):
    """Filters flights matching route, budget, and non-stop criteria."""
    # List comprehension: applies multi-predicate filters and formats display record
    matches = [
        {
            "flight_no": f["flight"],
            "carrier": f["airline"],
            "route": f"{f['origin']} ➔ {f['dest']}",
            "departure": f"{f['dep_hour']:02d}:00 hrs",
            "duration": f"{f['duration'] // 60}h {f['duration'] % 60}m",
            "total_fare": f["price"] + 450,  # Adding ₹450 airport passenger service fee
            "type": "Non-Stop" if f["stops"] == 0 else f"{f['stops']} Stop(s)"
        }
        for f in manifest
        if f["origin"] == origin
        if f["dest"] == dest
        if f["price"] <= max_budget
        if (not non_stop_only or f["stops"] == 0)
    ]
    return matches

# -------------------------------------------------------------
# Module 3: Airline Price Analytics (Dictionary Comprehension)
# -------------------------------------------------------------
def compute_airline_summary(manifest, origin, dest):
    """Uses dict comprehensions to compute lowest fare and average price per airline."""
    # Step A: Filter flights for this route
    route_flights = [f for f in manifest if f["origin"] == origin and f["dest"] == dest]
    
    # Step B: Get unique airlines on this route via set comprehension
    operating_airlines = {f["airline"] for f in route_flights}
    
    # Step C: Dict comprehension computing min fare per airline
    cheapest_by_airline = {
        airline: min(f["price"] for f in route_flights if f["airline"] == airline)
        for airline in operating_airlines
    }
    
    # Step D: Dict comprehension computing average fare per airline
    avg_by_airline = {
        airline: round(
            sum(f["price"] for f in route_flights if f["airline"] == airline) / 
            len([f for f in route_flights if f["airline"] == airline]), 
            2
        )
        for airline in operating_airlines
    }
    
    return cheapest_by_airline, avg_by_airline

# -------------------------------------------------------------
# Module 4: Route Frequency Matrix (Nested Comprehension)
# -------------------------------------------------------------
def build_route_matrix(manifest, hubs):
    """Constructs a 2D matrix counting flights between all airport pairs."""
    # Nested comprehension: Outer loop builds origin rows, inner loop counts flights to dest
    matrix = [
        [
            len([f for f in manifest if f["origin"] == orig and f["dest"] == dst])
            if orig != dst else "-"
            for dst in hubs
        ]
        for orig in hubs
    ]
    return matrix


# --- Execution & Verification ---
if __name__ == "__main__":
    hubs, airlines = get_unique_network_metadata(FLIGHT_MANIFEST)
    print("=== 1. Aviation Network Metadata (Set Comprehensions) ===")
    print("Active Airport Hubs :", hubs)
    print("Operating Carriers  :", airlines)

    print("\n=== 2. Flight Search: DEL to BOM (Budget <= ₹7,000, Non-Stop) ===")
    search_results = search_flights(FLIGHT_MANIFEST, origin="DEL", dest="BOM", max_budget=7000, non_stop_only=True)
    
    print(f"{'FLIGHT':<10} | {'AIRLINE':<12} | {'ROUTE':<12} | {'DEP TIME':<12} | {'DURATION':<8} | {'FINAL FARE'}")
    print("-" * 75)
    for r in search_results:
        print(f"{r['flight_no']:<10} | {r['carrier']:<12} | {r['route']:<12} | {r['departure']:<12} | {r['duration']:<8} | ₹{r['total_fare']}")

    print("\n=== 3. Carrier Price Intelligence for DEL ➔ BOM (Dict Comprehensions) ===")
    min_fares, avg_fares = compute_airline_summary(FLIGHT_MANIFEST, "DEL", "BOM")
    for carrier in sorted(min_fares.keys()):
        print(f"  {carrier:<12} : Starting at ₹{min_fares[carrier]:<5} | Route Avg: ₹{avg_fares[carrier]:,.2f}")

    print("\n=== 4. Hub-to-Hub Flight Frequency Matrix (Nested Comprehensions) ===")
    matrix_hubs = ["DEL", "BOM", "BLR"]
    matrix = build_route_matrix(FLIGHT_MANIFEST, matrix_hubs)
    
    # Print formatted matrix table
    header = f"{'ORIGIN':<8} | " + " | ".join(f"{h:^5}" for h in matrix_hubs)
    print(header)
    print("-" * len(header))
    for hub, row in zip(matrix_hubs, matrix):
        row_str = " | ".join(f"{str(cell):^5}" for cell in row)
        print(f"{hub:<8} | {row_str}")
```

---

## Expected Output

```text
=== 1. Aviation Network Metadata (Set Comprehensions) ===
Active Airport Hubs : ['BLR', 'BOM', 'DEL']
Operating Carriers  : ['Air India', 'IndiGo', 'SpiceJet', 'Vistara']

=== 2. Flight Search: DEL to BOM (Budget <= ₹7,000, Non-Stop) ===
FLIGHT     | AIRLINE      | ROUTE        | DEP TIME     | DURATION | FINAL FARE
---------------------------------------------------------------------------
6E-204     | IndiGo       | DEL ➔ BOM    | 06:00 hrs    | 2h 10m   | ₹5250
AI-802     | Air India    | DEL ➔ BOM    | 08:00 hrs    | 2h 20m   | ₹6650

=== 3. Carrier Price Intelligence for DEL ➔ BOM (Dict Comprehensions) ===
  Air India    : Starting at ₹6200 | Route Avg: ₹6,200.00
  IndiGo       : Starting at ₹4800 | Route Avg: ₹4,800.00
  SpiceJet     : Starting at ₹3900 | Route Avg: ₹3,900.00
  Vistara      : Starting at ₹7500 | Route Avg: ₹7,500.00

=== 4. Hub-to-Hub Flight Frequency Matrix (Nested Comprehensions) ===
ORIGIN   |  DEL  |  BOM  |  BLR 
--------------------------------
DEL      |   -   |   4   |   3  
BOM      |   2   |   -   |   2  
BLR      |   0   |   0   |   -  
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad Implementation | Gold-Standard Implementation |
| :--- | :--- | :--- |
| **Deduplication** | Looping over items and checking `if city not in list` | Set comprehension: `{f['origin'] for f in manifest}` |
| **Price Filtering** | Manual accumulator list with multiple nested `if`s | Single multi-condition list comprehension |
| **Aggregations** | Iterating 10 times to find minimums | Dict comprehension with `min()` and `sum()` generators |
| **Matrix Setup** | Manual nested loops appending row by row | `[[expr for col in cols] for row in rows]` |
| **Readability** | Giant single-line expressions without formatting | Format comprehensions with clear vertical indentation |

---

## Quick Revision Summary Cheat Sheet

- **Set Comprehensions:** Deduplicate unique identifiers (airports, airlines, user IDs) in $O(n)$ time.
- **List Comprehensions:** Filter and transform search results with multi-predicate conditions (`if f['origin'] == origin if f['price'] <= budget`).
- **Dictionary Comprehensions:** Compute group-level summaries and analytical indexes (`{k: min(...) for k in unique_keys}`).
- **Nested Comprehensions:** Generate cross-tabulation and adjacency matrices (`[[count for dst in hubs] for orig in hubs]`).

---

---

# Practice Challenge

### Scenario: Red-Eye Night Flight Discount Filter

Airlines offer promotional discounts on late-night **Red-Eye** flights (flights departing between **21:00 (9 PM)** and **05:00 (5 AM)**):
1. Write a list comprehension that filters only Red-Eye flights from `FLIGHT_MANIFEST` (`f["dep_hour"] >= 21 or f["dep_hour"] <= 5`).
2. Apply a **20% promotional discount** to the base price: `price * 0.80`.
3. Format each output record as: `"[DISCOUNTED] <FlightNo> (<Airline>) - New Price: ₹<Price> (Dep: <Hour>:00 hrs)"`.

### Starter Code
```python
# Using FLIGHT_MANIFEST from the main lesson
# TODO: Filter red-eye flights with 20% discount using list comprehension
```

### Complete Solution
```python
red_eye_deals = [
    f"[DISCOUNTED] {f['flight']} ({f['airline']}) - New Price: ₹{f['price'] * 0.80:.0f} (Dep: {f['dep_hour']:02d}:00 hrs)"
    for f in FLIGHT_MANIFEST
    if f["dep_hour"] >= 21 or f["dep_hour"] <= 5
]

print("=== Red-Eye Promotional Deals (20% Off) ===")
for deal in red_eye_deals:
    print(deal)
```

### Expected Output
```text
=== Red-Eye Promotional Deals (20% Off) ===
[DISCOUNTED] SG-442 (SpiceJet) - New Price: ₹2880 (Dep: 22:00 hrs)
```

---

## Practice Quiz

### 1. In the flight search engine, why is a set comprehension chosen to extract airport codes from the raw manifest?
A. Because airport codes must be converted into floats
B. Because it automatically discards repeated airport codes, returning each unique airport hub exactly once
C. Because set comprehensions sort items numerically
D. Because set comprehensions require administrative permissions
**Answer:** B
**Explanation:** A set comprehension enforces uniqueness using a hash table. Out of thousands of flight records, each distinct airport code is retained once without duplicates.

---

### 2. How does the operator | function between two sets: origins | destinations?
A. Performs bitwise XOR on the string characters
B. Computes the mathematical set Union, combining all unique elements from both sets
C. Deletes matching elements
D. Raises a TypeError
**Answer:** B
**Explanation:** The pipe operator `|` on Python sets performs a mathematical Set Union, merging unique elements from both sets into a single combined set.

---

### 3. What does the expression min(f["price"] for f in route_flights if f["airline"] == airline) inside the dictionary comprehension compute?
A. The total price of all flights
B. The lowest ticket price offered by that specific airline on the route
C. The flight with the shortest duration
D. The average flight cost
**Answer:** B
**Explanation:** It passes a generator expression into Python's built-in `min()` function, filtering for flights operated by the given `airline` and extracting the minimum `price`.

---

### 4. In the route matrix comprehension [[len(...) for dst in hubs] for orig in hubs], what does the outer loop represent?
A. The destination airport column
B. The origin airport row
C. The total flight price
D. The airline carrier name
**Answer:** B
**Explanation:** In a nested list comprehension `[[... for inner] for outer]`, the outer loop corresponds to the outer dimension (rows) and the inner loop corresponds to columns. Here, `orig` defines each origin airport row.

---

### 5. Why is {f["flight_no"]: f for f in flights} a valid dictionary comprehension?
A. Because flight numbers are unique identifiers that serve as hashable dictionary keys
B. Because flight numbers are floating-point numbers
C. Because dictionary values cannot be dictionaries
D. It is not valid Python syntax
**Answer:** A
**Explanation:** Flight numbers are immutable strings that uniquely identify individual flights, making them ideal hash keys for fast $O(1)$ dictionary lookups of complete flight record objects.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Arguments Recap (*args, **kwargs)** (2: Functions Deep Dive).

👉 **[Continue to Next Lesson: Arguments Recap (*args, **kwargs) →](/tutorials/python-for-intermediate/arguments-recap-args-kwargs)**
