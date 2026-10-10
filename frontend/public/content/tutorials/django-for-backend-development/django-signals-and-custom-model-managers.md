# Signals & Model Managers

As enterprise applications grow, cleanly decoupling domain actions and encapsulating repetitive database queries is essential. **Django Signals** implement a publish-subscribe pattern that allows decoupled applications to receive notifications when specific events occur. **Custom Model Managers** extend the ORM, allowing you to define domain-specific query methods that keep view logic clean.

---

## 1. Custom Model Managers and QuerySets

Encapsulate common filtering logic directly on your models:

```python
# articles/models.py
from django.db import models

# 1. Custom QuerySet defining chainable domain queries
class ArticleQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status="published")

    def featured(self):
        return self.filter(is_featured=True)

    def by_author(self, user):
        return self.filter(author=user)

    def popular(self, min_views=1000):
        return self.filter(view_count__gte=min_views)

# 2. Model Manager using the custom QuerySet
class ArticleManager(models.Manager):
    def get_queryset(self):
        return ArticleQuerySet(self.model, using=self._db)

    # Proxy methods to enable chainable calls: Article.objects.published().featured()
    def published(self):
        return self.get_queryset().published()

    def featured(self):
        return self.get_queryset().featured()
```

Attach the manager to the model:

```python
class Article(models.Model):
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default="draft")
    is_featured = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)

    # Attach custom manager
    objects = ArticleManager()

    # Optional: Dedicated manager for published articles
    published_objects = ArticleManager()
```

### Clean, Readable View Code:
```python
# Expressive, DRY, chainable queries!
hero_articles = Article.objects.published().featured().popular()
```

---

## 2. Django Signals: Publish / Subscribe Pattern

Signals allow decoupled senders to notify subscribed receivers when events happen:
- `post_save`: Sent immediately after a model instance is saved.
- `post_delete`: Sent after an instance is deleted.
- `m2m_changed`: Sent when a ManyToMany field is modified.
- `user_logged_in`: Sent when a user authenticates.

---

## 3. Implementing Automated Profile Creation with `post_save`

A classic enterprise use case: automatically creating a `UserProfile` record whenever a new `User` is created:

```python
# accounts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserProfile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Only execute on initial record creation, not updates
        UserProfile.objects.create(user=instance)
        print(f"Provisioned UserProfile for new user: {instance.email}")

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    # Ensure profile is saved if updated
    if hasattr(instance, "profile"):
        instance.profile.save()
```

---

## 4. Connecting Signals in `apps.py`

Signals must be imported inside your application configuration's `ready()` method:

```python
# accounts/apps.py
from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        # Register signals when app registry is fully populated
        import accounts.signals
```

---

## Practice Quiz

### Q1: What is the primary benefit of defining Custom Model Managers in Django?
- A) They eliminate SQL databases
- B) They encapsulate repetitive QuerySet filtering logic into reusable, expressive methods directly on Model.objects (e.g. Article.objects.published())
- C) They convert models into REST APIs automatically
- D) They run asynchronous background workers
**Answer:** B
**Explanation:** Custom Managers and QuerySets encapsulate query logic on the model layer, keeping views clean, DRY, and domain-expressive.

### Q2: What parameter passed to a post_save signal handler indicates whether the record was newly inserted?
- A) is_new
- B) created
- C) is_insert
- D) first_time
**Answer:** B
**Explanation:** The post_save signal passes created (a boolean) which evaluates to True if a new record was inserted, or False if an existing row was updated.

### Q3: Where should signal handlers be connected to guarantee they load reliably on server boot?
- A) In settings.py
- B) Inside the ready() method of the app's AppConfig class in apps.py
- C) In urls.py
- D) In wsgi.py
**Answer:** B
**Explanation:** Django's official documentation recommends importing and connecting signals inside AppConfig.ready() to ensure the model registry is populated.

### Q4: Why is receiver(post_save, sender=settings.AUTH_USER_MODEL) preferred over hardcoding the sender class?
- A) It prevents circular imports and dynamically adapts to custom user models defined across projects
- B) Python forbids class references
- C) It makes signals run on WebSockets
- D) It deletes the user model
**Answer:** A
**Explanation:** Referencing settings.AUTH_USER_MODEL ensures the signal binds to whatever user model is configured without introducing circular import issues.

### Q5: What is a potential hazard of overusing Django Signals for core business logic?
- A) Signals are deprecated in Django 5
- B) Signals introduce implicit, invisible side effects that make execution flow difficult to trace, debug, and test compared to explicit service methods
- C) Signals can only run 5 times
- D) Signals break database indexes
**Answer:** B
**Explanation:** Excessive reliance on signals creates implicit control flow where saving a model triggers unforeseen chains of side effects; explicit service functions are preferred for critical workflows.
