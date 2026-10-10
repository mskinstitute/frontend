# Groups and Roles

Assigning individual permissions to hundreds of separate users creates administrative chaos. In enterprise architectures, permissions are organized into **Groups** representing functional business roles (e.g. *Editorial Staff*, *Billing Managers*, *Support Agents*, *Compliance Officers*). Users inherit all permissions assigned to their groups, enabling centralized, role-based access management.

---

## 1. Groups and Role Architecture

```
Individual Users:
[ Alice (Lead Editor) ] ──┐
                          ├──► Assigned to Group: "Editors"
[ Bob (Staff Writer) ]  ──┘         │
                                    ▼
                         Granted Permissions:
                         - articles.add_article
                         - articles.change_article
                         - articles.view_article
```

---

## 2. Programmatically Managing Groups and Permissions

You can configure groups and permissions via Django data migrations or management scripts:

```python
# accounts/management/commands/setup_roles.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from articles.models import Article

class Command(BaseCommand):
    help = "Seeds standard enterprise groups and permissions"

    def handle(self, *args, **options):
        # 1. Create or retrieve Groups
        editors_group, _ = Group.objects.get_or_create(name="Editors")
        viewers_group, _ = Group.objects.get_or_create(name="Viewers")

        # 2. Lookup ContentType for Article model
        article_content_type = ContentType.objects.get_for_model(Article)

        # 3. Retrieve specific permissions
        can_add = Permission.objects.get(content_type=article_content_type, codename="add_article")
        can_change = Permission.objects.get(content_type=article_content_type, codename="change_article")
        can_view = Permission.objects.get(content_type=article_content_type, codename="view_article")

        # 4. Assign permissions to Groups
        editors_group.permissions.set([can_add, can_change, can_view])
        viewers_group.permissions.set([can_view])

        self.stdout.write(self.style.SUCCESS("Roles successfully configured!"))
```

---

## 3. Assigning Users to Groups

```python
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.get(email="alice@enterprise.com")

# Assign user to group
editors_group = Group.objects.get(name="Editors")
user.groups.add(editors_group)

# Verification: user automatically inherits group permissions!
print(user.has_perm("articles.change_article")) # Returns: True
```

---

## 4. Custom View Decorators for Group-Based Access

While checking permissions (`has_perm`) is best practice, sometimes you need to enforce group membership directly:

```python
from django.contrib.auth.decorators import user_passes_test
from django.core.exceptions import PermissionDenied

def in_group(group_name):
    def check_user(user):
        if user.is_authenticated and user.groups.filter(name=group_name).exists():
            return True
        raise PermissionDenied
    return user_passes_test(check_user)

# Guard view to Editors group only
@in_group("Editors")
def publish_draft_view(request, article_id):
    # Only members of Editors group can execute this
    ...
```

---

## Practice Quiz

### Q1: What is the primary benefit of managing user authorization via Django Groups?
- A) Groups compress database tables
- B) Groups allow permissions to be assigned once to a role (e.g. 'Editors'), and users inherit those permissions automatically by joining the group, eliminating manual user-by-user permission management
- C) Groups bypass login passwords
- D) Groups run in WebAssembly
**Answer:** B
**Explanation:** Groups implement Role-Based Access Control (RBAC); permissions are assigned to groups, and users automatically inherit permissions associated with their group memberships.

### Q2: How do you assign a user to an existing Group in Python?
- A) user.group = "Editors"
- B) user.groups.add(group_instance)
- C) group_instance.users.append(user)
- D) user.set_role("Editors")
**Answer:** B
**Explanation:** Because the relationship between User and Group is a ManyToManyField (user.groups), adding a group is accomplished via user.groups.add(group_instance).

### Q3: What is the role of django.contrib.contenttypes.models.ContentType in the permissions system?
- A) It formats text into HTML content
- B) It acts as a high-level catalog tracking every installed model in the project, allowing permissions to associate with specific models
- C) It stores uploaded video files
- D) It compiles templates
**Answer:** B
**Explanation:** ContentType records metadata about all models in the Django project, enabling permissions to link to their corresponding database model.

### Q4: If a user belongs to multiple groups with different permissions, what permissions does the user have?
- A) Only the permissions of the first group joined
- B) The union of all permissions granted across all groups the user belongs to, plus any individual user permissions
- C) The user loses all permissions due to conflict
- D) The permissions of the newest group
**Answer:** B
**Explanation:** Django combines permissions additively: a user possesses the union of all permissions granted directly to their user account and all permissions from every group they belong to.

### Q5: What exception does Django raise when user_passes_test rejects an unauthorized user and you want to return an HTTP 403 Forbidden?
- A) Http404
- B) PermissionDenied
- C) SuspiciousOperation
- D) ValueError
**Answer:** B
**Explanation:** Raising django.core.exceptions.PermissionDenied causes Django to return a standardized HTTP 403 Forbidden response.
