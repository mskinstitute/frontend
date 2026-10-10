# Routing APIs with DRF

When working with Django REST Framework `ViewSets`, manually writing individual `path()` entries for every CRUD endpoint (`list`, `create`, `retrieve`, `update`, `destroy`) is tedious and error-prone. **DRF Routers** automatically generate standardized, consistent RESTful URL routing schemes, including trailing slash management and the browsable API root.

---

## 1. How DRF Routers Work

A DRF router inspects a `ViewSet` and automatically generates the complete set of standard REST URL patterns:

```
ArticleViewSet registered at 'articles':
GET    /api/v1/articles/          ──► ArticleViewSet.list()
POST   /api/v1/articles/          ──► ArticleViewSet.create()
GET    /api/v1/articles/{slug}/   ──► ArticleViewSet.retrieve()
PUT    /api/v1/articles/{slug}/   ──► ArticleViewSet.update()
PATCH  /api/v1/articles/{slug}/   ──► ArticleViewSet.partial_update()
DELETE /api/v1/articles/{slug}/   ──► ArticleViewSet.destroy()
```

---

## 2. Configuring `DefaultRouter` vs `SimpleRouter`

DRF provides two main router classes:

- **`SimpleRouter`:** Generates only the basic CRUD URL patterns.
- **`DefaultRouter`:** Extends `SimpleRouter` by adding a default **API Root** endpoint displaying hyperlinks to all registered resources, as well as optional `.json` / format suffix patterns.

```python
# articles/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, CategoryViewSet

# 1. Instantiate the router
router = DefaultRouter()

# 2. Register viewsets with URL prefixes
router.register(r"articles", ArticleViewSet, basename="article")
router.register(r"categories", CategoryViewSet, basename="category")

# 3. Include router.urls in urlpatterns
app_name = "articles_api"

urlpatterns = [
    path("", include(router.urls)),
]
```

Visiting `http://127.0.0.1:8000/api/v1/` renders DRF's interactive Browsable API Root with clickable links to `/articles/` and `/categories/`!

---

## 3. When is `basename` Required?

If a `ViewSet` has a `queryset` attribute, DRF automatically derives the `basename` from the model name:
```python
class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all() # DRF automatically uses basename="article"
```

However, if your ViewSet **overrides `get_queryset()`** and omits the static `queryset` attribute, you **must** specify `basename`:
```python
router.register(r"my-articles", MyArticlesViewSet, basename="my-article")
```

---

## 4. Nested Routers with `drf-nested-routers`

For hierarchical REST APIs (e.g. `/articles/{article_id}/comments/{comment_id}/`), use the `drf-nested-routers` package:

```python
from rest_framework_nested import routers
from .views import ArticleViewSet, CommentViewSet

# Parent router
router = routers.SimpleRouter()
router.register(r"articles", ArticleViewSet)

# Nested child router
articles_router = routers.NestedSimpleRouter(router, r"articles", lookup="article")
articles_router.register(r"comments", CommentViewSet, basename="article-comments")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(articles_router.urls)),
]
```

---

## Practice Quiz

### Q1: What is the primary advantage of using DRF Routers with ViewSets?
- A) They make Python run multithreaded
- B) They automatically wire and generate standardized RESTful URL patterns for all CRUD actions without writing repetitive path() entries
- C) They encrypt URLs with AES-256
- D) They eliminate database migrations
**Answer:** B
**Explanation:** Routers automatically configure standard REST URL patterns (GET, POST, PUT, PATCH, DELETE) for registered ViewSets, ensuring consistent routing conventions.

### Q2: What extra feature does DefaultRouter offer over SimpleRouter?
- A) DefaultRouter generates a default API Root view displaying hyperlinked access to all registered endpoints in the browsable API
- B) DefaultRouter is 50% faster
- C) SimpleRouter is deprecated
- D) DefaultRouter connects to Redis
**Answer:** A
**Explanation:** DefaultRouter creates an API Root endpoint linking to all registered resources and adds optional format suffixes (.json), whereas SimpleRouter only creates resource paths.

### Q3: When is the basename parameter strictly mandatory when calling router.register()?
- A) Always on every viewset
- B) When the ViewSet does not define a static queryset attribute (e.g. when it only overrides get_queryset())
- C) Only on Windows
- D) Never
**Answer:** B
**Explanation:** DRF deduces base names from the model defined on the static queryset attribute. If queryset is omitted, DRF cannot infer the name and requires an explicit basename.

### Q4: How does DRF's router construct the named URL for a retrieve action on a viewset registered with basename="article"?
- A) article-get
- B) article-detail
- C) article-retrieve
- D) article:show
**Answer:** B
**Explanation:** DRF routers follow standard naming conventions: basename-list for collection routes, and basename-detail for individual item routes.

### Q5: What package provides clean URL routing for nested endpoints like /articles/{id}/comments/?
- A) django-nested-urls
- B) drf-nested-routers
- C) django-rest-hierarchy
- D) router-builder
**Answer:** B
**Explanation:** drf-nested-routers is the industry standard extension for constructing nested parent-child resource relationships in Django REST Framework.
