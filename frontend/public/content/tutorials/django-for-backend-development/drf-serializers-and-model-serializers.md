# Serializers

In API development, data must be converted from complex Python objects (such as Django model instances and QuerySets) into machine-readable formats like JSON, and vice versa. **Django REST Framework (DRF) Serializers** handle both **serialization** (Python objects -> JSON) and **deserialization** (JSON -> validated Python data) with powerful validation pipelines.

---

## 1. Serialization vs Deserialization

```
Serialization (Read / GET):
Model Instance (Article) ──► Serializer ──► Python dict ──► JSON string (Client)

Deserialization (Write / POST):
Client JSON payload ──► Serializer.is_valid() ──► Validated data ──► Model Instance saved
```

---

## 2. Implementing an Enterprise `ModelSerializer`

`ModelSerializer` inspects model fields and generates serializer fields, validators, and default `create()` / `update()` methods automatically:

```python
# articles/serializers.py
from rest_framework import serializers
from .models import Article, Category, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "title"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]

class ArticleSerializer(serializers.ModelSerializer):
    # 1. Read-only nested representation
    category = CategorySerializer(read_only=True)
    
    # 2. Write-only field for passing category ID during mutations
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    # 3. Read-only field displaying author username
    author_username = serializers.CharField(source="author.username", read_only=True)

    # 4. Computed custom field via SerializerMethodField
    reading_time_minutes = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "status",
            "author_username",
            "category",
            "category_id",
            "reading_time_minutes",
            "created_at",
        ]
        read_only_fields = ["id", "slug", "created_at"]

    def get_reading_time_minutes(self, obj: Article) -> int:
        # Calculate reading time assuming 200 words per minute
        word_count = len(obj.content.split())
        return max(1, round(word_count / 200))

    # Field-level validator
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters.")
        return value
```

---

## 3. Customizing `create()` and `update()`

When nested or relational fields require explicit processing:

```python
class ArticleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["title", "content", "category", "tags"]

    def create(self, validated_data):
        # Extract M2M tags if present
        tags_data = validated_data.pop("tags", [])
        
        # Create parent instance
        article = Article.objects.create(**validated_data)
        
        # Attach tags
        article.tags.set(tags_data)
        return article
```

---

## 4. Serializer Validation Workflow

```python
# Inspecting and validating incoming request data
serializer = ArticleSerializer(data=request.data)

if serializer.is_valid():
    # Access validated data dictionary
    clean_data = serializer.validated_data
    # Save instance (calls create() or update())
    instance = serializer.save(author=request.user)
else:
    # Access validation error dictionary
    print(serializer.errors)
```

---

## Practice Quiz

### Q1: What two primary functions do Django REST Framework serializers perform?
- A) Compressing images and formatting CSS
- B) Converting complex model instances into JSON/Python primitives (serialization) and validating incoming JSON payloads into model instances (deserialization)
- C) Encrypting databases and issuing SSL certificates
- D) Handling user password resets
**Answer:** B
**Explanation:** Serializers translate Django model objects into serializable JSON representations and validate incoming request data to instantiate or update records.

### Q2: What does a SerializerMethodField accomplish?
- A) It deletes methods on models
- B) It generates a read-only field whose value is calculated at runtime by invoking a method named get_<field_name>(self, obj) on the serializer
- C) It converts strings into integers
- D) It bypasses validation
**Answer:** B
**Explanation:** SerializerMethodField calculates dynamic values at serialization time by calling a corresponding get_<field_name> method on the serializer instance.

### Q3: How do you mark a serializer field so that it appears in GET responses but is rejected if clients send it in POST/PUT requests?
- A) write_only=True
- B) read_only=True
- C) disabled=True
- D) protected=True
**Answer:** B
**Explanation:** read_only=True fields are included in serialized API outputs but ignored during deserialization and mutations.

### Q4: What attribute holds cleaned, validated data after calling serializer.is_valid()?
- A) serializer.data
- B) serializer.validated_data
- C) serializer.cleaned
- D) serializer.payload
**Answer:** B
**Explanation:** Once is_valid() succeeds, the validated dictionary is accessible via serializer.validated_data, ready for storage or business logic.

### Q5: Why is ModelSerializer preferred over the base Serializer class when working with Django models?
- A) It automatically generates fields, default validators, and create()/update() implementations directly based on the underlying Django model schema
- B) Base Serializer cannot run on Linux
- C) ModelSerializer compiles to C++
- D) ModelSerializer does not support validation
**Answer:** A
**Explanation:** ModelSerializer inspects the model class to automatically scaffold fields, foreign key relationships, unique validators, and database persistence methods.
