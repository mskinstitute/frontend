# Django Capstone: Full Web Application

Welcome to the **Django for Backend Development Capstone Project**. In this three-part capstone, you will architect, build, and secure an enterprise multi-tenant software-as-a-service (SaaS) web platform: **"NexusFlow Enterprise"**. Part 1 focuses on domain data modeling, multi-tenancy architecture, custom user management, and relational database schema design.

---

## 1. System Requirements & Domain Model

NexusFlow is an enterprise collaboration platform where organizations (Tenants) manage workspaces, publish documentation articles, and assign staff roles.

```
┌─────────────────────────────────────────────────────────────┐
│                      NEXUSFLOW DOMAIN                       │
├─────────────────────────────────────────────────────────────┤
│ Tenant (Organization) ◄─── User (CustomUser with Role)      │
│       │                                                     │
│       ├──► Workspace (Department / Team Project)            │
│       │         │                                           │
│       │         └──► Document / Article (Rich Text Content) │
│       │                   │                                 │
│       │                   └──► AuditLog (Telemetry Trail)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Tenant Architecture & Database Models

```python
# nexus/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify

# 1. Tenant (Organization)
class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# 2. Custom User Model with Multi-Tenancy & Roles
class CustomUser(AbstractUser):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="members",
        null=True,
        blank=True
    )
    ROLE_CHOICES = [
        ("admin", "Organization Administrator"),
        ("editor", "Technical Editor"),
        ("viewer", "Auditor / Viewer"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="viewer")
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"

# 3. Workspace
class Workspace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="workspaces")
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("organization", "slug")

    def __str__(self):
        return f"{self.organization.name} / {self.name}"

# 4. Document / Article
class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="documents")
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="authored_documents")
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    content = models.TextField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("workspace", "slug")

    def __str__(self):
        return self.title
```

---

## 3. Custom QuerySets for Multi-Tenant Isolation

Multi-tenant applications must **never** leak data between different organizations. Implement a custom manager that scopes all queries strictly to the active tenant:

```python
class TenantScopedQuerySet(models.QuerySet):
    def for_organization(self, organization):
        return self.filter(workspace__organization=organization)

class DocumentManager(models.Manager):
    def get_queryset(self):
        return TenantScopedQuerySet(self.model, using=self._db)

    def for_organization(self, organization):
        return self.get_queryset().for_organization(organization)
```

---

## 4. Key Architectural Takeaways

1. **UUID Primary Keys:** Using UUIDs for `Organization`, `Workspace`, and `Document` prevents ID enumeration attacks (where competitors guess `/workspace/1`, `/workspace/2`).
2. **Compound Unique Constraints:** `unique_together = ("organization", "slug")` allows two different companies to both have a workspace named `"engineering"`, each with their own isolated URL!

---

## Practice Quiz

### Q1: What security hazard do UUID primary keys mitigate compared to auto-incrementing integers (1, 2, 3)?
- A) UUIDs compress database backups
- B) Integer IDs are sequential and guessable, allowing malicious users to enumerate and scrape records (IDOR attacks); UUIDs are cryptographically random and un-guessable
- C) Integers cannot store text
- D) UUIDs run faster on CPU
**Answer:** B
**Explanation:** Sequential IDs expose applications to Insecure Direct Object References (IDOR), where attackers scrape data by incrementing IDs; UUIDs neutralize enumeration attacks.

### Q2: Why is unique_together = ("workspace", "slug") essential on the Document model?
- A) It prevents two documents in the same workspace from having identical URL slugs, while permitting identical slugs in different workspaces
- B) It deletes old documents
- C) It connects to Google Cloud
- D) It formats slug text
**Answer:** A
**Explanation:** Compound uniqueness guarantees URL slugs are unique within a specific workspace container without preventing other workspaces from reusing common slugs (like "getting-started").

### Q3: What is the primary operational rule of Multi-Tenant database design?
- A) All users must share the same password
- B) Queries must be strictly scoped to the active tenant's organization ID, ensuring one company can never view, mutate, or access another company's records
- C) The database must restart every 10 minutes
- D) Only one tenant can exist at a time
**Answer:** B
**Explanation:** Tenant isolation is paramount in SaaS; scoping queries to the authenticated tenant prevents cross-tenant data leaks.

### Q4: Why is on_delete=models.SET_NULL used for Document author instead of models.CASCADE?
- A) To delete the document
- B) If an employee leaves the company and their user account is deleted, the enterprise document remains intact with author set to null, preserving intellectual property
- C) Because PostgreSQL requires SET_NULL
- D) To speed up queries
**Answer:** B
**Explanation:** SET_NULL ensures that deleting a user account does not delete all historical enterprise documentation authored by that employee.

### Q5: How does USERNAME_FIELD = "email" alter authentication?
- A) It sends an email on every click
- B) It instructs Django's authentication system to authenticate users using their unique email address rather than an arbitrary username
- C) It turns passwords off
- D) It requires two-factor authentication
**Answer:** B
**Explanation:** USERNAME_FIELD designates the model field used as the unique login credential during authentication.
