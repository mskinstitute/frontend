# DRF Serializers: Serialization and Deserialization

At the heart of Django REST Framework lies the **Serializer**. Serializers act as the bidirectional translator between complex Python objects (such as Django ORM model instances and QuerySets) and structured data formats (primarily JSON). They also enforce strict input validation during data ingestion.

---

## 1. The Serialization Pipeline (Read / GET)

When a client queries an endpoint, Django model instances are converted into Python primitive types, which are subsequently rendered into JSON:

```
Database Record ──► Django Model Instance ──► DRF Serializer.data ──► JSON String ──► Client
```

```python
# Example: Serializing a single model instance
from articles.models import Article
from articles.serializers import ArticleSerializer

article = Article.objects.get(id=1)
serializer = ArticleSerializer(article)
print(serializer.data)
# Output: {'id': 1, 'title': 'Django ORM', 'slug': 'django-orm', 'content': '...'}
```

When serializing QuerySets containing multiple items, **`many=True`** is mandatory:

```python
articles_queryset = Article.objects.all()
serializer = ArticleSerializer(articles_queryset, many=True)
print(serializer.data)
# Output: [{'id': 1, ...}, {'id': 2, ...}]
```

---

## 2. The Deserialization Pipeline (Write / POST / PUT)

When a client sends data to create or update a resource:

```
Client JSON ──► Request.data dict ──► Serializer(data=payload) ──► is_valid() ──► save()
```

```python
# Ingesting client JSON
payload = {"title": "New Article", "content": "Article body text..."}
serializer = ArticleSerializer(data=payload)

# Validation MUST be executed before accessing validated_data or calling save()
if serializer.is_valid(raise_exception=True):
    # Persist instance to database
    article_instance = serializer.save(author=request.user)
```

`raise_exception=True` automatically throws a `serializers.ValidationError`, which DRF translates into an **HTTP 400 Bad Request** containing structured error messages.

---

## 3. Custom Field-Level and Object-Level Validation

### Field-Level Validation (`validate_<field_name>`)
```python
class ProductSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be strictly greater than zero.")
        return value
```

### Object-Level Cross-Field Validation (`validate`)
```python
    def validate(self, data):
        # Cross-field verification
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({
                "end_date": "End date cannot occur prior to start date."
            })
        return data
```

---

## 4. `Serializer` vs `ModelSerializer`

- **`serializers.Serializer`:** Base class. Requires declaring every field manually (`name = serializers.CharField()`) and writing explicit `create()` and `update()` methods. Used for non-model inputs or third-party API proxies.
- **`serializers.ModelSerializer`:** Automates field creation, relational mapping, unique validators, and database persistence directly from a Django model.

---

## Practice Quiz

### Q1: Why is many=True required when initializing a serializer with a QuerySet?
- A) To tell Python to run in multi-threaded mode
- B) To instruct the serializer to iterate over a collection of objects (list/QuerySet) rather than treating the input as a single model instance
- C) many=True is only used for ManyToMany fields
- D) To save memory
**Answer:** B
**Explanation:** Passing many=True signals the serializer to treat the argument as an iterable collection of instances and output a list of serialized dictionaries.

### Q2: What happens if you call serializer.save() before calling serializer.is_valid()?
- A) It saves null values to the database
- B) An AssertionError is raised stating that you must call .is_valid() before accessing .save() or .validated_data
- C) The server reboots
- D) It bypasses validation
**Answer:** B
**Explanation:** DRF enforces that data must be validated through is_valid() before it can be saved or accessed via validated_data.

### Q3: What is the benefit of calling serializer.is_valid(raise_exception=True)?
- A) It logs errors to a text file
- B) It automatically raises rest_framework.exceptions.ValidationError if errors exist, which DRF intercepts to return an immediate HTTP 400 response
- C) It crashes the server
- D) It ignores validation errors
**Answer:** B
**Explanation:** raise_exception=True eliminates repetitive if not is_valid(): return Response(errors, 400) boilerplate by raising a handled exception that returns HTTP 400 automatically.

### Q4: Where are validated inputs stored after serializer.is_valid() succeeds?
- A) serializer.data
- B) serializer.validated_data
- C) serializer.cleaned
- D) serializer.payload
**Answer:** B
**Explanation:** serializer.validated_data holds the thoroughly cleaned, validated, and typecast dictionary ready for consumption or model instantiation.

### Q5: In custom validation, what exception class must be raised when an invalid value is detected?
- A) ValueError
- B) serializers.ValidationError
- C) Http400Exception
- D) SyntaxError
**Answer:** B
**Explanation:** Raising rest_framework.serializers.ValidationError correctly populates the serializer's error dictionary and returns appropriate HTTP 400 status codes.
