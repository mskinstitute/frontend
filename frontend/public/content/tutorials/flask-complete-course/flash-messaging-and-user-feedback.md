# Flash Messaging System & User Feedback UI

Web applications frequently redirect users following state-changing operations (such as login, registration, or profile updates) according to the **Post/Redirect/Get (PRG)** pattern. Because HTTP is stateless, transmitting feedback messages across redirects requires session storage.

Flask provides a lightweight, built-in mechanism called **Flashing** to record a message in the session and consume it on the next rendered page.

---

## 1. How Flask Flash Messaging Works

1. In your Python route, call `flash(message, category)`:
   - Flask cryptographically signs and stores the message in the client's session cookie.
2. The user is redirected (`return redirect(...)`).
3. In the destination template, call `get_flashed_messages()`:
   - The messages are extracted, rendered on the page, and immediately purged from the session.
4. If the user refreshes the page, the messages are gone!

```
[ POST /profile ] ---> flash("Profile updated!", "success") ---> 302 Redirect
                                                                      |
                                                                      v
[ GET /dashboard ] <-- get_flashed_messages() renders alert <--- (Cookie Cleared)
```

---

## 2. Flashing Messages in Route Handlers

```python
from flask import Flask, flash, redirect, url_for, render_template

app = Flask(__name__)
app.config["SECRET_KEY"] = "super-secret-session-key"

@app.route("/update-settings", methods=["POST"])
def update_settings():
    # Perform business logic...
    success = True
    
    if success:
        # Category allows styling (success, danger, warning, info)
        flash("Your profile settings were saved successfully!", "success")
        flash("An email confirmation has been dispatched.", "info")
    else:
        flash("Could not update settings. Please verify your inputs.", "danger")
        
    return redirect(url_for("dashboard"))
```

---

## 3. Rendering Flashed Messages in Jinja2

Use `get_flashed_messages(with_categories=True)` in your master `base.html` layout so messages render consistently across every page on your site:

```html
<!-- templates/base.html -->
<main class="container mx-auto px-4 py-6">

    <!-- Flash Message Notification Container -->
    {% with messages = get_flashed_messages(with_categories=true) %}
        {% if messages %}
            <div class="space-y-3 mb-6">
            {% for category, message in messages %}
                <div class="p-4 rounded-xl border flex items-center justify-between 
                    {% if category == 'success' %}
                        bg-emerald-50 border-emerald-200 text-emerald-800
                    {% elif category == 'danger' or category == 'error' %}
                        bg-red-50 border-red-200 text-red-800
                    {% elif category == 'warning' %}
                        bg-amber-50 border-amber-200 text-amber-800
                    {% else %}
                        bg-blue-50 border-blue-200 text-blue-800
                    {% endif %}
                ">
                    <span class="text-sm font-medium">{{ message }}</span>
                    <button onclick="this.parentElement.remove()" class="text-xs font-bold opacity-60 hover:opacity-100">
                        &times;
                    </button>
                </div>
            {% endfor %}
            </div>
        {% endif %}
    {% endwith %}

    {% block content %}{% endblock %}
</main>
```

---

## 4. Filtering Messages by Category

In specific modular templates, you may want to extract only messages of a single category:

```html
<!-- Extract only error messages -->
{% for message in get_flashed_messages(category_filter=["danger", "error"]) %}
    <div class="alert-box error">{{ message }}</div>
{% endfor %}
```

---

## Practice Quiz

### Q1: Where does Flask store flashed messages between the initial request and the subsequent redirect?
- A) In an external Redis database
- B) In the signed client-side session cookie
- C) In a temporary text file on the server
- D) In browser localStorage
**Answer:** B
**Explanation:** Flashed messages are stored in Flask's encrypted session cookie and removed as soon as `get_flashed_messages()` is called.

### Q2: What parameter must be passed to `get_flashed_messages()` to receive tuples of `(category, message)`?
- A) `categories=True`
- B) `with_categories=True`
- C) `include_types=True`
- D) `detailed=True`
**Answer:** B
**Explanation:** Passing `with_categories=True` instructs `get_flashed_messages()` to return a list of `(category, message)` tuples instead of plain message strings.

### Q3: What happens to flashed messages after they are read by `get_flashed_messages()` during page rendering?
- A) They remain stored until the user logs out
- B) They are immediately cleared from the session, so a page refresh will not display them again
- C) They are saved to a PostgreSQL database table
- D) They are emailed to the administrator
**Answer:** B
**Explanation:** Flask flash messages are designed for single-use display; once rendered, they are purged from the session.

### Q4: Why is the Post/Redirect/Get (PRG) pattern combined with flash messaging considered a web design best practice?
- A) It prevents duplicate form submissions if the user refreshes their browser after submitting
- B) It speeds up Python CPU processing
- C) It bypasses HTTPS encryption
- D) It automatically converts forms to JSON
**Answer:** A
**Explanation:** The PRG pattern redirects POST requests to a GET endpoint, preventing accidental duplicate transactions or payments when users hit reload.

### Q5: How do you filter flashed messages to display only "success" alerts in a specific template?
- A) `get_flashed_messages(filter='success')`
- B) `get_flashed_messages(category_filter=['success'])`
- C) `filter_flash('success')`
- D) `get_flashed_messages(only=['success'])`
**Answer:** B
**Explanation:** The `category_filter` argument accepts a list of category names to retrieve only matching flashed messages.
