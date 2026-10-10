# DRF Throttling: AnonRate, UserRate, and Scoped Throttles

Unrestricted APIs are vulnerable to brute-force attacks, scraping, and Denial of Service (DoS) outages. **Throttling (Rate Limiting)** restricts the number of requests a client can issue within a given time window. Django REST Framework includes a robust, cache-backed throttling engine supporting anonymous rate limits, authenticated user tiers, and scoped endpoint limits.

---

## 1. How Throttling Operates in DRF

DRF tracks request counts in Django's cache backend (typically **Redis** or Memcached). On every incoming request:
1. DRF identifies the client: by IP address for anonymous users, or by `user_id` for authenticated users.
2. It checks request history in the cache against the configured rate.
3. If the threshold is exceeded, DRF raises `Throttled`, returning **HTTP 429 Too Many Requests** with a `Retry-After` header.

---

## 2. Built-in Throttle Classes

- **`AnonRateThrottle`:** Limits unauthenticated users based on their IP address (`REMOTE_ADDR` or `X-Forwarded-For`).
- **`UserRateThrottle`:** Limits authenticated users based on their unique `user.pk`.
- **`ScopedRateThrottle`:** Applies custom limits to specific sensitive views via a `throttle_scope` attribute (e.g. login, checkout, password reset).

---

## 3. Global Configuration in `settings.py`

```python
# config/settings.py
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "60/minute",        # Max 60 requests/min per IP
        "user": "1000/hour",        # Max 1000 requests/hour per authenticated user
        "burst": "10/second",       # Burst protection
        "auth_login": "5/minute",   # Sensitive brute-force protection
        "payment": "3/minute",      # Payment mutation guard
    },
}
```

Allowed rate time periods: `second`, `minute`, `hour`, `day` (e.g. `"100/day"`, `"5/sec"`).

---

## 4. Applying `ScopedRateThrottle` to Sensitive Endpoints

Guarding authentication endpoints against credential stuffing and brute-force attacks:

```python
# accounts/views.py
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.response import Response

class LoginAPIView(APIView):
    # Enforce scoped rate limit
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login" # Maps to 'auth_login': '5/minute' in settings!

    def post(self, request):
        # Even if attacker has thousands of passwords, they can only attempt 5/min!
        ...
```

---

## 5. Tiered Subscription Rate Limiting (SaaS Plans)

For SaaS platforms with Free, Pro, and Enterprise pricing tiers, create a custom throttle class:

```python
# api/throttles.py
from rest_framework.throttling import UserRateThrottle

class SubscriptionTierThrottle(UserRateThrottle):
    def get_rate(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return "60/minute"

        tier = getattr(user, "subscription_tier", "free")
        if tier == "enterprise":
            return "10000/hour"
        elif tier == "pro":
            return "3000/hour"
        return "500/hour"
```

---

## Practice Quiz

### Q1: What HTTP status code is returned when a client breaches an API throttle limit?
- A) 400 Bad Request
- B) 403 Forbidden
- C) 429 Too Many Requests
- D) 503 Service Unavailable
**Answer:** C
**Explanation:** HTTP 429 Too Many Requests is the standard status code indicating the client has exceeded rate limits, often accompanied by a Retry-After header.

### Q2: How does AnonRateThrottle identify unauthenticated callers?
- A) By browser cookies
- B) By the client's IP address (derived from REMOTE_ADDR or X-Forwarded-For)
- C) By the user's MAC address
- D) By username
**Answer:** B
**Explanation:** AnonRateThrottle relies on the client's IP address to uniquely track request frequencies for anonymous visitors.

### Q3: Where does DRF store request timestamps and counters for active throttles?
- A) In the SQL database table
- B) In Django's configured cache backend (such as Redis or Memcached)
- C) In browser localStorage
- D) In text log files
**Answer:** B
**Explanation:** Throttling uses Django's cache framework (preferably in-memory Redis) for fast O(1) counter increments without adding disk or SQL overhead.

### Q4: How does ScopedRateThrottle determine which rate limit to enforce on a view?
- A) It inspects the view's throttle_scope attribute and matches it to a corresponding key in DEFAULT_THROTTLE_RATES
- B) It reads the URL string
- C) It counts lines of code in the view
- D) It uses random numbers
**Answer:** A
**Explanation:** ScopedRateThrottle reads the throttle_scope string set on the view class and looks up the rate limit defined under that key in settings.

### Q5: What header informs the client how many seconds they must wait before sending another request after being throttled?
- A) Wait-Time
- B) Retry-After
- C) X-Throttle-Delay
- D) Next-Request-In
**Answer:** B
**Explanation:** In compliance with HTTP standards, DRF includes the Retry-After header in 429 responses, specifying the number of seconds the client must pause.
