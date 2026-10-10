# Designing Clean RESTful Model Endpoints

Designing an intuitive, predictable REST API is an art. Clean API endpoints conform to standard industry conventions, use intuitive hierarchical relationships, handle query parameters cleanly, and provide consistent metadata wrappers.

---

## 1. RESTful URL Design Standards

```
Standard REST Hierarchy:
/api/v1/{collection}/                          ──► Collection Endpoint (GET list, POST create)
/api/v1/{collection}/{id}/                     ──► Detail Endpoint (GET, PUT, PATCH, DELETE)
/api/v1/{collection}/{id}/{sub-collection}/    ──► Nested Resource Endpoint
```

### Golden Rules:
1. **Always use lowercase plural nouns:** `/api/v1/customers/` (not `/Customer` or `/getCustomer`).
2. **Represent hierarchies naturally:** `/api/v1/projects/{id}/tasks/` indicates tasks belonging to a specific project.
3. **Limit nesting depth:** Avoid nesting deeper than 2 levels (`/orgs/1/projects/2/tasks/3/comments/4` is an anti-pattern!). Flatten deep children: `/api/v1/tasks/{task_id}/comments/`.
4. **Use query parameters for filtering and pagination:** `/api/v1/articles/?status=published&category=tech&page=2`.

---

## 2. Implementing Nested Child Endpoints in DRF

```python
# tasks/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer

class ProjectTasksViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Scope tasks strictly to project ID extracted from URL kwargs
        project_id = self.kwargs["project_pk"]
        return Task.objects.filter(project_id=project_id, project__owner=self.request.user)

    def perform_create(self, serializer):
        project_id = self.kwargs["project_pk"]
        serializer.save(project_id=project_id)
```

---

## 3. Response Structure & Metadata Envelopes

While standard DRF endpoints return bare JSON arrays or objects, enterprise platforms frequently wrap responses in standard metadata envelopes:

```json
{
  "data": {
    "id": "proj_9912",
    "name": "Cloud Security Architecture",
    "status": "active"
  },
  "meta": {
    "timestamp": "2026-09-15T04:45:00Z",
    "version": "v1.2"
  }
}
```

---

## 4. Sub-resource Actions via `@action`

When a model needs a non-CRUD business operation (e.g. archiving a project or sending an invoice):

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    # POST /api/v1/projects/{pk}/archive/
    @action(detail=True, methods=["post"], url_path="archive")
    def archive_project(self, request, pk=None):
        project = self.get_object()
        project.status = "archived"
        project.save()
        return Response({"status": "Project archived successfully"})
```

---

## Practice Quiz

### Q1: Which of the following is considered a best-practice RESTful URI design?
- A) /api/v1/get_all_active_users/
- B) /api/v1/users/?active=true
- C) /api/v1/User/Active/
- D) /api/v1/user_action?action=fetch_active
**Answer:** B
**Explanation:** Standard REST URIs use lowercase plural nouns for resources and query parameters for filtering states.

### Q2: Why is deep URL nesting (e.g. /companies/1/departments/2/teams/3/members/4/tasks/5/) discouraged?
- A) URLs cannot exceed 50 characters in HTTP
- B) Deep nesting creates overly complex, brittle URLs; flattening endpoints (e.g. /tasks/{id}/) improves developer experience while keeping URIs simple
- C) Python routers cannot parse more than 3 slashes
- D) It violates database normalization
**Answer:** B
**Explanation:** Deeply nested URIs become unwieldy; REST best practices recommend nesting no more than one level deep (e.g. /teams/3/members/) and accessing leaf resources directly by ID.

### Q3: How do you define a custom RPC-style action on a single model instance in a DRF ViewSet?
- A) By adding a path in urls.py manually
- B) Using the @action(detail=True, methods=['post']) decorator on a ViewSet method
- C) By creating a new ViewSet
- D) Custom actions are forbidden in DRF
**Answer:** B
**Explanation:** @action(detail=True) creates an instance-level sub-route (e.g. /items/{id}/action_name/) routed directly to the decorated method.

### Q4: What does the detail=False argument on an @action decorator indicate?
- A) The action does not return details
- B) The action operates on the entire collection (e.g. /items/bulk_delete/) rather than a single individual instance
- C) The action is private
- D) The action is read-only
**Answer:** B
**Explanation:** detail=False routes the action to the collection root (/resource/action/), suitable for bulk actions or collection operations.

### Q5: Why should API versioning (e.g. /api/v1/) be included in endpoint URI designs from day one?
- A) To make URLs look modern
- B) To allow releasing breaking changes in future versions (v2) without disrupting existing clients relying on v1
- C) It is required by Django
- D) To compress JSON payloads
**Answer:** B
**Explanation:** Versioning ensures backward compatibility: when breaking API changes are introduced, existing integrations continue operating on v1 while new features deploy to v2.
