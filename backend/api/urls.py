from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, TestimonialViewSet, ServiceViewSet, 
    HomeStatsViewSet, ContentSectionViewSet, ContactInfoViewSet
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'home-stats', HomeStatsViewSet)
router.register(r'content', ContentSectionViewSet)
router.register(r'contact-info', ContactInfoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
