# DRF Generic Views and ModelViewSet CRUD

Building enterprise APIs often involves writing identical CRUD endpoints across dozens of models. Writing raw `APIView` classes for every table introduces repetitive boilerplate. Django REST Framework solves this through **Generic Views** and **`ModelViewSet`**, delivering complete CRUD operations with minimal code.

---

## 1. DRF's Concrete Generic Views

DRF pairs `GenericAPIView` with CRUD mixins to provide ready-to-use concrete generic views:

| Generic View | Allowed Methods | Purpose |
| :--- | :--- | :--- |
| `ListAPIView` | `GET` | Read a collection of resources. |
| `CreateAPIView` | `POST` | Create a new resource. |
| `ListCreateAPIView` | `GET`, `POST` | Read collection and create new items. |
| `RetrieveAPIView` | `GET` | Read single resource by lookup field. |
| `UpdateAPIView` | `PUT`, `PATCH` | Update single resource. |
| `DestroyAPIView` | `DELETE` | Delete single resource. |
| `RetrieveUpdateDestroyAPIView` | `GET`, `PUT`, `PATCH`, `DELETE` | Complete single-resource management. |

```python
# articles/views.py
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Article
from .serializers import ArticleSerializer

class ArticleListCreateAPIView(ListCreateAPIView):
    queryset = Article.objects.select_related("author").all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Automatically attach author
        serializer.save(author=self.request.user)

class ArticleDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "slug"
```

---

## 2. The Complete CRUD Controller: `ModelViewSet`

Why write two separate generic views when a single `ModelViewSet` handles everything?

```python
# articles/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.select_related("author").all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "slug"

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        # Dynamically customize queryset based on caller
        if self.request.user.is_staff:
            return Article.objects.all()
        return Article.objects.filter(status="published")
```

---

## 3. Dynamic Serializers per Action

In enterprise applications, `list` views often need summary fields, while `retrieve` and `create` views require detailed or write-only fields. Override `get_serializer_class()`:

```python
class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return ArticleSummarySerializer
        elif self.action in ["create", "update"]:
            return ArticleWriteSerializer
        return ArticleDetailSerializer
```

---

## 4. Lifecycle Hooks for Business Logic

Generic views and ViewSets provide dedicated hooks to execute business logic without hacking method overrides:
- `perform_create(serializer)`: Called before saving a new instance.
- `perform_update(serializer)`: Called before updating an instance.
- `perform_destroy(instance)`: Called before deleting an instance (ideal for soft deletes).

---

## Practice Quiz

### Q1: What concrete generic view combines listing all items (GET) with creating a new item (POST)?
- A) ReadWriteAPIView
- B) ListCreateAPIView
- C) CollectionAPIView
- D) CRUDView
**Answer:** B
**Explanation:** ListCreateAPIView implements GET (for list queries) and POST (for resource creation) handlers out of the box.

### Q2: What is the primary difference between ListCreateAPIView and a ModelViewSet?
- A) ListCreateAPIView only handles collection endpoints (GET /items/, POST /items/), whereas ModelViewSet bundles both collection and individual detail endpoints (GET, PUT, PATCH, DELETE /items/{id}/) into one class
- B) ModelViewSet cannot connect to databases
- C) ListCreateAPIView is deprecated
- D) ModelViewSet runs on Node.js
**Answer:** A
**Explanation:** Generic views handle specific subsets of operations (like list+create), while ModelViewSet provides full CRUD coverage across both collection and detail routes.

### Q3: How do you serve different serializers for list vs detail actions in a ModelViewSet?
- A) You cannot; a ViewSet only supports one serializer
- B) By overriding the get_serializer_class(self) method and checking self.action == "list"
- C) In settings.py
- D) In the database schema
**Answer:** B
**Explanation:** Overriding get_serializer_class() allows inspecting self.action ('list', 'retrieve', 'create', etc.) to return tailored serializer classes dynamically.

### Q4: Which lifecycle hook should you override to implement "soft deletion" (marking is_deleted=True instead of executing SQL DELETE)?
- A) perform_destroy(self, instance)
- B) delete_object(self)
- C) on_delete()
- D) soft_delete_instance()
**Answer:** A
**Explanation:** perform_destroy(self, instance) is the hook that executes deletion; overriding it allows setting instance.is_deleted = True and instance.save() instead of calling instance.delete().

### Q5: What does setting lookup_field = "slug" on a ModelViewSet accomplish?
- A) It deletes the primary key column
- B) It instructs DRF to look up individual records using the model's slug attribute instead of the default pk (id) in detail URLs
- C) It converts slugs into numbers
- D) It bypasses permissions
**Answer:** B
**Explanation:** By default, DRF looks up objects by pk; setting lookup_field = 'slug' configures detail endpoints to identify records via their slug string.
