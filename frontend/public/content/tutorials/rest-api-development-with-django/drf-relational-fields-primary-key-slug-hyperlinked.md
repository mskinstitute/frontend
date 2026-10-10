# DRF Relational Fields: Primary Key, Slug, and Hyperlinked

In relational architectures, models reference other models. Serializing these associations in Django REST Framework requires selecting the appropriate relational field style: whether to represent related models as **Primary Keys**, **Human-Readable Slugs**, **Hyperlinked URLs**, or **Nested JSON Objects**.

---

## 1. Relational Field Styles Comparison

| Relational Field | Output Format | Best Use Case |
| :--- | :--- | :--- |
| **`PrimaryKeyRelatedField`** | `{"category": 5}` | Standard CRUD, high write efficiency |
| **`SlugRelatedField`** | `{"category": "cloud-architecture"}` | Clean human-readable identifiers |
| **`HyperlinkedRelatedField`**| `{"category": "https://api.com/v1/categories/5/"}` | Pure RESTful HATEOAS systems |
| **`StringRelatedField`** | `{"category": "Cloud Architecture"}` | Read-only `__str__` representations |
| **`Nested Serializer`** | `{"category": {"id": 5, "name": "Cloud"}}` | Detailed nested object graphs |

---

## 2. Implementing Relational Fields in Code

```python
# articles/serializers.py
from rest_framework import serializers
from .models import Article, Category, Tag

class ArticleRelationalSerializer(serializers.ModelSerializer):
    # 1. PrimaryKeyRelatedField: Client passes ID integer
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    # 2. SlugRelatedField: Uses human-readable unique slug
    category_slug = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
        source="category"
    )

    # 3. StringRelatedField: Read-only representation using model __str__
    author_name = serializers.StringRelatedField(source="author", read_only=True)

    # 4. ManyToMany field via SlugRelatedField
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field="title",
        queryset=Tag.objects.all()
    )

    # 5. HyperlinkedRelatedField: Output full URL to detail view
    url = serializers.HyperlinkedIdentityField(
        view_name="article-detail",
        lookup_field="slug"
    )

    class Meta:
        model = Article
        fields = [
            "url",
            "id",
            "title",
            "slug",
            "author_name",
            "category_slug",
            "category_id",
            "tags",
        ]
```

### Serialized JSON Output:
```json
{
  "url": "https://api.enterprise.com/v1/articles/modern-django/",
  "id": 101,
  "title": "Modern Django Architecture",
  "slug": "modern-django",
  "author_name": "Dr. Sumit",
  "category_slug": "backend-engineering",
  "tags": ["python", "django", "drf"]
}
```

---

## 3. The `HyperlinkedModelSerializer`

Instead of returning integer primary keys, `HyperlinkedModelSerializer` automatically uses `HyperlinkedRelatedField` for all relationships and includes a `url` field:

```python
class CategoryHyperlinkedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ["url", "id", "name", "slug"]
        extra_kwargs = {
            "url": {"view_name": "category-detail", "lookup_field": "slug"}
        }
```

Notice: When using `HyperlinkedModelSerializer`, the serializer context **must** include the `request` object (which ViewSets do automatically):
```python
serializer = CategoryHyperlinkedSerializer(instance, context={"request": request})
```

---

## Practice Quiz

### Q1: What is the output of a PrimaryKeyRelatedField?
- A) A full URL string
- B) The integer or UUID primary key identifier of the related record (e.g. 42)
- C) A nested JSON dictionary
- D) The model class name
**Answer:** B
**Explanation:** PrimaryKeyRelatedField represents related models using their raw primary key value (e.g. "author": 5).

### Q2: What requirement must a model field satisfy to be used in a SlugRelatedField?
- A) It must be named "slug"
- B) The field should have unique=True enforced in the database to ensure unambiguous lookups
- C) It must be an integer
- D) It must be encrypted
**Answer:** B
**Explanation:** SlugRelatedField uses the specified field to identify the record; if values are not unique, lookups can match multiple records and fail.

### Q3: Why is context={'request': request} required when initializing a HyperlinkedModelSerializer?
- A) To check user permissions
- B) Hyperlinked serializers need access to the current request's host, protocol (HTTP/HTTPS), and port to construct fully qualified URLs (e.g. https://api.com/...)
- C) To log the user in
- D) To prevent database locks
**Answer:** B
**Explanation:** Constructing absolute resource hyperlinks requires request metadata to determine the scheme and domain name accurately.

### Q4: What is the behavior of StringRelatedField?
- A) It is read-only and outputs the string produced by the related model instance's __str__() method
- B) It allows clients to write arbitrary strings
- C) It parses strings into integers
- D) It compiles strings into HTML
**Answer:** A
**Explanation:** StringRelatedField is strictly read-only, calling str(instance) to provide a human-friendly representation of the associated entity.

### Q5: When writing to a relationship using SlugRelatedField(slug_field="name", queryset=Tag.objects.all()), what does DRF do?
- A) It deletes existing tags
- B) It looks up the Tag object matching name=value in the provided queryset; if found, it binds it to the instance
- C) It converts the tag to uppercase
- D) It creates a new tag automatically
**Answer:** B
**Explanation:** During deserialization, SlugRelatedField queries the provided queryset to find the existing record with the matching slug value.
