# APIView & ViewSet

Django REST Framework provides layered abstractions for handling HTTP requests. From low-level, fully customized **`APIView`** classes to high-level automated **`ModelViewSet`** controllers, choosing the appropriate abstraction level accelerates development while preserving architectural flexibility.

---

## 1. DRF View Abstraction Levels

```
Level 1: @api_view decorator (Functional) - Explicit, simple
Level 2: APIView (Class-based) - Granular control over GET, POST, PUT, DELETE
Level 3: Generic Views (ListCreateAPIView, RetrieveUpdateDestroyAPIView) - Fast boilerplate-free CRUD
Level 4: ViewSets (ModelViewSet) - Bundles list, create, retrieve, update, destroy into 1 class!
```

---

## 2. Granular Control with `APIView`

`APIView` subclasses Django's `View` class, adding request parsing, authentication policies, permission checks, and standard DRF `Response` objects:

```python
# articles/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Article
from .serializers import ArticleSerializer

class ArticleListAPIView(APIView):
    # Enforce authentication
    permission_classes = [IsAuthenticated]

    def get(self, request):
        articles = Article.objects.filter(status="published")
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

---

## 3. High-Speed CRUD with Generic Views

When standard database operations are needed, DRF's generic views combine model querysets and serializers with zero boilerplate:

```python
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

class ArticleListCreateView(ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ArticleDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "slug"
```

---

## 4. The Apex Abstraction: `ModelViewSet`

A `ModelViewSet` combines all five standard REST actions into a single class:
- `list()`: `GET /articles/`
- `create()`: `POST /articles/`
- `retrieve()`: `GET /articles/{id}/`
- `update()`: `PUT /articles/{id}/`
- `partial_update()`: `PATCH /articles/{id}/`
- `destroy()`: `DELETE /articles/{id}/`

```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "slug"

    # Custom non-standard action: POST /articles/{slug}/publish/
    @action(detail=True, methods=["post"], url_path="publish")
    def publish_article(self, request, slug=None):
        article = self.get_object()
        article.status = "published"
        article.save()
        return Response({"status": "Article marked as published"})
```

---

## Practice Quiz

### Q1: What five REST operations does a ModelViewSet provide automatically?
- A) read, write, scan, copy, delete
- B) list (GET), create (POST), retrieve (GET detail), update/partial_update (PUT/PATCH), and destroy (DELETE)
- C) select, insert, update, delete, drop
- D) login, logout, register, refresh, verify
**Answer:** B
**Explanation:** ModelViewSet provides complete RESTful CRUD actions (list, create, retrieve, update, partial_update, destroy) out of the box.

### Q2: What is the primary difference between Django's native HttpResponse and DRF's Response object?
- A) Response can only send text
- B) DRF's Response takes unrendered Python primitives or dictionaries and uses Content Negotiation to render them into JSON, browsable API HTML, or XML based on client headers
- C) HttpResponse is asynchronous
- D) Response is deprecated
**Answer:** B
**Explanation:** DRF's Response leverages content negotiation to dynamically render data into JSON or the interactive Browsable API interface based on client request headers.

### Q3: How do you add a custom endpoint like /articles/{id}/publish/ to a ViewSet?
- A) By writing a new url pattern manually in urls.py
- B) By decorating a viewset method with @action(detail=True, methods=['post'])
- C) By overriding dispatch()
- D) ViewSets do not allow custom endpoints
**Answer:** B
**Explanation:** The @action decorator registers custom endpoints on ViewSets. detail=True routes to /resource/{id}/action/, while detail=False routes to /resource/action/.

### Q4: In generic views like ListCreateAPIView, how do you inject the current user as author during creation?
- A) By overriding the perform_create(self, serializer) hook and calling serializer.save(author=self.request.user)
- B) By modifying the database directly
- C) By creating a new serializer class
- D) By disabling permissions
**Answer:** A
**Explanation:** perform_create(serializer) is the dedicated lifecycle hook for saving instances in generic views, allowing injection of request metadata.

### Q5: What is the benefit of using APIView over a standard Django Function-Based View?
- A) It provides automatic request parsing (request.data), authentication and permission enforcement, and unified DRF exception handling
- B) It runs on Node.js
- C) It compiles templates
- D) It replaces SQLite with PostgreSQL
**Answer:** A
**Explanation:** APIView wraps requests in DRF's Request class (providing request.data), executes authentication and permission policies, and handles API exceptions cleanly.
