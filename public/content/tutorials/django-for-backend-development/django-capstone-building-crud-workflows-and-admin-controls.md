# Django Capstone: CRUD Operations

In Part 2 of the **NexusFlow Enterprise Capstone**, you build the core user workflows: creating and managing workspaces, drafting and publishing markdown documents, implementing form validations, and customizing the Django Admin back-office with inline editors and audit filters.

---

## 1. Enterprise Document Form with Custom Validation

```python
# nexus/forms.py
from django import forms
from .models import Document

class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ["title", "content", "is_published"]
        widgets = {
            "title": forms.TextInput(attrs={
                "class": "w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500",
                "placeholder": "Enter document title...",
            }),
            "content": forms.Textarea(attrs={
                "class": "w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm h-64",
                "placeholder": "Write your markdown documentation here...",
            }),
        }

    def clean_title(self):
        title = self.cleaned_data.get("title", "").strip()
        if len(title) < 4:
            raise forms.ValidationError("Document title must be at least 4 characters long.")
        return title
```

---

## 2. Multi-Tenant CRUD Class-Based Views

Ensure that users can only view, edit, and create documents inside their own organization:

```python
# nexus/views.py
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from django.utils.text import slugify
from .models import Document, Workspace
from .forms import DocumentForm

# 1. List Documents in Workspace
class WorkspaceDocumentListView(LoginRequiredMixin, ListView):
    model = Document
    template_name = "nexus/document_list.html"
    context_object_name = "documents"

    def get_queryset(self):
        workspace_slug = self.kwargs["workspace_slug"]
        # Enforce tenant isolation: must belong to user's organization!
        return Document.objects.filter(
            workspace__slug=workspace_slug,
            workspace__organization=self.request.user.organization
        ).select_related("author")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["workspace"] = get_object_or_404(
            Workspace,
            slug=self.kwargs["workspace_slug"],
            organization=self.request.user.organization
        )
        return context

# 2. Create Document View
class DocumentCreateView(LoginRequiredMixin, CreateView):
    model = Document
    form_class = DocumentForm
    template_name = "nexus/document_form.html"

    def form_valid(self, form):
        workspace = get_object_or_404(
            Workspace,
            slug=self.kwargs["workspace_slug"],
            organization=self.request.user.organization
        )
        form.instance.workspace = workspace
        form.instance.author = self.request.user
        form.instance.slug = slugify(form.instance.title)
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy(
            "nexus:document-list",
            kwargs={"workspace_slug": self.kwargs["workspace_slug"]}
        )
```

---

## 3. Customizing the Admin Back-Office

Register models with customized filters, search capabilities, and inlines:

```python
# nexus/admin.py
from django.contrib import admin
from .models import Organization, CustomUser, Workspace, Document

class WorkspaceInline(admin.TabularInline):
    model = Workspace
    extra = 1

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    search_fields = ("name", "slug")
    inlines = [WorkspaceInline]

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "workspace", "author", "is_published", "created_at")
    list_filter = ("is_published", "workspace__organization", "created_at")
    search_fields = ("title", "content", "author__email")
    prepopulated_fields = {"slug": ("title",)}
```

---

## Practice Quiz

### Q1: How does the WorkspaceDocumentListView prevent users from accessing documents of other organizations?
- A) Through CSS styles
- B) By filtering the QuerySet on workspace__organization=self.request.user.organization, ensuring the database only returns records belonging to the authenticated user's organization
- C) By disconnecting the database
- D) It relies on client-side JavaScript checks
**Answer:** B
**Explanation:** Strict tenant isolation is enforced at the database query layer: filtering on request.user.organization prevents users from accessing unauthorized tenant records.

### Q2: In DocumentCreateView, how is the parent Workspace bound to the new document instance?
- A) The user selects the workspace from an insecure dropdown
- B) Inside form_valid(), the view fetches the workspace using the URL kwarg and verified organization, assigning form.instance.workspace = workspace before saving
- C) By setting a browser cookie
- D) It cannot be bound in a CreateView
**Answer:** B
**Explanation:** Overriding form_valid allows the backend to inject verified contextual foreign keys (such as the verified workspace and author) securely before database insertion.

### Q3: What does slugify("Architecture Review 2026!") return?
- A) "architecture review 2026"
- B) "architecture-review-2026"
- C) "ARCHITECTURE_REVIEW"
- D) An MD5 hash
**Answer:** B
**Explanation:** Django's slugify utility converts strings to lowercase, converts spaces into hyphens, and removes punctuation and special characters to generate clean URL slugs.

### Q4: What is the purpose of prepopulated_fields = {"slug": ("title",)} in DocumentAdmin?
- A) It runs a migration
- B) It automatically populates the slug field in the admin browser interface in real time as staff type into the title field
- C) It makes the title field optional
- D) It deletes existing slugs
**Answer:** B
**Explanation:** prepopulated_fields dynamically derives URL slugs from source text fields in the admin change form using client-side JavaScript.

### Q5: Why is get_context_data() overridden in WorkspaceDocumentListView?
- A) To format dates
- B) To pass the parent Workspace object into the template context so the page header can display the workspace name and breadcrumbs
- C) To delete documents
- D) To logout the user
**Answer:** B
**Explanation:** get_context_data() populates additional template variables, making parent workspace metadata available for breadcrumbs, headers, and navigation links.
