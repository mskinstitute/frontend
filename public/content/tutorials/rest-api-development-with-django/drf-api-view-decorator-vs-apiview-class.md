# Function-Based Views & Class-Based Views

In Django REST Framework, you can build API endpoints using either **Function-Based Views with the `@api_view` decorator** or **Class-Based Views inheriting from `APIView`**. Choosing between them depends on whether your endpoint represents simple procedural logic or an object-oriented controller with reusable behaviors.

---

## 1. Function-Based Views with `@api_view`

The `@api_view` decorator wraps standard Python functions, giving them DRF superpowers:
- Parses incoming request bodies into `request.data`.
- Enforces permitted HTTP methods.
- Enables content negotiation (JSON vs Browsable API).

```python
# api/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def product_collection(request):
    if request.method == "GET":
        products = Product.objects.filter(is_active=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

---

## 2. Class-Based Views with `APIView`

`APIView` organizes HTTP methods into dedicated class methods (`get()`, `post()`, `put()`, `delete()`), eliminating messy `if request.method == "..."` branches:

```python
# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Product
from .serializers import ProductSerializer

class ProductDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Product, pk=pk)

    def get(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def patch(self, request, pk):
        product = self.get_object(pk)
        # partial=True enables partial PATCH updates!
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

---

## 3. Comparison Matrix

| Feature | `@api_view` (Functional) | `APIView` (Class-Based) |
| :--- | :--- | :--- |
| **Code Organization** | `if/elif` on `request.method` | Distinct `def get()`, `def post()` methods |
| **Inheritance & Mixins**| Not supported | Supported (OOP inheritance) |
| **URL Registration** | `path("url/", views.my_view)` | `path("url/", views.MyView.as_view())` |
| **Best Used For** | One-off calculations, simple webhooks | Resource endpoints, CRUD logic, OOP reuse |

---

## 4. Understanding `request.data`

Unlike standard Django's `request.POST` (which only parses form-encoded data), DRF's **`request.data`**:
- Handles incoming JSON payloads (`application/json`).
- Handles standard form submissions (`multipart/form-data`, `application/x-www-form-urlencoded`).
- Handles file uploads transparently without inspecting `request.FILES` separately!

---

## Practice Quiz

### Q1: What does the @api_view(["GET", "POST"]) decorator do to a Python function?
- A) It runs the function in a Web Worker
- B) It transforms the function into a DRF view, providing request.data parsing, method validation, and content negotiation
- C) It connects the function to Redis
- D) It deletes invalid requests
**Answer:** B
**Explanation:** @api_view wraps standard functions with DRF request/response machinery, ensuring requests have access to request.data and content-negotiated responses.

### Q2: How does APIView separate HTTP method logic compared to @api_view?
- A) APIView uses distinct class methods (get, post, put, delete) rather than procedural if/elif checks on request.method
- B) APIView only allows one method per class
- C) APIView compiles methods to C++
- D) There is no difference
**Answer:** A
**Explanation:** APIView uses object-oriented method dispatching: incoming GET requests invoke def get(self, request), incoming POST requests invoke def post(self, request), keeping code organized.

### Q3: What advantage does DRF's request.data have over standard Django's request.POST?
- A) request.data is encrypted
- B) request.data transparently parses JSON, form data, and file uploads uniformly regardless of the incoming Content-Type header
- C) request.POST is deprecated
- D) request.data does not consume memory
**Answer:** B
**Explanation:** request.data parses arbitrary content types (JSON, YAML, multipart form data) seamlessly, whereas request.POST only parses form-encoded data.

### Q4: In an APIView patch method, what argument enables partial updates in the serializer?
- A) allow_missing=True
- B) partial=True (e.g. Serializer(instance, data=request.data, partial=True))
- C) patch=True
- D) incomplete=True
**Answer:** B
**Explanation:** Passing partial=True instructs the serializer that not all required fields need to be present in the payload, enabling partial PATCH updates.

### Q5: How must an APIView class be referenced inside a urls.py path pattern?
- A) path("products/", ProductView)
- B) path("products/", ProductView.as_view())
- C) path("products/", ProductView.run())
- D) path("products/", ProductView())
**Answer:** B
**Explanation:** Like standard Django class-based views, APIView subclasses must invoke .as_view() to return a callable view handler.
