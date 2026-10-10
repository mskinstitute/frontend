# DRF SearchFilter and OrderingFilter

While `DjangoFilterBackend` performs exact and structured field matches, users frequently need a single search input to query multiple text fields simultaneously (e.g. searching across customer name, order ID, and notes), as well as interactive column sorting. DRF includes **`SearchFilter`** and **`OrderingFilter`** out of the box.

---

## 1. Enabling `SearchFilter` and `OrderingFilter`

Configure backends on your ViewSet:

```python
# api/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.select_related("author").all()
    serializer_class = ArticleSerializer
    
    # Enable all three complementary backends
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    # 1. Exact field filtering
    filterset_fields = ["status", "category"]
    
    # 2. Text search fields
    search_fields = ["title", "content", "author__username", "=slug"]
    
    # 3. Dynamic sorting fields
    ordering_fields = ["created_at", "view_count", "title"]
    ordering = ["-created_at"] # Default fallback ordering
```

---

## 2. Advanced Search Prefixes

DRF's `SearchFilter` supports regex and lookup prefixes in `search_fields`:

| Prefix | Lookup Syntax | Meaning | Example |
| :--- | :--- | :--- | :--- |
| *(None)* | `icontains` | Case-insensitive partial match | `"title"` matches `"django"` anywhere in title |
| **`^`** | `istartswith`| Case-insensitive prefix match | `"^title"` matches words starting with term |
| **`=`** | `iexact` | Case-insensitive exact match | `"=slug"` matches exact slug string only |
| **`@`** | Full-text | PostgreSQL full-text search index| `"@content"` (PostgreSQL only) |
| **`$`** | Regex | Case-insensitive regular expression | `"$title"` matches regex pattern |

```python
search_fields = ["^title", "=slug", "author__email"]
```

---

## 3. Client URL Usage

Clients use the `?search=` and `?ordering=` query parameters:

### Multi-column Text Search:
```http
# Searches for 'microservice' in title, content, or author username
GET /api/v1/articles/?search=microservice
```

### Dynamic Column Sorting:
```http
# Sort ascending by view_count:
GET /api/v1/articles/?ordering=view_count

# Sort descending by view_count (using minus sign '-'):
GET /api/v1/articles/?ordering=-view_count

# Multi-column sorting (views descending, then title ascending):
GET /api/v1/articles/?ordering=-view_count,title
```

---

## 4. Customizing Query Parameter Names

If your API convention requires `?q=` instead of `?search=` or `?sort=` instead of `?ordering=`:

```python
# config/settings.py
REST_FRAMEWORK = {
    "SEARCH_PARAM": "q",
    "ORDERING_PARAM": "sort",
}
```

Now requests can use `/api/v1/articles/?q=docker&sort=-created_at`.

---

## Practice Quiz

### Q1: What query parameter does DRF's SearchFilter inspect by default?
- A) ?filter=
- B) ?search=
- C) ?q=
- D) ?query=
**Answer:** B
**Explanation:** By default, SearchFilter queries the search query parameter (e.g. ?search=term), unless SEARCH_PARAM is customized in settings.

### Q2: What search prefix enforces an exact case-insensitive match (=slug) in search_fields?
- A) ^
- B) =
- C) @
- D) $
**Answer:** B
**Explanation:** The = prefix maps to iexact matching, requiring the field value to match the search query exactly.

### Q3: How does a client specify descending sort order using DRF's OrderingFilter?
- A) ?ordering=desc(view_count)
- B) By prefixing the field name with a hyphen/minus sign: ?ordering=-view_count
- C) ?ordering=view_count:desc
- D) ?sort_order=reverse
**Answer:** B
**Explanation:** In alignment with Django ORM syntax, prefixing a field with - (e.g. -created_at) requests descending sort order.

### Q4: Why is it critical to explicitly define ordering_fields on your ViewSet?
- A) To speed up Python compilation
- B) To prevent users from sorting by arbitrary or unindexed sensitive database columns (e.g. ?ordering=password_hash) which can leak timing information or degrade performance
- C) DRF will crash without it
- D) To format numbers
**Answer:** B
**Explanation:** Defining ordering_fields whitelists which columns clients are permitted to sort by, blocking denial-of-service queries against unindexed columns.

### Q5: How do you sort by multiple columns simultaneously with OrderingFilter?
- A) Comma-separated field names in the query parameter (e.g. ?ordering=-created_at,title)
- B) Sending two separate HTTP requests
- C) Repeating the parameter: ?ordering=-created_at&ordering=title
- D) Multi-column sorting is unsupported
**Answer:** A
**Explanation:** OrderingFilter accepts comma-delimited strings to sort sequentially across multiple columns (e.g. ?ordering=-priority,created_at).
