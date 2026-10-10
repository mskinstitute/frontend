# DRF Custom Permission Classes and Object-Level Permissions

Authentication identifies **who** a user is; permissions determine **what** that user is authorized to perform. While built-in classes (`IsAuthenticated`, `AllowAny`, `IsAdminUser`) handle basic access control, enterprise applications require fine-grained **Custom Permission Classes** and **Object-Level Permissions** (e.g. only the document author or organization admin can delete a file).

---

## 1. Built-in DRF Permission Classes

- `AllowAny`: Unrestricted public access (e.g. user signup, public landing pages).
- `IsAuthenticated`: Denies access to anonymous users.
- `IsAdminUser`: Grants access strictly to staff users (`user.is_staff == True`).
- `IsAuthenticatedOrReadOnly`: Authenticated users can mutate data; anonymous users are granted read-only access (`GET`, `HEAD`, `OPTIONS`).

---

## 2. Anatomy of a Custom Permission Class

A permission class inherits from `rest_framework.permissions.BasePermission` and implements one or both of these methods:

1. **`has_permission(self, request, view)`:** Evaluates view-level access (e.g. whether the user can access the `/articles/` endpoint at all).
2. **`has_object_permission(self, request, view, obj)`:** Evaluates object-level access on a specific instance (e.g. whether the user can mutate `Article #42`).

---

## 3. Implementing `IsOwnerOrReadOnly` Object Permission

A classic enterprise permission: any user can read a document, but only the original author can edit or delete it:

```python
# api/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    '''
    Object-level permission to only allow authors of an object to edit or delete it.
    Assumes model instance has an `author` attribute.
    '''

    def has_permission(self, request, view):
        # View-level check: Allow all authenticated users
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # 1. Read permissions are allowed for any request (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # 2. Write permissions are strictly restricted to the author or superuser
        return obj.author == request.user or request.user.is_staff
```

---

## 4. Role-Based Organization Permission Class

```python
# api/permissions.py
from rest_framework.permissions import BasePermission

class IsOrganizationAdmin(BasePermission):
    message = "You must be an Organization Administrator to perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, "role", None) == "admin"
        )
```

---

## 5. Applying Permissions to ViewSets

```python
# articles/views.py
from rest_framework.viewsets import ModelViewSet
from .models import Article
from .serializers import ArticleSerializer
from .permissions import IsOwnerOrReadOnly

class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    # Attach custom permission class
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = "slug"

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
```

---

## Practice Quiz

### Q1: What is the difference between has_permission and has_object_permission in DRF?
- A) has_permission is for mobile apps; has_object_permission is for web
- B) has_permission checks general access to the view/collection endpoint; has_object_permission evaluates whether the user can act on a specific retrieved model instance
- C) has_object_permission runs before has_permission
- D) They are identical
**Answer:** B
**Explanation:** has_permission runs first to check general access to the view; has_object_permission is evaluated later when view.get_object() is called on individual instances.

### Q2: What HTTP methods are defined in permissions.SAFE_METHODS?
- A) POST, PUT, DELETE
- B) GET, HEAD, OPTIONS
- C) Only GET
- D) CONNECT, TRACE
**Answer:** B
**Explanation:** permissions.SAFE_METHODS is a tuple containing ('GET', 'HEAD', 'OPTIONS'), representing operations that do not mutate server state.

### Q3: When does DRF execute has_object_permission checks?
- A) During server boot
- B) Inside the get_object() method called by detail views (retrieve, update, partial_update, destroy)
- C) In the database driver
- D) Only on POST requests
**Answer:** B
**Explanation:** Generic views and ViewSets invoke check_object_permissions(request, obj) inside get_object(), evaluating has_object_permission on the retrieved instance.

### Q4: How do you customize the error message returned when a custom permission class denies access?
- A) By setting the message attribute on the permission class (e.g. message = "Custom error reason")
- B) By editing settings.py
- C) In the database
- D) Custom error messages are not supported
**Answer:** A
**Explanation:** Defining a message string on your BasePermission subclass overrides the default "You do not have permission to perform this action" message.

### Q5: If a view defines permission_classes = [IsAuthenticated, IsAdminUser], what must be true for a request to succeed?
- A) Either permission must pass
- B) BOTH permission classes must return True; failing either results in permission denial
- C) Only IsAdminUser is checked
- D) Neither is checked
**Answer:** B
**Explanation:** DRF evaluates permission classes sequentially; if any class returns False, the request is denied immediately.
