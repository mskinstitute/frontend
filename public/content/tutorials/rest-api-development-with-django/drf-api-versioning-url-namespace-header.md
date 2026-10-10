# DRF API Versioning Strategies

APIs are contracts with client applications. As business requirements change, you will inevitably introduce breaking changes—modifying field names, altering response shapes, or removing deprecated endpoints. Without **API Versioning**, releasing breaking changes breaks legacy mobile apps and third-party integrations. Django REST Framework provides five built-in versioning schemes to manage API evolution gracefully.

---

## 1. The Five DRF Versioning Schemes

```
1. URLPathVersioning (Industry Standard):
   https://api.enterprise.com/v1/articles/
   https://api.enterprise.com/v2/articles/

2. NamespaceVersioning:
   Routed via Django URLconf namespaces ('v1:articles', 'v2:articles')

3. QueryParameterVersioning:
   https://api.enterprise.com/articles/?version=v2

4. AcceptHeaderVersioning:
   GET /articles/  Header: Accept: application/json; version=2.0

5. HostNameVersioning:
   https://v1.api.enterprise.com/articles/
   https://v2.api.enterprise.com/articles/
```

---

## 2. Configuring `URLPathVersioning` (Recommended)

`URLPathVersioning` is the most popular, explicit, and cache-friendly versioning pattern in enterprise software:

```python
# config/settings.py
REST_FRAMEWORK = {
    # 1. Declare versioning scheme
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
    # 2. Default fallback version if unspecified
    "DEFAULT_VERSION": "v1",
    # 3. Whitelist permitted versions
    "ALLOWED_VERSIONS": ["v1", "v2"],
    # 4. URL parameter name
    "VERSION_PARAM": "version",
}
```

---

## 3. Configuring `urls.py` with Version Parameter

Use the `<version>` path parameter in root routing:

```python
# config/urls.py
from django.urls import path, re_path, include

urlpatterns = [
    # Captures /api/v1/ or /api/v2/ into request.version
    re_path(r"^api/(?P<version>(v1|v2))/", include("api.urls")),
]
```

---

## 4. Adapting Views & Serializers Based on Version

In your views and serializers, inspect `request.version` to alter behavior dynamically:

```python
# api/views.py
from rest_framework.viewsets import ModelViewSet
from .models import Article
from .serializers_v1 import ArticleSerializerV1
from .serializers_v2 import ArticleSerializerV2

class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()

    def get_serializer_class(self):
        # Serve different serializer schemas based on API version!
        if self.request.version == "v2":
            return ArticleSerializerV2
        return ArticleSerializerV1
```

### Serializer Schema Evolution:
- **v1 Response:** Returns flat attributes: `{"author_name": "Dr. Sumit"}`.
- **v2 Response:** Returns structured nested object: `{"author": {"id": 1, "name": "Dr. Sumit", "avatar": "..."}}`.

---

## 5. Deprecation Policy & Sunset Headers

When retiring an API version, inform clients ahead of time using the standard HTTP `Sunset` header:

```python
# In v1 middleware or response hook:
response["Sunset"] = "Wed, 01 Jan 2027 00:00:00 GMT"
response["Link"] = '<https://api.enterprise.com/docs/v2-migration>; rel="sunset"'
```

---

## Practice Quiz

### Q1: What is the primary purpose of versioning a REST API?
- A) To make URLs longer
- B) To enable developers to deploy breaking schema changes and new features without breaking existing mobile applications or integrations relying on older versions
- C) It is required by Python
- D) To reset user passwords
**Answer:** B
**Explanation:** API versioning provides backward compatibility, allowing legacy clients to function uninterrupted on older versions while newer clients adopt modern schemas.

### Q2: Why is URLPathVersioning (e.g. /api/v1/resource/) widely preferred over Header or Query Parameter versioning?
- A) It runs 10x faster
- B) It is explicit, visible in server logs, easily testable in browsers without custom headers, and effortlessly cached by HTTP CDNs
- C) Header versioning is banned in modern browsers
- D) It uses less memory
**Answer:** B
**Explanation:** URL path versioning makes versions clear in logs, URLs, and documentation while playing nicely with HTTP caching layers.

### Q3: How does a DRF view access the active requested API version string?
- A) request.version
- B) request.GET['v']
- C) settings.VERSION
- D) request.META['VERSION']
**Answer:** A
**Explanation:** DRF's versioning classes inspect the request and populate the request.version attribute (e.g. 'v1' or 'v2') on the DRF Request object.

### Q4: What does ALLOWED_VERSIONS = ["v1", "v2"] configure in DRF settings?
- A) It deletes older versions
- B) It restricts valid versions to "v1" and "v2", automatically raising an HTTP 404 Not Found if a client requests an unsupported version like /api/v3/
- C) It converts v1 into v2
- D) It allows unlimited versions
**Answer:** B
**Explanation:** ALLOWED_VERSIONS whitelists permitted version strings; attempting to query an unlisted version raises a NotFound exception.

### Q5: What standard HTTP response header communicates the scheduled retirement date of an older API version?
- A) Deprecated-On
- B) Sunset
- C) X-Retire-Date
- D) Warning-Expires
**Answer:** B
**Explanation:** The Sunset HTTP header (RFC 8594) communicates the date and time when an endpoint or API version will become completely unresponsive or deactivated.
