# DRF DjangoFilterBackend and Custom FilterSets

Filtering API results allows clients to query exact subsets of data without writing customized view methods. While naive filtering can be accomplished using `request.query_params.get()`, enterprise REST APIs use **`django-filter`** paired with DRF's **`DjangoFilterBackend`** to provide declarative, type-safe filtering across fields, date ranges, lookups, and relational models.

---

## 1. Installing and Configuring `django-filter`

```bash
pip install django-filter
```

Enable `DjangoFilterBackend` in `settings.py`:

```python
# config/settings.py
INSTALLED_APPS = [
    # ...
    "django_filters",
]

REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}
```

---

## 2. Basic Filtering with `filterset_fields`

On simple models, declare allowed filter attributes directly on your `ViewSet`:

```python
# api/views.py
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend]
    # Simple exact matching on status and customer
    filterset_fields = ["status", "customer", "is_paid"]
```

Clients can now filter via URL query parameters:
```http
GET /api/v1/orders/?status=completed&is_paid=true
```

---

## 3. Advanced Filtering with Custom `FilterSet`

For date ranges, minimum/maximum numeric thresholds, case-insensitive partial searches, and multi-value lookups, create a dedicated `FilterSet`:

```python
# api/filters.py
import django_filters
from .models import Order

class OrderFilter(django_filters.FilterSet):
    # 1. Numeric thresholds (min_total <= total_amount <= max_total)
    min_total = django_filters.NumberFilter(field_name="total_amount", lookup_expr="gte")
    max_total = django_filters.NumberFilter(field_name="total_amount", lookup_expr="lte")

    # 2. Date ranges
    start_date = django_filters.DateFilter(field_name="created_at", lookup_expr="date__gte")
    end_date = django_filters.DateFilter(field_name="created_at", lookup_expr="date__lte")

    # 3. Multiple choice filtering (status=pending,shipped)
    status = django_filters.BaseInFilter(field_name="status")

    # 4. Filter spanning related Foreign Key models
    customer_country = django_filters.CharFilter(
        field_name="customer__address__country",
        lookup_expr="iexact"
    )

    class Meta:
        model = Order
        fields = ["status", "is_paid", "min_total", "max_total", "start_date", "end_date"]
```

Attach the `FilterSet` to your ViewSet:

```python
class OrderViewSet(ModelViewSet):
    queryset = Order.objects.select_related("customer").all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = OrderFilter # Uses custom advanced filter class
```

Client Query Example:
```http
GET /api/v1/orders/?min_total=500&start_date=2026-01-01&status=shipped,delivered
```

---

## 4. Method-Based Custom Filter Logic

When a filter requires procedural calculation:

```python
class OrderFilter(django_filters.FilterSet):
    has_discount = django_filters.BooleanFilter(method="filter_has_discount")

    def filter_has_discount(self, queryset, name, value):
        if value is True:
            return queryset.filter(discount_code__isnull=False)
        elif value is False:
            return queryset.filter(discount_code__isnull=True)
        return queryset
```

---

## Practice Quiz

### Q1: What package is the official standard for advanced declarative filtering in Django REST Framework?
- A) drf-search
- B) django-filter
- C) django-query-filter
- D) rest-filter-tool
**Answer:** B
**Explanation:** django-filter (and its DjangoFilterBackend adapter) provides declarative filtering, range lookups, and integration with DRF ViewSets.

### Q2: How do you configure a filter for a "greater than or equal to" threshold in a custom FilterSet?
- A) price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
- B) price_min = django_filters.GreaterThan("price")
- C) price_min = django_filters.Range("price")
- D) price_min = django_filters.Filter("price >= x")
**Answer:** A
**Explanation:** Setting lookup_expr="gte" maps the incoming parameter to Django ORM's double-underscore __gte operator.

### Q3: What attribute on a ViewSet connects a custom django_filters.FilterSet class?
- A) filter_class
- B) filterset_class
- C) custom_filter
- D) filter_backend
**Answer:** B
**Explanation:** In modern DRF and django-filter versions, filterset_class binds the custom FilterSet definition to the generic view or ViewSet.

### Q4: Can django-filter filter across foreign key relationships (e.g. filtering orders by customer__email)?
- A) No, only direct model columns can be filtered
- B) Yes, by using double-underscore paths in field_name (e.g. field_name="customer__email")
- C) Only on MySQL
- D) Only using raw SQL
**Answer:** B
**Explanation:** django-filter fully leverages Django's ORM capabilities, allowing field_name="parent__child__column" relationship traversing.

### Q5: What does the BaseInFilter filter type accomplish?
- A) It deletes invalid input
- B) It allows clients to pass comma-separated lists of values (e.g. ?status=draft,published) mapped to SQL WHERE IN clauses
- C) It converts strings to integers
- D) It checks if input is in uppercase
**Answer:** B
**Explanation:** BaseInFilter splits comma-separated strings into lists, mapping them directly to Django's __in query lookup.
