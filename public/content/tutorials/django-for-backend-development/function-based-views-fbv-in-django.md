# Function-Based Views (FBV)

In Django, **Function-Based Views (FBVs)** are Python functions that receive an `HttpRequest` object and return an `HttpResponse`. Because they are standard Python functions, FBVs are explicit, straightforward to read, and ideal for custom business workflows, multi-step wizards, or endpoints where class-based inheritance obscures control flow.

---

## 1. Anatomy of a Function-Based View

```python
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, Http404
from .models import Article

def article_detail_view(request, slug):
    # 1. Inspect HTTP method
    if request.method != "GET":
        return HttpResponse("Method Not Allowed", status=405)

    # 2. Database query with safe 404 handler
    article = get_object_or_404(Article, slug=slug, status="published")

    # 3. Render template with context
    return render(request, "articles/detail.html", {
        "article": article,
        "page_title": article.title,
    })
```

---

## 2. Defensive Programming with `get_object_or_404`

A common beginner anti-pattern is using `Article.objects.get()` directly in views:

```python
# ❌ Dangerous: Throws unhandled Article.DoesNotExist exception -> 500 Server Error!
article = Article.objects.get(id=article_id)

# ✅ Enterprise Standard: Gracefully raises Http404 exception -> Clean 404 Page
article = get_object_or_404(Article, id=article_id)
```

---

## 3. Essential View Decorators

Django provides decorators to enforce protocols, authentication, and HTTP methods declaratively:

```python
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods, require_POST
from django.views.decorators.csrf import csrf_protect

# Enforce login and restrict strictly to POST requests
@login_required
@require_POST
def delete_article_view(request, article_id):
    article = get_object_or_404(Article, id=article_id, author=request.user)
    article.delete()
    return redirect("articles:home")
```

- `@login_required`: Redirects anonymous users to the login page (`settings.LOGIN_URL`).
- `@require_POST`: Automatically returns `405 Method Not Allowed` if accessed via `GET`.
- `@require_http_methods(["GET", "POST"])`: Whitelists permitted HTTP verbs.

---

## 4. Reading Query Parameters and Request Payloads

```python
def search_view(request):
    # Query parameters: ?q=django&sort=newest
    query = request.GET.get("q", "").strip()
    sort_order = request.GET.get("sort", "newest")

    # POST body data:
    payload = request.POST.get("comment_body")

    # Uploaded files:
    uploaded_image = request.FILES.get("avatar")

    # Request headers and client IP:
    user_agent = request.headers.get("User-Agent")
    remote_ip = request.META.get("REMOTE_ADDR")
```

---

## 5. Returning JSON Responses

For AJAX endpoints or lightweight APIs:

```python
def api_stats_view(request):
    data = {
        "active_users": 1420,
        "uptime_percent": 99.98,
        "region": "us-east-1",
    }
    return JsonResponse(data)
```

---

## Practice Quiz

### Q1: Why is get_object_or_404 preferred over Model.objects.get() in Django views?
- A) It runs 10x faster
- B) If the object is not found, Model.objects.get() raises a DoesNotExist exception resulting in a 500 crash, while get_object_or_404 catches it and returns an HTTP 404 response
- C) It deletes the object automatically
- D) It formats output into JSON
**Answer:** B
**Explanation:** get_object_or_404 catches the model's DoesNotExist exception and raises Http404 instead, ensuring missing records return clean 404 responses rather than 500 server crashes.

### Q2: How do you safely read an optional query parameter like ?page=2 in a view without throwing a KeyError?
- A) request.GET['page']
- B) request.GET.get('page', 1)
- C) request.params('page')
- D) request.query.page
**Answer:** B
**Explanation:** request.GET is a QueryDict; using .get('key', default) safely retrieves the value or returns the provided default if the key is absent.

### Q3: What HTTP status code does the @require_POST decorator return if a client sends a GET request?
- A) 400 Bad Request
- B) 404 Not Found
- C) 405 Method Not Allowed
- D) 500 Internal Server Error
**Answer:** C
**Explanation:** @require_POST inspects request.method and returns an HttpResponseNotAllowed (HTTP 405) with appropriate Allow headers if the method is not POST.

### Q4: Where does the @login_required decorator redirect unauthenticated visitors by default?
- A) To the homepage
- B) To the URL path defined in settings.LOGIN_URL (defaulting to /accounts/login/) with a ?next= query parameter
- C) To Google
- D) To a 403 Forbidden page
**Answer:** B
**Explanation:** @login_required intercepts unauthenticated requests and redirects to settings.LOGIN_URL, appending ?next=/target/ so users return to their intended page upon login.

### Q5: When are Function-Based Views (FBVs) typically preferred over Class-Based Views (CBVs)?
- A) For simple, explicit procedural logic, one-off specialized endpoints, or when complex inheritance trees make class-based code difficult to read
- B) Only when using SQLite
- C) FBVs are mandatory for all production systems
- D) Never; FBVs are deprecated
**Answer:** A
**Explanation:** FBVs are explicit, clean, and straightforward for unique procedural logic where CBV boilerplate and method overrides create unnecessary complexity.
