# Django Forms & Validation

Web forms are the primary vector for user input and data mutation in web applications. Writing manual HTML forms and raw validation logic in views leads to security vulnerabilities (such as SQL injection, XSS, and unvalidated payloads). Django's Form framework provides declarative form definitions, automatic HTML widget rendering, server-side data cleaning and validation, and tight integration with models via `ModelForm`.

---

## 1. Declarative Forms vs ModelForms

- **`forms.Form`:** Used for arbitrary input processing not tied directly to a single database table (e.g. contact forms, password reset requests, search filters).
- **`forms.ModelForm`:** Automatically maps fields from a Django model, inferring validation rules, field types, and default widgets while providing an automatic `.save()` method.

---

## 2. Implementing an Enterprise `ModelForm`

```python
# articles/forms.py
from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "content", "category", "tags", "status", "is_featured"]
        widgets = {
            "title": forms.TextInput(attrs={
                "class": "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm",
                "placeholder": "Enter article headline...",
            }),
            "content": forms.Textarea(attrs={
                "class": "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm h-40",
                "placeholder": "Write your markdown or text here...",
            }),
            "status": forms.Select(attrs={
                "class": "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm",
            }),
        }

    # 1. Field-specific custom validation: clean_<fieldname>
    def clean_title(self):
        title = self.cleaned_data.get("title", "").strip()
        if len(title) < 5:
            raise forms.ValidationError("Headline must be at least 5 characters long.")
        if "clickbait" in title.lower():
            raise forms.ValidationError("Clickbait headlines are not permitted by editorial policy.")
        return title

    # 2. Cross-field validation: clean()
    def clean(self):
        cleaned_data = super().clean()
        status = cleaned_data.get("status")
        is_featured = cleaned_data.get("is_featured")

        # Business rule: Draft articles cannot be featured on homepage
        if status == "draft" and is_featured:
            raise forms.ValidationError(
                "You cannot set a draft article as featured. Please publish the article first."
            )

        return cleaned_data
```

---

## 3. Handling Forms in Views

The canonical pattern for processing form submissions:

```python
# articles/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .forms import ArticleForm
from .models import Article

@login_required
def create_article_view(request):
    if request.method == "POST":
        # 1. Bind incoming POST data and files to form
        form = ArticleForm(request.POST, request.FILES)
        
        # 2. Validate input
        if form.is_valid():
            # commit=False creates model instance without saving to database yet
            article = form.save(commit=False)
            article.author = request.user # Inject authenticated author
            article.save()
            form.save_m2m() # Save Many-to-Many tags relationships!
            
            return redirect("articles:detail", slug=article.slug)
    else:
        # GET request: instantiate empty form
        form = ArticleForm()

    return render(request, "articles/article_form.html", {"form": form})
```

---

## 4. The Critical `commit=False` and `save_m2m()` Rule

When using `form.save(commit=False)`, Django instantiates the model object without writing to the database, allowing you to attach additional attributes (like `author`). 

However, **Many-to-Many relationships cannot be saved until the parent object has a database ID**. Therefore, after calling `article.save()`, you **must** call `form.save_m2m()` to persist tags or related categories!

---

## Practice Quiz

### Q1: What method executes form validation and populates the cleaned_data dictionary?
- A) form.validate()
- B) form.is_valid()
- C) form.check()
- D) form.save()
**Answer:** B
**Explanation:** form.is_valid() runs all field-level and cross-field validators, populating form.errors on failure or form.cleaned_data on success.

### Q2: What naming convention does Django enforce for field-specific custom validation methods?
- A) validate_<fieldname>()
- B) clean_<fieldname>()
- C) verify_<fieldname>()
- D) check_<fieldname>()
**Answer:** B
**Explanation:** Django's form cleaning pipeline automatically looks for methods named clean_<fieldname>() on the form class to sanitize and validate specific fields.

### Q3: Why is form.save(commit=False) commonly used in views?
- A) To test database write speed
- B) To obtain the model instance without committing it to the database immediately, allowing views to attach extra attributes (like request.user) before final save
- C) To delete the form from memory
- D) To convert the form to JSON
**Answer:** B
**Explanation:** commit=False instantiates the model without writing an SQL INSERT statement, enabling developers to attach non-form fields (like request.user) before saving.

### Q4: Why must form.save_m2m() be called after saving an instance with commit=False?
- A) To clear browser cache
- B) Because Many-to-Many relationships require the parent object to exist in the database with a primary key before junction table rows can be inserted
- C) To encrypt the database
- D) It is an optional styling method
**Answer:** B
**Explanation:** Many-to-Many relationships cannot associate with an unsaved model lacking a primary key. save_m2m() finishes persisting many-to-many associations once the parent is saved.

### Q5: What is the purpose of the widgets dictionary inside a ModelForm's Meta class?
- A) To create floating UI windows
- B) To customize the HTML input elements (type, CSS classes, placeholders, rows) used to render each form field
- C) To install third-party JavaScript plugins
- D) To configure database indexes
**Answer:** B
**Explanation:** The widgets dictionary allows developers to override default HTML form controls and attach custom CSS styling classes, attributes, and placeholders.
