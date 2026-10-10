from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root_view(request):
    return JsonResponse({
        "service": "MSK Institute Backend API",
        "status": "healthy",
        "auth_endpoints": {
            "register": "/api/auth/register/",
            "login": "/api/auth/login/",
            "logout": "/api/auth/logout/",
            "refresh": "/api/auth/token/refresh/",
            "profile": "/api/auth/me/",
            "forgot_password": "/api/auth/forgot-password/",
            "reset_password": "/api/auth/reset-password/",
        }
    })

urlpatterns = [
    path('', api_root_view, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls', namespace='authentication')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
