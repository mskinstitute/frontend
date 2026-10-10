# Performance Caching with Flask-Caching

Serving high-traffic web applications requires minimizing redundant database queries and expensive computations. If 10,000 users request your course catalog homepage every minute, running the exact same SQL queries 10,000 times wastes database CPU and degrades response times.

**Flask-Caching** is the standard extension for caching view responses, database query results, and arbitrary Python functions using in-memory caches or **Redis**.

---

## 1. Installing and Configuring Flask-Caching

```bash
pip install Flask-Caching redis
```

In `app.py`:

```python
from flask import Flask
from flask_caching import Cache

app = Flask(__name__)

# Configure Redis cache backend
app.config["CACHE_TYPE"] = "RedisCache"
app.config["CACHE_REDIS_URL"] = "redis://localhost:6379/1"
app.config["CACHE_DEFAULT_TIMEOUT"] = 300  # Default cache expiry: 5 minutes

# Initialize extension
cache = Cache(app)
```

### Cache Backends Comparison:
- `SimpleCache`: Local Python dictionary memory cache (single-process development only).
- `RedisCache`: Production-grade distributed in-memory cache shared across multiple Gunicorn workers.
- `MemcachedCache`: High-throughput key-value memory cache.
- `NullCache`: Disables caching entirely (useful for testing).

---

## 2. Caching Entire View Responses (`@cache.cached`)

To cache the full HTML or JSON output of a route:

```python
@app.route("/api/v1/stats")
@cache.cached(timeout=60) # Cached for 60 seconds
def get_global_statistics():
    # Simulated heavy aggregation query across millions of rows
    stats = {
        "total_students": Student.query.count(),
        "total_courses": Course.query.count(),
        "active_enrollments": 14250
    }
    return jsonify(stats)
```

The first request executes the database query and stores the output in Redis. All subsequent requests for the next 60 seconds return directly from Redis in **under 3 milliseconds**!

---

## 3. Query Parameter-Aware Caching (`query_string=True`)

If your endpoint accepts query parameters (like pagination or search filters), you **must** set `query_string=True` so different query strings create distinct cache keys:

```python
@app.route("/courses")
@cache.cached(timeout=120, query_string=True)
def list_courses():
    # /courses?page=1 and /courses?page=2 get cached separately!
    page = request.args.get("page", 1, type=int)
    courses = Course.query.paginate(page=page, per_page=12)
    return render_template("courses.html", courses=courses)
```

---

## 4. Caching Expensive Functions (`@cache.memoize`)

When you want to cache the output of a specific internal function based on its input arguments:

```python
@cache.memoize(timeout=3600)
def calculate_user_analytics(user_id):
    print(f"Executing complex calculation for User {user_id}...")
    # Heavy aggregation logic
    return {"user_id": user_id, "score": 98.4}
```

---

## 5. Cache Invalidation (`cache.delete` / `cache.delete_memoized`)

When underlying database records change, stale cache entries must be evicted immediately:

```python
@app.route("/api/v1/courses/new", methods=["POST"])
def create_course():
    # ... persist new course to database ...
    
    # Invalidate cached view so users see the new course immediately!
    cache.delete_memoized(list_courses)
    cache.delete("view//courses")
    return {"status": "Created"}, 201
```

---

## Practice Quiz

### Q1: What happens on the second request to an endpoint decorated with `@cache.cached(timeout=60)`?
- A) The view function runs again and overwrites the cache
- B) Flask skips running the view function and returns the cached response directly from Redis/memory
- C) Flask returns an HTTP 304 Not Modified status
- D) The database drops connection
**Answer:** B
**Explanation:** When a cached route is requested before its timeout expires, Flask-Caching bypasses the view function entirely and serves the response directly from the cache.

### Q2: Why is `query_string=True` mandatory when caching endpoints with pagination or search filters?
- A) To encrypt query parameters
- B) So requests with different parameters (e.g. `?page=1` vs `?page=2`) generate unique cache keys instead of serving page 1 to everyone
- C) To validate SQL queries
- D) To prevent XSS attacks
**Answer:** B
**Explanation:** Without `query_string=True`, the cache key is based only on the URL path, meaning `/courses?page=2` would incorrectly receive the cached response of `/courses?page=1`.

### Q3: What is the primary difference between `@cache.cached` and `@cache.memoize`?
- A) `@cache.cached` caches view responses; `@cache.memoize` caches function return values based on their arguments
- B) `@cache.memoize` only works with SQLite
- C) `@cache.cached` is deprecated
- D) There is no difference
**Answer:** A
**Explanation:** `@cache.cached` is designed for routes and views, while `@cache.memoize` is used on standalone functions to cache results mapped to specific input parameter combinations.

### Q4: Which cache backend should be used for production deployments running multiple Gunicorn workers?
- A) `SimpleCache`
- B) `RedisCache` or `MemcachedCache`
- C) `FileSystemCache` on localhost
- D) `NullCache`
**Answer:** B
**Explanation:** In production with multiple worker processes, an external centralized cache (like Redis) ensures all workers share the same cached entries.

### Q5: What does "cache invalidation" mean in web application architecture?
- A) Turning off the server
- B) Removing or refreshing stale cached data when the underlying database records are updated or deleted
- C) Clearing browser cookies
- D) Re-installing Redis
**Answer:** B
**Explanation:** Cache invalidation ensures users see fresh data by purging or updating cached copies as soon as source database entities mutate.
