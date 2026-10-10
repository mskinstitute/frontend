# DRF Pagination: PageNumber, LimitOffset, and Cursor

Returning a flat JSON array of 500,000 database rows in a single HTTP response crashes client browsers, exhausts server memory, and degrades network latency. **Pagination** segments large QuerySets into manageable chunks. Django REST Framework provides three distinct pagination schemes: **PageNumberPagination**, **LimitOffsetPagination**, and **CursorPagination**.

---

## 1. Comparing DRF's Three Pagination Styles

| Pagination Style | URL Signature | Database Performance | Stable against Insertions? | Client Experience |
| :--- | :--- | :--- | :--- | :--- |
| **`PageNumberPagination`** | `?page=3&page_size=20` | Moderate (`OFFSET`) | **No** (duplicate/skipped items) | Classic page numbers (1, 2, 3) |
| **`LimitOffsetPagination`**| `?limit=25&offset=50` | Moderate (`OFFSET`) | **No** (page drift on insert) | Flexible custom slice loading |
| **`CursorPagination`** | `?cursor=cD0yMDI2LTA...` | **Optimal (O(1) B-tree)**| **Yes (100% resilient)** | Infinite scroll, live feeds |

---

## 2. PageNumberPagination (Classic Page Numbers)

```python
# api/pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size" # Allows client to override page size
    max_page_size = 100                  # Protects against DoS via ?page_size=100000
    page_query_param = "page"
```

Response Envelope:
```json
{
  "count": 1420,
  "next": "https://api.enterprise.com/v1/articles/?page=3",
  "previous": "https://api.enterprise.com/v1/articles/?page=1",
  "results": [
    { "id": 41, "title": "Understanding WebSockets" }
  ]
}
```

---

## 3. LimitOffsetPagination (Flexible Range Slicing)

Maps directly to SQL `LIMIT` and `OFFSET`:

```python
from rest_framework.pagination import LimitOffsetPagination

class CustomLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 25
    limit_query_param = "limit"
    offset_query_param = "offset"
    max_limit = 100
```

Client Query:
```http
GET /api/v1/articles/?limit=10&offset=40  # Fetches items 41 through 50
```

---

## 4. CursorPagination (Infinite Scroll & High Scale)

Both `PageNumber` and `LimitOffset` rely on SQL `OFFSET`. As `OFFSET` increases into millions (`OFFSET 1000000`), the database must scan and discard 1,000,000 rows, crippling performance. Furthermore, if a new item is inserted while a user browses page 1, items shift, causing duplicate entries on page 2.

**`CursorPagination`** uses an opaque encoded pointer referencing a specific row (e.g. timestamp or ID):
- Uses SQL `WHERE created_at < cursor LIMIT 20` (Instant B-Tree lookup!).
- 100% immune to missing or duplicate items during real-time writes.

```python
from rest_framework.pagination import CursorPagination

class FeedCursorPagination(CursorPagination):
    page_size = 25
    cursor_query_param = "cursor"
    ordering = "-created_at" # Ordering MUST be deterministic!
```

Response:
```json
{
  "next": "https://api.enterprise.com/v1/feed/?cursor=cD0yMDI2LTA5LTE1VDA0...",
  "previous": null,
  "results": [...]
}
```

Notice: `count` is omitted because calculating `SELECT COUNT(*)` on massive tables is expensive!

---

## 5. Attaching Pagination to ViewSets

```python
class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = StandardResultsSetPagination
```

---

## Practice Quiz

### Q1: Why does SQL OFFSET become slow on deep pagination (e.g. ?page=10000)?
- A) Browsers refuse to open high page numbers
- B) The database engine must scan and discard the first 200,000 rows before returning the requested 20 rows, consuming heavy CPU and I/O
- C) Page numbers cannot exceed 100
- D) Python runs out of RAM
**Answer:** B
**Explanation:** High SQL OFFSET values force the database engine to traverse and discard all preceding rows, resulting in severe degradation on large tables.

### Q2: What is the primary advantage of CursorPagination over PageNumberPagination?
- A) CursorPagination displays page numbers 1, 2, 3
- B) It uses index-based lookups (WHERE created_at < x) rather than offsets, ensuring O(1) query speeds and preventing duplicate/skipped items when new rows are inserted in real time
- C) It converts JSON to CSV
- D) It only works with SQLite
**Answer:** B
**Explanation:** CursorPagination uses indexed key comparisons rather than OFFSET, offering constant-time performance and complete stability against concurrent data insertions.

### Q3: Why is max_page_size critical on custom PageNumberPagination classes?
- A) To prevent clients from requesting ?page_size=500000 and triggering a Denial of Service (DoS) by forcing the database and server memory to serialize massive payloads
- B) It is required by HTML5
- C) To delete excess database records
- D) To enable caching
**Answer:** A
**Explanation:** Guarding pagination with max_page_size prevents malicious or naive clients from crashing the server by requesting millions of records in a single payload.

### Q4: Why does CursorPagination omit the total count property from its JSON response?
- A) Counting records is forbidden in REST
- B) Executing SELECT COUNT(*) across millions of rows requires a full table or index scan, defeating the performance optimization of cursor pagination
- C) It is a bug in DRF
- D) JavaScript cannot parse counts
**Answer:** B
**Explanation:** Full table counts are computationally expensive on high-volume tables; omitting count preserves sub-millisecond query performance for infinite feeds.

### Q5: How can a client disable pagination for a specific request if allowed by the view?
- A) By passing ?pagination=off (if page_size_query_param is configured and None/null is sent)
- B) By deleting the URL
- C) By using HTTP PUT
- D) Pagination can never be disabled
**Answer:** A
**Explanation:** If page_size_query_param is defined, clients can request all items or disable pagination if the view permits (though production systems generally cap this via max_page_size).
