# User Model & Permissions

User authentication and authorization are mission-critical for web platforms. While Django ships with a default `User` model, production architectures strongly advise configuring a **Custom User Model** at the inception of a project. This allows you to use email addresses as unique login identifiers, add custom enterprise fields, and manage fine-grained permissions.

---

## 1. Why You MUST Use a Custom User Model

Django's default `auth.User` uses `username` for logins and has fixed fields (`first_name`, `last_name`, `email`). Altering the user model mid-project requires complex, risky database migrations across foreign keys. 

By defining a custom user model inheriting from `AbstractUser` on Day 1, you preserve total freedom to extend user attributes throughout the application lifetime:

```python
# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Enforce unique email address as primary login identifier
    email = models.EmailField(unique=True)
    
    # Custom business attributes
    bio = models.TextField(blank=True)
    company_name = models.CharField(max_length=100, blank=True)
    is_verified = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    # Use email instead of username for authentication
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"] # Fields prompted during createsuperuser

    def __str__(self):
        return self.email
```

---

## 2. Registering `AUTH_USER_MODEL` in Settings

Inform Django to use your custom model globally:

```python
# config/settings.py
AUTH_USER_MODEL = "accounts.CustomUser"
```

When referencing the user model across your codebase:
- In `models.py` foreign keys: use `settings.AUTH_USER_MODEL`
- In view code: use `get_user_model()`

```python
# In models.py:
author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

# In views.py:
from django.contrib.auth import get_user_model
User = get_user_model()
```

---

## 3. Django Permissions Framework

Django models automatically generate four default permissions upon creation:
1. `add_<modelname>` (e.g. `articles.add_article`)
2. `change_<modelname>` (e.g. `articles.change_article`)
3. `delete_<modelname>` (e.g. `articles.delete_article`)
4. `view_<modelname>` (e.g. `articles.view_article`)

### Checking Permissions Programmatically
```python
# Check permission on a user instance
if user.has_perm("articles.delete_article"):
    print("User is authorized to delete this article")
```

### Guarding Views with `@permission_required`
```python
from django.contrib.auth.decorators import permission_required

@permission_required("articles.delete_article", raise_exception=True)
def delete_article_view(request, article_id):
    # Only users with explicit delete permissions can execute this view!
    ...
```

---

## Practice Quiz

### Q1: Why does Django's official documentation recommend creating a Custom User Model at the very beginning of a new project?
- A) The default User model does not work with passwords
- B) Migrating to a custom user model mid-project is notoriously difficult and requires re-architecting existing database foreign key schemas
- C) Custom user models compile faster
- D) Django 5 deleted the default User model
**Answer:** B
**Explanation:** Replacing the user model after migrations have run creates complex foreign key dependency cascades. Setting up a CustomUser initially allows painless customization later.

### Q2: What setting in settings.py tells Django to adopt your custom user model?
- A) USER_CLASS = "CustomUser"
- B) AUTH_USER_MODEL = "accounts.CustomUser"
- C) DEFAULT_USER = "CustomUser"
- D) LOGIN_USER_MODEL = "accounts.CustomUser"
**Answer:** B
**Explanation:** AUTH_USER_MODEL = 'app_label.ModelName' informs Django's authentication framework to substitute the default User model with your custom implementation.

### Q3: How should you reference the User model when defining ForeignKey relationships in other models?
- A) models.ForeignKey(User, ...)
- B) models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
- C) models.ForeignKey("auth.User", ...)
- D) models.ForeignKey("accounts.CustomUser", ...)
**Answer:** B
**Explanation:** Referencing settings.AUTH_USER_MODEL ensures that foreign key relationships dynamically point to whichever user model is active without hardcoding app dependencies.

### Q4: What four permissions does Django automatically generate for every registered database model?
- A) read, write, execute, delete
- B) add, change, delete, and view
- C) create, read, update, delete
- D) select, insert, update, drop
**Answer:** B
**Explanation:** For every model, Django creates four standard permissions: add_<model>, change_<model>, delete_<model>, and view_<model>.

### Q5: How do you configure a custom user model to log in using an email address instead of a username?
- A) LOGIN_WITH_EMAIL = True
- B) Set USERNAME_FIELD = "email" on the custom user model class
- C) Delete the username column from the database
- D) Configure email in urls.py
**Answer:** B
**Explanation:** The USERNAME_FIELD attribute defines the unique field name used by authentication backends to identify user credentials during login.
