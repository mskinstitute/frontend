# Class-Based Views (CBV)

While Function-Based Views are simple and explicit, standard web applications contain repetitive CRUD operations: listing records, displaying details, creating records via forms, updating instances, and deleting rows. Django's **Class-Based Views (CBVs)** and **Generic Class-Based Views (GCBVs)** use object-oriented patterns, mixins, and inheritance to eliminate hundreds of lines of boilerplate.

---

## 1. The Class-Based View Hierarchy

```
View (Base Class)
  └── TemplateView (Renders static template)
  └── RedirectView (Handles HTTP redirects)
  └── DetailView (Fetches single object by pk/slug)
  └── ListView (Fetches paginated list of objects)
  └── FormView (Validates arbitrary form)
  └── CreateView (Validates ModelForm and saves new instance)
  └── UpdateView (Validates ModelForm and updates existing instance)
  └── DeleteView (Handles confirmation and deletes instance)
```

---

## 2. Implementing Standard CRUD with Generic Views

```python
# articles/views.py
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from .models import Article

# 1. LIST: Paginated Article Directory
class ArticleListView(ListView):
    model = Article
    template_name = "articles/article_list.html"
    context_object_name = "articles"
    paginate_by = 10

    def get_queryset(self):
        # Override query to return only published articles
        return Article.objects.filter(status="published").select_related("author")

# 2. DETAIL: Single Article View
class ArticleDetailView(DetailView):
    model = Article
    template_name = "articles/article_detail.html"
    context_object_name = "article"
    slug_field = "slug"
    slug_url_kwarg = "slug"

# 3. CREATE: Form Generation & Persistence
class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    fields = ["title", "content", "category", "tags", "status"]
    template_name = "articles/article_form.html"

    def form_valid(self, form):
        # Automatically inject authenticated user as author
        form.instance.author = self.request.user
        return super().form_valid(form)

# 4. UPDATE: Guarded by Author Ownership
class ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Article
    fields = ["title", "content", "category", "status"]
    template_name = "articles/article_form.html"

    # Authorization guard: only author can edit!
    def test_func(self):
        article = self.get_object()
        return self.request.user == article.author

# 5. DELETE: Confirmation & Teardown
class ArticleDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Article
    template_name = "articles/article_confirm_delete.html"
    success_url = reverse_lazy("articles:list")

    def test_func(self):
        article = self.get_object()
        return self.request.user == article.author
```

---

## 3. Connecting CBVs in `urls.py` with `as_view()`

URL dispatchers expect a callable function. CBVs provide the `.as_view()` class method to generate the callable:

```python
# articles/urls.py
from django.urls import path
from .views import (
    ArticleListView,
    ArticleDetailView,
    ArticleCreateView,
    ArticleUpdateView,
    ArticleDeleteView,
)

app_name = "articles"

urlpatterns = [
    path("", ArticleListView.as_view(), name="list"),
    path("create/", ArticleCreateView.as_view(), name="create"),
    path("<slug:slug>/", ArticleDetailView.as_view(), name="detail"),
    path("<slug:slug>/edit/", ArticleUpdateView.as_view(), name="edit"),
    path("<slug:slug>/delete/", ArticleDeleteView.as_view(), name="delete"),
]
```

---

## 4. Why `reverse_lazy` is Required in Class Attributes

In class definitions, class attributes (`success_url = reverse_lazy('...')`) are evaluated when the Python module is first imported. Standard `reverse()` fails because URL patterns haven't finished loading yet. `reverse_lazy()` defers evaluation until the URL is actually accessed!

---

## Practice Quiz

### Q1: What method must always be called when registering a Class-Based View in urls.py?
- A) ViewClass.run()
- B) ViewClass.as_view()
- C) ViewClass.execute()
- D) ViewClass.bind()
**Answer:** B
**Explanation:** as_view() is the class method that transforms a Class-Based View into a callable view function that takes an HttpRequest and returns an HttpResponse.

### Q2: What mixin is used in CBVs to require that a user be logged in, equivalent to the @login_required decorator?
- A) AuthRequiredMixin
- B) LoginRequiredMixin
- C) UserCheckMixin
- D) SessionGuardMixin
**Answer:** B
**Explanation:** django.contrib.auth.mixins.LoginRequiredMixin ensures only authenticated users can access the view, redirecting unauthenticated visitors to login.

### Q3: Why is reverse_lazy() used for success_url class attributes instead of standard reverse()?
- A) reverse_lazy runs on a Web Worker
- B) Class attributes are evaluated at module import time before all project URLs are loaded; reverse_lazy defers URL resolution until runtime
- C) reverse is deprecated
- D) reverse_lazy encrypts URLs
**Answer:** B
**Explanation:** Standard reverse() throws an ImproperlyConfigured exception if invoked before the URLconf is fully loaded; reverse_lazy evaluates lazily when needed.

### Q4: How does UserPassesTestMixin enforce custom authorization rules on a CBV?
- A) By checking user passwords
- B) By implementing the test_func(self) method, which must return True to allow access or False to raise PermissionDenied
- C) By running unit tests
- D) By checking credit card validity
**Answer:** B
**Explanation:** UserPassesTestMixin calls test_func(self). Returning True permits access, while False triggers a 403 PermissionDenied response.

### Q5: In a CreateView, how do you inject the current logged-in user as the model author before saving?
- A) In the __init__ method
- B) By overriding form_valid(self, form) and setting form.instance.author = self.request.user before calling super().form_valid(form)
- C) By hardcoding author in the HTML form
- D) In settings.py
**Answer:** B
**Explanation:** form_valid is invoked when the form passes validation; assigning attributes to form.instance attaches backend values prior to database insertion.
