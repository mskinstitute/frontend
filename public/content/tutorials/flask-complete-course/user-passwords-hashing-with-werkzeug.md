# Password Hashing with Werkzeug Security

Storing plaintext passwords in a database is one of the most catastrophic security failures a web developer can make. If a database is breached or leaked, plaintext passwords immediately compromise user accounts across every service where they reuse that password.

Werkzeug provides cryptographic password hashing via its `werkzeug.security` module, utilizing salted **PBKDF2** or **scrypt** algorithms.

---

## 1. How Cryptographic Hashing Works

A cryptographic hash function is a **one-way function**:
- Given an input password, it produces a fixed-length hexadecimal digest.
- It is mathematically infeasible to reverse-engineer the original password from the digest.

```
+-------------------+        Cryptographic Algorithm         +-------------------------------------+
| Plaintext Password| =====================================> | Salted Hash Digest                  |
| "SecretP@ss2026!" |   (PBKDF2-HMAC-SHA256 + 16-byte salt)  | "pbkdf2:sha256:600000$8xG...$9mP..." |
+-------------------+                                        +-------------------------------------+
```

### The Role of Salt:
A **salt** is a cryptographically random byte string generated for every individual password before hashing. Salts prevent **rainbow table attacks** (precomputed hash lookup tables) and ensure that two users with identical passwords will have completely different hashes!

---

## 2. Generating Hashes with `generate_password_hash`

```python
from werkzeug.security import generate_password_hash, check_password_hash

# Hash a plaintext password
plaintext = "SuperSecretPassword123"
hashed_password = generate_password_hash(
    plaintext, 
    method="pbkdf2:sha256:600000", # Algorithm and iteration work factor
    salt_length=16
)

print(hashed_password)
# Output format: method$salt$hash
# Example: 'pbkdf2:sha256:600000$hK4J8vL2...$8f4a7c1b...'
```

---

## 3. Verifying Passwords with `check_password_hash`

When a user attempts to log in, never attempt to decrypt the stored hash. Instead, pass the entered password and the stored hash into `check_password_hash()`:

```python
entered_password = "SuperSecretPassword123"

# Returns True if password matches; False otherwise
is_valid = check_password_hash(hashed_password, entered_password)

if is_valid:
    print("Authentication successful!")
else:
    print("Invalid credentials.")
```

`check_password_hash` extracts the salt and algorithm parameters from the stored hash string, hashes the entered password using those exact parameters, and uses a **constant-time comparison** algorithm to prevent timing attacks.

---

## 4. Integrating Password Hashing into a User Model

Encapsulate password handling directly on your SQLAlchemy `User` model using Python properties:

```python
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    # Store only the hashed string, NEVER the plaintext password!
    password_hash = db.Column(db.String(256), nullable=False)

    @property
    def password(self):
        # Prevent reading password attribute directly
        raise AttributeError("password is not a readable attribute")

    @password.setter
    def password(self, plaintext_password):
        # Automatically hashes password when setting user.password = "secret"
        self.password_hash = generate_password_hash(plaintext_password)

    def verify_password(self, plaintext_password):
        # Instance method to verify login credentials
        return check_password_hash(self.password_hash, plaintext_password)
```

### Usage in Registration & Login:
```python
# Registration
new_user = User(username="sumit", email="sumit@example.com")
new_user.password = "StrongPass2026!"  # Automatically hashed!
db.session.add(new_user)
db.session.commit()

# Login Verification
user = User.query.filter_by(username="sumit").first()
if user and user.verify_password("StrongPass2026!"):
    # Log user in
    pass
```

---

## Practice Quiz

### Q1: Which two functions from `werkzeug.security` manage password security in Flask?
- A) `encrypt_password` and `decrypt_password`
- B) `generate_password_hash` and `check_password_hash`
- C) `make_hash` and `validate_hash`
- D) `cipher_text` and `uncipher_text`
**Answer:** B
**Explanation:** `generate_password_hash` creates a salted hash, and `check_password_hash` validates a candidate password against the stored hash.

### Q2: Why is a random "salt" added to passwords before hashing?
- A) To make password storage take up less disk space
- B) To ensure identical passwords produce different hash outputs, defeating precomputed rainbow table attacks
- C) To allow passwords to be recovered by administrators
- D) To speed up hashing on GPUs
**Answer:** B
**Explanation:** Salting guarantees uniqueness; even if two users choose the exact same password, their hashes will differ completely, preventing rainbow table attacks.

### Q3: Why does attempting to read `user.password` raise an `AttributeError` in the recommended User model pattern?
- A) Because the database crashed
- B) To enforce security by design, ensuring plaintext passwords cannot be accidentally read, logged, or serialized into JSON responses
- C) Because Python does not support properties
- D) Because Werkzeug deletes the attribute
**Answer:** B
**Explanation:** Raising an `AttributeError` when reading `user.password` prevents developers from accidentally outputting plaintext passwords in logs, templates, or API payloads.

### Q4: Why does `check_password_hash` use a constant-time comparison algorithm?
- A) To prevent CPU overheating
- B) To prevent side-channel timing attacks where attackers measure execution milliseconds to deduce correct characters
- C) To ensure tests complete under 1 second
- D) Because Python strings cannot be compared with `==`
**Answer:** B
**Explanation:** Standard string comparisons terminate early on the first mismatched character, leaking timing hints; constant-time comparisons eliminate timing attack vectors.

### Q5: Can a properly generated cryptographic hash be decrypted back into the original plaintext password?
- A) Yes, using the application's `SECRET_KEY`
- B) No, cryptographic hash functions are strictly one-way mathematical algorithms designed to be irreversible
- C) Yes, by calling `werkzeug.security.decrypt_hash()`
- D) Yes, in Flask debug mode
**Answer:** B
**Explanation:** Cryptographic hashes are mathematically one-way; they cannot be reversed or decrypted. Authentication works by hashing incoming candidates and comparing digests.
