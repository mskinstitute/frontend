# Django Capstone: Authentication & API Integration

In the final part of the **NexusFlow Enterprise Capstone**, you complete the application by implementing secure multi-tenant authentication, role-based view permissions, and a modern REST API interface powered by **Django REST Framework (DRF)**.

---

## 1. Role-Based Access Control (RBAC) Decorators

Enforce role capabilities across tenant views:

```python
# nexus/permissions.py
from functools import wraps
from django.core.exceptions import PermissionDenied

def require_role(allowed_roles):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                from django.conf import settings
                from django.shortcuts import redirect
                return redirect(f"{settings.LOGIN_URL}?next={request.path}")

            if request.user.role not in allowed_roles:
                raise PermissionDenied("You lack sufficient role capabilities for this operation.")

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

# Usage: Only Admins and Editors can publish documents
# @require_role(["admin", "editor"])
# def publish_document(request, doc_id): ...
```

---

## 2. Exposing the DRF REST API

Provide programmatic access for single-page applications and external enterprise integrations:

```python
# nexus/serializers.py
from rest_framework import serializers
from .models import Document, Workspace

class DocumentSerializer(serializers.ModelSerializer):
    author_email = serializers.CharField(source="author.email", read_only=True)
    workspace_name = serializers.CharField(source="workspace.name", read_only=True)

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "is_published",
            "author_email",
            "workspace_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]
```

---

## 3. Tenant-Scoped ViewSet with DRF Permissions

```python
# nexus/api_views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Document
from .serializers import DocumentSerializer

class IsOrgMember(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        # Enforce tenant match on single object operations
        return obj.workspace.organization == request.user.organization

class DocumentViewSet(ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsOrgMember]
    lookup_field = "slug"

    def get_queryset(self):
        # Scope API results strictly to the authenticated user's organization!
        user = self.request.user
        if not user.is_authenticated or not user.organization:
            return Document.objects.none()
        return Document.objects.filter(workspace__organization=user.organization)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ["admin", "editor"]:
            raise PermissionDenied("Viewers cannot create new documents.")
        serializer.save(author=user)
```

---

## 4. Registering Capstone API Routes

```python
# nexus/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import DocumentViewSet
from .views import WorkspaceDocumentListView, DocumentCreateView

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="api-document")

app_name = "nexus"

urlpatterns = [
    # Server-rendered HTML routes
    path("w/<slug:workspace_slug>/", WorkspaceDocumentListView.as_view(), name="document-list"),
    path("w/<slug:workspace_slug>/new/", DocumentCreateView.as_view(), name="document-create"),

    # REST API endpoints
    path("api/v1/", include(router.urls)),
]
```

---

## 5. Master Capstone Verification Checklist

Congratulations on building the complete NexusFlow Enterprise Backend! Verify your architecture against these core engineering standards:

1. **Multi-Tenant Data Isolation:** Queries at both view and API levels strictly isolate records by `request.user.organization`.
2. **Zero Insecure Object References:** All primary keys utilize unguessable UUIDs.
3. **Defense in Depth Security:** CSRF protection enabled, HSTS configured, and `DEBUG = False` validated via `check --deploy`.
4. **Optimized ORM Queries:** Relationships use `select_related` to eliminate N+1 bottlenecks.
5. **REST API Standards:** Consistent JSON endpoints with DRF ViewSets, token/session authentication, and object-level permissions.

You have mastered enterprise **Django Backend Development**!

---

## Practice Quiz

### Q1: How does DocumentViewSet.get_queryset() guarantee that API clients cannot access another company's documents?
- A) It deletes unauthorized records
- B) It filters records by workspace__organization=request.user.organization, ensuring the database only returns documents belonging to the authenticated caller's tenant
- C) It encrypts JSON responses
- D) It requires a password on every GET request
**Answer:** B
**Explanation:** Scoping get_queryset() to request.user.organization guarantees that API clients can only query and manipulate documents within their own corporate organization.

### Q2: What is the purpose of the custom IsOrgMember permission class?
- A) To check that the user has verified their email address
- B) To enforce object-level permissions on retrieve, update, and delete actions, ensuring the target document belongs to the requesting user's organization
- C) To charge user subscriptions
- D) To bypass authentication
**Answer:** B
**Explanation:** has_object_permission inspects specific instances, blocking operations on individual records if the document belongs to a different organization.

### Q3: Why is perform_create() used to restrict document creation based on user role?
- A) It runs on a separate server
- B) It provides a lifecycle checkpoint to validate business rules (e.g. role check) and inject the request.user as the author before persisting
- C) It is required for JSON serialization
- D) It clears the cache
**Answer:** B
**Explanation:** perform_create is called immediately before database insertion, allowing views to check role capabilities and attach request metadata.

### Q4: What does Document.objects.none() return if a user is not associated with an organization?
- A) An empty QuerySet that executes zero SQL queries
- B) A database crash
- C) null
- D) All records in the database
**Answer:** A
**Explanation:** .none() returns an EmptyQuerySet that immediately evaluates to empty without issuing an unnecessary database query.

### Q5: What status code is returned when a user with role="viewer" attempts to create a document and triggers raise PermissionDenied()?
- A) 400 Bad Request
- B) 403 Forbidden
- C) 404 Not Found
- D) 500 Internal Server Error
**Answer:** B
**Explanation:** In Django REST Framework, raising rest_framework.exceptions.PermissionDenied automatically translates into an HTTP 403 Forbidden response.
