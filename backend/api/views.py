from rest_framework import viewsets, permissions
from .models import Project, Testimonial, Service, HomeStats, ContentSection, ContactInfo
from .serializers import (
    ProjectSerializer, TestimonialSerializer, ServiceSerializer, 
    HomeStatsSerializer, ContentSectionSerializer, ContactInfoSerializer
)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Project.objects.all()
        featured = self.request.query_params.get('featured')
        limit = self.request.query_params.get('limit')
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        
        if limit and limit.isdigit():
            queryset = queryset[:int(limit)]
            
        return queryset

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = Testimonial.objects.all()
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        return queryset

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]

class HomeStatsViewSet(viewsets.ModelViewSet):
    queryset = HomeStats.objects.all()
    serializer_class = HomeStatsSerializer
    permission_classes = [IsAdminOrReadOnly]

class ContentSectionViewSet(viewsets.ModelViewSet):
    queryset = ContentSection.objects.all()
    serializer_class = ContentSectionSerializer
    permission_classes = [IsAdminOrReadOnly]
    # lookup_field = 'section'  <-- Remove this to allow ID lookup (content/1/)
    
    def get_queryset(self):
        queryset = ContentSection.objects.all()
        section = self.request.query_params.get('section')
        if section:
            queryset = queryset.filter(section=section)
        return queryset

class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer
    permission_classes = [IsAdminOrReadOnly]

    # Since it's a singleton (mostly), we might want valid list behavior or just 1.
    # The frontend expects a single object sometimes? No, `getContactInfo` in firebase returned the first doc.
    # We'll allow list, frontend can pick [0].
