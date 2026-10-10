# Custom Form Validators & Secure File Uploads

While built-in WTForms validators handle common requirements (length, email format, non-empty checks), real-world web applications frequently require custom business validation (e.g., verifying database uniqueness, rejecting reserved usernames) and secure file upload handling.

---

## 1. Defining Custom Field Validators

In WTForms, custom validation methods can be attached to a form class following a strict naming convention: `validate_<field_name>(self, field)`.

If the validation condition fails, raise a `ValidationError` from `wtforms.validators`:

```python
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, ValidationError

RESERVED_USERNAMES = {"admin", "root", "system", "moderator", "superuser"}

class UserProfileForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    submit = SubmitField("Update Profile")

    # Custom validator for the 'username' field
    def validate_username(self, field):
        entered_username = field.data.strip().lower()
        
        # Rule 1: Reject reserved system words
        if entered_username in RESERVED_USERNAMES:
            raise ValidationError("This username is reserved by the system. Please choose another.")
            
        # Rule 2: Check database for duplicates (simulated check)
        # existing_user = User.query.filter_by(username=entered_username).first()
        # if existing_user and existing_user.id != current_user.id:
        #     raise ValidationError("That username is already taken.")
```

---

## 2. Secure File Uploads with `FileField` & `FileAllowed`

Uploading files introduces severe security risks:
- Malicious users uploading executable files (`.exe`, `.php`, `.sh`)
- Path traversal attacks exploiting malicious filenames (`../../etc/passwd`)
- Denial of service via massive file sizes

Flask-WTF provides `FileField`, `FileRequired`, and `FileAllowed` to enforce strict type whitelisting.

```bash
pip install Flask-WTF[file]
```

```python
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import SubmitField

class AvatarUploadForm(FlaskForm):
    avatar = FileField(
        label="Profile Picture",
        validators=[
            FileRequired(message="Please select an image file to upload."),
            FileAllowed(["jpg", "jpeg", "png", "webp"], message="Images only (jpg, png, webp)!")
        ]
    )
    submit = SubmitField("Upload Avatar")
```

---

## 3. Sanitizing Filenames with `secure_filename`

Never trust the client-provided `file.filename`. Always pass it through Werkzeug's `secure_filename()` to strip dangerous path separators and special characters:

```python
import os
import uuid
from flask import Flask, render_template, request, flash, redirect, url_for
from werkzeug.utils import secure_filename
from forms import AvatarUploadForm

app = Flask(__name__)
app.config["SECRET_KEY"] = "secure-secret-key"
app.config["UPLOAD_FOLDER"] = os.path.join(app.root_path, "static", "uploads", "avatars")
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # Max upload size: 5 Megabytes

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

@app.route("/upload-avatar", methods=["GET", "POST"])
def upload_avatar():
    form = AvatarUploadForm()
    
    if form.validate_on_submit():
        file = form.avatar.data
        
        # 1. Sanitize the filename
        original_filename = secure_filename(file.filename)
        
        # 2. Prevent filename collisions by prefixing a unique UUID
        ext = original_filename.rsplit(".", 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        
        # 3. Save to disk
        save_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        file.save(save_path)
        
        flash("Avatar successfully uploaded!", "success")
        return redirect(url_for("profile"))
        
    return render_template("upload_avatar.html", form=form)
```

### Essential: Multipart Form Encoding
When building forms with file upload inputs, you **must** include `enctype="multipart/form-data"` on the `<form>` tag:

```html
<form method="POST" enctype="multipart/form-data">
    {{ form.hidden_tag() }}
    
    <div class="mb-4">
        {{ form.avatar.label }}
        {{ form.avatar(class="form-input") }}
        {% for error in form.avatar.errors %}
            <p class="text-red-500 text-xs">{{ error }}</p>
        {% endfor %}
    </div>
    
    {{ form.submit(class="btn btn-primary") }}
</form>
```

---

## Practice Quiz

### Q1: What naming convention does WTForms require for in-form custom field validation methods?
- A) `check_<field_name>(self, field)`
- B) `validate_<field_name>(self, field)`
- C) `test_<field_name>(self, field)`
- D) `verify_<field_name>(self, field)`
**Answer:** B
**Explanation:** Defining a method named `validate_<field_name>(self, field)` on a `FlaskForm` class causes WTForms to run it automatically during validation.

### Q2: What exception must be raised when a custom validation rule fails?
- A) `ValueError`
- B) `ValidationError` from `wtforms.validators`
- C) `HTTPException`
- D) `AbortValidation`
**Answer:** B
**Explanation:** Raising `wtforms.validators.ValidationError("Error message")` attaches the message to the field's `.errors` list and halts validation.

### Q3: What security vulnerability does Werkzeug's `secure_filename()` prevent?
- A) SQL injection
- B) Directory traversal attacks where malicious filenames like `../../etc/passwd` overwrite system files
- C) Database deadlocks
- D) Memory leaks in Python
**Answer:** B
**Explanation:** `secure_filename` strips directory traversal sequences (`..`, slashes) and special characters, guaranteeing that the file is saved strictly within the designated upload directory.

### Q4: What HTML attribute is required on a `<form>` element when uploading files?
- A) `method="PUT"`
- B) `enctype="multipart/form-data"`
- C) `type="binary"`
- D) `file-mode="binary"`
**Answer:** B
**Explanation:** File uploads require `enctype="multipart/form-data"` so the browser packages file bytes separately from standard URL-encoded form fields.

### Q5: What application configuration setting limits the maximum permitted upload payload size in Flask?
- A) `MAX_FILE_BYTES`
- B) `MAX_CONTENT_LENGTH`
- C) `UPLOAD_LIMIT_MB`
- D) `CLIENT_MAX_SIZE`
**Answer:** B
**Explanation:** Setting `app.config['MAX_CONTENT_LENGTH']` instructs Werkzeug to automatically abort uploads exceeding that byte limit with an HTTP 413 Request Entity Too Large.
