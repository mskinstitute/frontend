# Documenting Request Bodies, Responses, and Query Parameters with @extend_schema

While `drf-spectacular` inspects serializers automatically, custom actions, query parameters, multipart file uploads, and dynamic responses require explicit annotations. DRF provides the powerful `@extend_schema` decorator to customize every detail of OpenAPI generation.

---

## 1. The `@extend_schema` Decorator

The `@extend_schema` decorator can be applied to `@api_view` functions, `APIView` methods (`get`, `post`), or ViewSet action methods (`@action`).

```python
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

class CartCheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(max_length=255)
    payment_method = serializers.ChoiceField(choices=['stripe', 'paypal', 'apple_pay'])
    coupon_code = serializers.CharField(required=False, allow_blank=True)

class OrderSuccessSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()
    status = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    created_at = serializers.DateTimeField()
```

---

## 2. Annotating Custom View Logic

```python
class CheckoutAPIView(APIView):
    @extend_schema(
        summary="Process cart checkout",
        description="Creates an order from the active user's cart, verifies inventory, and initiates payment.",
        request=CartCheckoutSerializer,
        responses={
            201: OrderSuccessSerializer,
            400: OpenApiTypes.OBJECT,
            409: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Successful Checkout Request',
                value={
                    'shipping_address': '742 Evergreen Terrace, Springfield, OR',
                    'payment_method': 'stripe',
                    'coupon_code': 'SPRING20'
                },
                request_only=True
            ),
            OpenApiExample(
                'Successful Order Response',
                value={
                    'order_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    'status': 'PENDING_PAYMENT',
                    'total_amount': '159.99',
                    'created_at': '2026-09-15T12:00:00Z'
                },
                response_only=True
            )
        ],
        tags=['Orders & Billing']
    )
    def post(self, request):
        serializer = CartCheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Business logic...
        return Response({'status': 'PENDING_PAYMENT'}, status=status.HTTP_201_CREATED)
```

---

## 3. Documenting Query Parameters with `OpenApiParameter`

When an endpoint filters on parameters not present in the request body (e.g. GET requests), use `OpenApiParameter`:

```python
from rest_framework.viewsets import ReadOnlyModelViewSet
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

@extend_schema_view(
    list=extend_schema(
        summary="List all courses with filtering",
        parameters=[
            OpenApiParameter(
                name='category',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Filter courses by category slug (e.g., data-analysis, web-dev)',
                required=False
            ),
            OpenApiParameter(
                name='is_featured',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='Pass true to return only featured showcase courses',
                required=False
            )
        ]
    )
)
class CourseViewSet(ReadOnlyModelViewSet):
    # ViewSet implementation...
    pass
```

---

## Practice Quiz

### Q1: Which decorator from `drf_spectacular.utils` is used to customize the OpenAPI schema of a view or method?
- A) `@api_doc`
- B) `@extend_schema`
- C) `@swagger_auto_schema`
- D) `@schema_register`
**Answer:** B
**Explanation:** `@extend_schema` is the primary annotation decorator in `drf-spectacular` for controlling request bodies, responses, tags, parameters, and examples.

### Q2: What decorator is used at the class level to override schemas for multiple ViewSet actions (like `list`, `retrieve`, `create`) simultaneously?
- A) `@extend_schema_view`
- B) `@viewset_schema`
- C) `@multi_schema`
- D) `@override_actions`
**Answer:** A
**Explanation:** `@extend_schema_view` allows you to specify distinct `@extend_schema` configurations for standard ViewSet action methods (`list`, `create`, `retrieve`, etc.) directly on the class.

### Q3: How do you document a URL query parameter like `?search=term` using `drf-spectacular`?
- A) By adding an entry to `OpenApiParameter` with `location=OpenApiParameter.QUERY`
- B) By writing a Python comment `# query: search`
- C) By adding a field to the model's `Meta` class
- D) By defining a database trigger
**Answer:** A
**Explanation:** `OpenApiParameter(name='...', type=..., location=OpenApiParameter.QUERY)` explicitly documents query string parameters in the schema.

### Q4: What does the `examples` argument in `@extend_schema` accomplish?
- A) It runs automated pytest unit tests
- B) It provides realistic, selectable JSON sample payloads in the Swagger UI documentation interface
- C) It mocks database records in memory
- D) It seeds the production database
**Answer:** B
**Explanation:** `OpenApiExample` objects provide real-world payload examples in Swagger UI and Redoc, making it easy for frontend engineers to understand expected formats.

### Q5: What is the purpose of the `tags` argument in `@extend_schema`?
- A) It tags Git commits with semantic versions
- B) It groups endpoints into logical sections (e.g., 'Authentication', 'Products', 'Orders') in the Swagger UI sidebar
- C) It adds CSS class names to the HTML templates
- D) It specifies database foreign key constraints
**Answer:** B
**Explanation:** The `tags=['...']` attribute groups related endpoints into expandable accordion categories in Swagger UI and Redoc.
