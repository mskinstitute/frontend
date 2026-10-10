# Static & Media Files

In Django architecture, **Static Files** and **Media Files** serve two completely different purposes:
- **Static Files:** Assets authored and committed by developers (CSS stylesheets, JavaScript bundles, site logos, SVG icons).
- **Media Files:** User-uploaded content (user profile avatars, PDF invoices, product catalog images, video attachments).

In ephemeral cloud environments (Heroku, Kubernetes, AWS ECS), container file systems are destroyed upon restart. Storing user media files on the container disk causes data loss. Enterprise systems offload static and media storage to cloud object stores like **Amazon S3** using `django-storages`.

---

## 1. Static vs Media Files Overview

| Category | Authored By | Source Control | Storage in Production | Example |
| :--- | :--- | :--- | :--- | :--- |
| **Static Files** | Developers | Committed to Git | WhiteNoise or AWS S3 / CDN | `css/styles.css`, `bundle.js` |
| **Media Files** | End Users | **Never committed to Git** | Cloud Object Store (AWS S3) | `avatars/user_42.jpg`, `doc.pdf` |

---

## 2. Configuring `django-storages` with AWS S3

```bash
pip install django-storages boto3
```

Configure AWS credentials and custom storage backends:

```python
# config/settings.py
INSTALLED_APPS = [
    # ...
    "storages", # Adds S3 backend support
]

# AWS S3 Credentials (Injected from Environment Variables)
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", "us-east-1")
AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"

# S3 Security & Performance Options
AWS_DEFAULT_ACL = None # Enforces AWS bucket ownership controls
AWS_S3_OBJECT_PARAMETERS = {
    "CacheControl": "max-age=86400",
}

# 1. Custom Media Storage Backend (User Uploads)
DEFAULT_FILE_STORAGE = "config.storage_backends.MediaStorage"

# 2. Custom Static Storage Backend (Optional: offload static to S3)
STATICFILES_STORAGE = "config.storage_backends.StaticStorage"
```

---

## 3. Custom Storage Backends (`storage_backends.py`)

Isolate static assets and media files into separate folders inside the same S3 bucket:

```python
# config/storage_backends.py
from storages.backends.s3boto3 import S3Boto3Storage

class StaticStorage(S3Boto3Storage):
    location = "static"
    default_acl = "public-read"

class MediaStorage(S3Boto3Storage):
    location = "media"
    file_overwrite = False # Appends random suffix if filename conflicts!
```

---

## 4. Handling File Uploads in Models

```python
# accounts/models.py
from django.db import models

def user_avatar_path(instance, filename):
    # Dynamic storage path: media/avatars/user_123/profile.jpg
    return f"avatars/user_{instance.id}/{filename}"

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to=user_avatar_path, blank=True, null=True)
    resume = models.FileField(upload_to="resumes/", blank=True, null=True)
```

In templates, access the public S3 URL via `.url`:

```django
{% if profile.avatar %}
  <img src="{{ profile.avatar.url }}" alt="Profile Photo" class="h-12 w-12 rounded-full" />
{% endif %}
```

---

## Practice Quiz

### Q1: What is the critical difference between Static Files and Media Files in Django?
- A) Static files are text; media files are numbers
- B) Static files are developer-authored assets (CSS, JS, logos); Media files are dynamic user-uploaded assets (avatars, attachments)
- C) Static files are stored in PostgreSQL; media files are stored in SQLite
- D) Media files are committed to Git
**Answer:** B
**Explanation:** Static files are part of your codebase (CSS, images, JS), while Media files are dynamically created by user uploads at runtime and must never be stored in Git.

### Q2: Why is storing user uploads on local container disks an anti-pattern in Docker / Heroku deployments?
- A) Hard drives are too fast
- B) Cloud containers have ephemeral file systems; when containers scale, restart, or deploy new code, local disks are wiped, causing permanent data loss of user uploads
- C) Docker forbids saving files
- D) It violates CSS standards
**Answer:** B
**Explanation:** Ephemeral cloud containers destroy local file changes upon restarts or deployments; user uploads must be stored in persistent cloud object stores like AWS S3.

### Q3: What does setting file_overwrite = False do in custom S3 media storage?
- A) It prevents users from uploading files
- B) If a user uploads a file with an identical name as an existing file, Django appends a random string to the filename rather than overwriting the existing file
- C) It makes files read-only
- D) It deletes duplicate files
**Answer:** B
**Explanation:** Disabling file_overwrite ensures that uploading avatar.jpg does not overwrite another user's existing avatar.jpg, generating a unique filename suffix instead.

### Q4: What package is the standard backend for integrating Django with cloud storage providers like AWS S3, Azure Blob, and Google Cloud Storage?
- A) django-storages
- B) django-cloud-save
- C) django-s3-direct
- D) boto-django
**Answer:** A
**Explanation:** django-storages (paired with boto3 for AWS) is the community standard library for abstracting Django file storage to cloud storage providers.

### Q5: How do you output the public URL of an uploaded ImageField named avatar in a Django template?
- A) {{ profile.avatar.path }}
- B) {{ profile.avatar.url }}
- C) {{ profile.avatar.src }}
- D) {% url profile.avatar %}
**Answer:** B
**Explanation:** The .url property of a FileField/ImageField returns the fully qualified URL (e.g. https://bucket.s3.amazonaws.com/media/avatars/...) to access the file.
