from rest_framework import serializers
from .models import Project, Testimonial, Service, HomeStats, ContentSection, ContactInfo

class ProjectSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True) # Cast to string for frontend compatibility
    imageUrl = serializers.SerializerMethodField()
    tags = serializers.JSONField()

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'imageUrl', 'image', 'image_url_fallback', 'tags', 'link', 'featured', 'order', 'created_at', 'updated_at']
        extra_kwargs = {'image': {'write_only': True}} # Frontend sends 'imageUrl' or 'image' file

    def get_imageUrl(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return obj.image_url_fallback or ""

class TestimonialSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    imageUrl = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'company', 'content', 'imageUrl', 'image', 'rating', 'featured', 'order', 'created_at', 'updated_at']
        extra_kwargs = {'image': {'write_only': True}}

    def get_imageUrl(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return ""

class ServiceSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'icon', 'order', 'created_at', 'updated_at']

class HomeStatsSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = HomeStats
        fields = ['id', 'label', 'value', 'order']

class ContentSectionSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    imageUrl = serializers.SerializerMethodField()

    class Meta:
        model = ContentSection
        fields = ['id', 'section', 'title', 'subtitle', 'content', 'imageUrl', 'image', 'updated_at']
        extra_kwargs = {'image': {'write_only': True}}

    def get_imageUrl(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return ""

class ContactInfoSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    socialLinks = serializers.JSONField(source='social_links') # Alias snake_case to camelCase

    class Meta:
        model = ContactInfo
        fields = ['id', 'email', 'phone', 'address', 'socialLinks', 'updated_at']
