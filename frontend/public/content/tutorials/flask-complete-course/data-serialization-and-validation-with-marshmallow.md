# Data Serialization & Validation with Marshmallow

While manually parsing dictionaries (`data["title"]`) works for simple endpoints, enterprise REST APIs require strict contract enforcement: schema validation, type coercion, and serializing complex SQLAlchemy ORM models into clean JSON dictionaries.

**Marshmallow** is the industry-standard Python library for object serialization, deserialization, and validation.

---

## 1. Installing Marshmallow & Flask Integration

```bash
pip install marshmallow flask-marshmallow marshmallow-sqlalchemy
```

- `marshmallow`: Core schema engine.
- `flask-marshmallow`: Flask routing integration (e.g. hyperlinking).
- `marshmallow-sqlalchemy`: Automatically generates schemas from SQLAlchemy models!

---

## 2. Defining Schemas

A **Schema** declares how fields are serialized (ORM to JSON) and deserialized (JSON to Python):

```python
from marshmallow import Schema, fields, validate, post_load

class CourseSchema(Schema):
    # Read-only primary key (dump_only: serialized to output, ignored on input)
    id = fields.Int(dump_only=True)
    
    title = fields.Str(
        required=True,
        validate=[
            validate.Length(min=5, max=150, error="Title must be between 5 and 150 characters.")
        ]
    )
    slug = fields.Str(required=True)
    price = fields.Decimal(
        as_string=True, 
        required=True,
        validate=[validate.Range(min=0, error="Price cannot be negative.")]
    )
    is_published = fields.Bool(load_default=False)
    created_at = fields.DateTime(dump_only=True)

# Instantiate schemas for single objects and collections
course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)
```

---

## 3. Serialization (Dumping: Python Object -> JSON Dict)

Convert SQLAlchemy model instances into JSON-serializable dictionaries using `.dump()`:

```python
from flask import jsonify
from models import Course

@app.route("/api/v1/courses")
def get_courses():
    courses = Course.query.filter_by(is_published=True).all()
    
    # Serializes list of Course ORM models into clean list of dicts!
    result = courses_schema.dump(courses)
    return jsonify(result), 200

@app.route("/api/v1/courses/<int:course_id>")
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    return jsonify(course_schema.dump(course)), 200
```

---

## 4. Deserialization & Validation (Loading: JSON Dict -> Clean Python Data)

When creating or updating resources, use `.load()` to validate incoming payloads. If validation fails, Marshmallow raises a `ValidationError` containing an organized dictionary of field errors:

```python
from flask import request, jsonify
from marshmallow import ValidationError
from models import db, Course

@app.route("/api/v1/courses", methods=["POST"])
def create_course():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        # Validate and deserialize input
        clean_data = course_schema.load(json_data)
    except ValidationError as err:
        # Returns organized map of field errors with HTTP 422!
        # e.g.: {"price": ["Price cannot be negative."], "title": ["Field is required."]}
        return jsonify({"errors": err.messages}), 422

    # Instantiate model with validated data
    new_course = Course(**clean_data)
    db.session.add(new_course)
    db.session.commit()

    return jsonify(course_schema.dump(new_course)), 201
```

---

## 5. Automated Schemas with `SQLAlchemyAutoSchema`

With `marshmallow-sqlalchemy`, you do not need to rewrite columns that already exist on your model:

```python
from flask_marshmallow import Marshmallow
from models import Course

ma = Marshmallow(app)

class CourseAutoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True # Automatically deserializes into Course() instances!
        include_fk = True

auto_course_schema = CourseAutoSchema()
```

---

## Practice Quiz

### Q1: What Marshmallow method converts a Python/ORM object into a JSON-compatible dictionary?
- A) `.load()`
- B) `.dump()`
- C) `.serialize()`
- D) `.export()`
**Answer:** B
**Explanation:** `.dump()` (or `.dumps()`) serializes Python objects into validated dictionaries or JSON strings.

### Q2: What method validates and deserializes incoming JSON data into clean Python data?
- A) `.load()`
- B) `.dump()`
- C) `.ingest()`
- D) `.parse()`
**Answer:** A
**Explanation:** `.load()` deserializes incoming dictionary payloads, enforces field validation rules, and produces clean Python data.

### Q3: What exception is raised by Marshmallow when input data violates validation constraints?
- A) `ValueError`
- B) `ValidationError`
- C) `ConstraintException`
- D) `SchemaError`
**Answer:** B
**Explanation:** `marshmallow.exceptions.ValidationError` is raised, containing an `.messages` dictionary mapping invalid fields to specific error descriptions.

### Q4: What does setting `dump_only=True` on a schema field accomplish?
- A) The field is hidden from output
- B) The field is included when serializing output, but strictly ignored/excluded during incoming input loading
- C) The field is saved to a text dump file
- D) The field can only be an integer
**Answer:** B
**Explanation:** `dump_only=True` is ideal for auto-generated fields (like `id` and `created_at`) that should be sent to the client but never set via client input.

### Q5: How do you serialize a list of multiple model objects using a Marshmallow schema?
- A) Loop manually using `.dump()`
- B) Pass `many=True` when instantiating the schema: `SchemaClass(many=True)`
- C) Call `schema.dump_all()`
- D) Marshmallow cannot serialize lists
**Answer:** B
**Explanation:** Instantiating a schema with `many=True` (e.g. `CourseSchema(many=True)`) configures it to serialize iterable collections.
