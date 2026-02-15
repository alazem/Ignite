from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair_no_slash'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh_no_slash'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Even in production, it's good to have this as a fallback if Cloudinary is not used
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

