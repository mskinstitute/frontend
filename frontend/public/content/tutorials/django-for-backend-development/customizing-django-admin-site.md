# Django Admin Site

One of Django's most celebrated "batteries-included" features is the **Django Admin Site**. It reads metadata from your models to automatically generate an enterprise-grade administrative dashboard for managing content, inspecting database records, and managing staff permissions. Customizing the admin site transforms it into a bespoke operations back-office.

---

## 1. Enabling the Admin and Creating a Superuser

Django Admin is enabled by default in `INSTALLED_APPS` via `django.contrib.admin`. To log in, generate an administrative superuser account:

```bash
python manage.py createsuperuser
# Prompt: Username, Email, Password
```

Start the dev server and visit `http://127.0.0.1:8000/admin/`.

---

## 2. Registering Models with `ModelAdmin`

To expose your models in the admin, register them in `admin.py`:

```python
# articles/admin.py
from django.contrib import admin
from .models import Article, Category, Tag

# Simple registration:
admin.site.register(Category)
admin.site.register(Tag)

# Advanced customized registration:
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    # 1. Columns displayed in the record list view
    list_display = ("title", "author", "status", "category", "view_count", "created_at")
    
    # 2. Clickable columns linking to the detail change form
    list_display_links = ("title",)
    
    # 3. Sidebar filtering widgets
    list_filter = ("status", "category", "created_at", "is_featured")
    
    # 4. Search bar querying specified fields
    search_fields = ("title", "content", "author__username")
    
    # 5. Automatically populate slug field based on title input in real-time
    prepopulated_fields = {"slug": ("title",)}
    
    # 6. Pagination count per page
    list_per_page = 25
    
    # 7. Form field groupings and layouts
    fieldsets = (
        ("General Information", {
            "fields": ("title", "slug", "author", "category")
        }),
        ("Content Body", {
            "fields": ("content",)
        }),
        ("Publication Settings", {
            "classes": ("collapse",), # Collapsible section
            "fields": ("status", "is_featured", "tags")
        }),
    )
```

---

## 3. Custom Admin Actions

You can add bulk action triggers to the admin dropdown menu:

```python
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    actions = ["make_published", "make_archived"]

    @admin.action(description="Mark selected articles as Published")
    def make_published(self, request, queryset):
        updated_count = queryset.update(status="published")
        self.message_user(
            request,
            f"Successfully marked {updated_count} articles as published."
        )

    @admin.action(description="Mark selected articles as Archived")
    def make_archived(self, request, queryset):
        queryset.update(status="archived")
```

---

## 4. Inlines: Editing Related Models on the Same Screen

When managing parent and child models (e.g. an Article and its Comments, or an Order and Line Items), `TabularInline` lets staff edit children directly inside the parent page:

```python
class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1 # Number of empty blank rows to display

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    inlines = [CommentInline]
```

---

## Practice Quiz

### Q1: What command creates an administrative user capable of logging into /admin/?
- A) python manage.py admin-init
- B) python manage.py createsuperuser
- C) python manage.py new-admin
- D) python manage.py useradd
**Answer:** B
**Explanation:** createsuperuser prompts for username, email, and password to instantiate an administrative user record with is_superuser=True and is_staff=True.

### Q2: What does the prepopulated_fields option do in ModelAdmin?
- A) It seeds the database with 100 fake records
- B) It uses client-side JavaScript to automatically generate values (such as URL slugs) in real time as the user types in another field
- C) It loads data from an external API
- D) It autofills user passwords
**Answer:** B
**Explanation:** prepopulated_fields generates values (like slugs) dynamically in the browser UI based on inputs from specified source fields.

### Q3: How do you add searchable columns to the Django Admin change list?
- A) search_columns = [...]
- B) search_fields = ("title", "content", "author__username")
- C) admin.add_search()
- D) search_enabled = True
**Answer:** B
**Explanation:** Defining search_fields renders a search input on the change list view that queries the specified model columns using SQL LIKE/ILIKE operations.

### Q4: What is the purpose of admin.TabularInline?
- A) To display database records as HTML canvas graphics
- B) To allow editing related child records directly within the parent model's change form page in a clean horizontal table format
- C) To format code into tables
- D) To export data to Microsoft Excel
**Answer:** B
**Explanation:** TabularInline embeds related child foreign key models directly inside the parent edit page, allowing staff to add, update, and delete related rows in one place.

### Q5: Why is list_filter = ("status", "category") useful on high-volume models?
- A) It deletes archived items
- B) It generates an interactive sidebar on the change list, allowing staff to filter records by status or category with a single click
- C) It sorts the database ascending
- D) It encrypts the table
**Answer:** B
**Explanation:** list_filter generates intuitive sidebar filtering widgets on the admin change list, enabling quick filtering by field values or date ranges.
