# Background Tasks with Celery and Redis

Web requests should be fast—ideally responding in under 200 milliseconds. Performing synchronous, long-running operations inside a Flask request handler (such as generating PDF reports, training ML models, processing video, or sending emails) freezes the worker process and causes client timeouts.

**Celery** is an asynchronous distributed task queue that offloads time-consuming tasks to background worker processes, using **Redis** or **RabbitMQ** as a message broker.

---

## 1. System Architecture: Flask + Redis + Celery

```
+-------------------+        1. HTTP Request (e.g. POST /enroll)       +-----------------------+
|  Client Browser   | ===============================================> |   Flask Web Server    |
+-------------------+                                                  +-----------------------+
                                                                                  |
                                                                         2. delay() Task Message
                                                                                  v
                                                                       +-----------------------+
                                                                       |   Redis (Broker)      |
                                                                       |   Queue: 'celery'     |
                                                                       +-----------------------+
                                                                                  |
                                                                         3. Pulls message
                                                                                  v
+-------------------+        5. Reads Result (Optional)                +-----------------------+
|  Client Polling   | <----------------------------------------------- | Celery Background     |
|  or WebSocket     |                                                  | Worker Process        |
+-------------------+                                                  +-----------------------+
                                                                         4. Sends email, builds
                                                                            PDF, logs analytics
```

---

## 2. Installation & Prerequisites

```bash
pip install celery redis
```

Ensure Redis is running locally or via Docker:
```bash
docker run -d -p 6379:6379 --name redis-server redis:alpine
```

---

## 3. Configuring Celery with Modern Flask

In `app/tasks.py`:

```python
import time
from celery import Celery, Task
from flask import Flask

def celery_init_app(app: Flask) -> Celery:
    # Subclass Task to automatically run within Flask's application context!
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object({
        "broker_url": app.config.get("CELERY_BROKER_URL", "redis://localhost:6379/0"),
        "result_backend": app.config.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"),
        "task_ignore_result": False,
        "task_serializer": "json",
        "result_serializer": "json",
        "accept_content": ["json"]
    })
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app
```

---

## 4. Defining Asynchronous Tasks

Decorate tasks using `@celery_app.task`:

```python
from celery import shared_task
import time

@shared_task(bind=True, max_retries=3)
def send_welcome_email(self, user_email, username):
    try:
        print(f"Starting email dispatch to {user_email}...")
        # Simulate SMTP network latency
        time.sleep(4)
        print(f"Email successfully delivered to {username}!")
        return {"status": "Delivered", "recipient": user_email}
    except Exception as exc:
        # Automatic retry with exponential backoff on failure
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
```

---

## 5. Triggering Tasks from Flask Views (`.delay()`)

Call the task using `.delay()` (a shortcut for `.apply_async()`). The Flask view dispatches the message to Redis and returns an immediate HTTP response in milliseconds:

```python
from flask import Flask, jsonify, request
from app.tasks import send_welcome_email

@app.route("/api/v1/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")

    # Offload task to Celery worker asynchronously!
    # Returns immediately without waiting 4 seconds
    task = send_welcome_email.delay(email, username)

    return jsonify({
        "message": "User registered successfully!",
        "task_id": task.id
    }), 202
```

---

## 6. Running the Celery Worker Process

In a separate terminal window, start the Celery worker:

```bash
celery -A wsgi.celery_app worker --loglevel=info
```

---

## Practice Quiz

### Q1: What role does Redis serve in a Celery + Flask architecture?
- A) It renders Jinja2 templates
- B) It acts as the message broker, storing task queues and passing messages between Flask and Celery workers
- C) It compiles Python bytecode
- D) It handles HTTPS SSL handshakes
**Answer:** B
**Explanation:** Redis functions as the in-memory message broker, receiving task dispatches from Flask and queuing them for Celery worker processes.

### Q2: What method is used to trigger an asynchronous Celery task execution from a Flask route handler?
- A) `task.run()`
- B) `task.delay(*args, **kwargs)`
- C) `task.execute()`
- D) `task.dispatch_thread()`
**Answer:** B
**Explanation:** `.delay()` is Celery's convenient shortcut for `.apply_async()` that publishes the task message to the broker and returns immediately with an `AsyncResult`.

### Q3: Why is running tasks in the background critical for web application performance?
- A) It reduces database table size
- B) It prevents long-running operations from blocking the web server worker and timing out client HTTP connections
- C) It eliminates the need for CSS
- D) It encrypts network packets
**Answer:** B
**Explanation:** Synchronous execution of slow tasks (PDF generation, email delivery) blocks WSGI workers from serving other users; offloading keeps responses under 200ms.

### Q4: Why must a custom Celery `FlaskTask` wrap task execution inside `with app.app_context():`?
- A) To compress log files
- B) So the Celery task has access to Flask's database models, configurations, and extension bindings
- C) To run tasks on the client's browser
- D) To bypass Redis
**Answer:** B
**Explanation:** Tasks often query `db` or use `current_app.config`. Running inside `with app.app_context()` ensures the application context is active during worker execution.

### Q5: What HTTP status code is most appropriate when an endpoint accepts a request and queues it for background processing without waiting for completion?
- A) `200 OK`
- B) `202 Accepted`
- C) `204 No Content`
- D) `302 Found`
**Answer:** B
**Explanation:** HTTP 202 Accepted explicitly indicates that the request has been accepted for processing, but processing has not yet completed.
