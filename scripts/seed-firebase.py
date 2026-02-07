"""
Firebase Database Seeder
Populates Firestore with initial portfolio data

Before running:
1. Install Firebase Admin SDK: pip install firebase-admin
2. Download your Firebase service account key JSON file
3. Set FIREBASE_SERVICE_ACCOUNT_PATH environment variable to the path of your JSON file
4. Or update the path directly in the script below
"""

import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime

# Initialize Firebase Admin
# Option 1: Use environment variable
service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')

# Option 2: Direct path (uncomment and update)
# service_account_path = './path-to-your-service-account-key.json'

if not service_account_path:
    print("❌ Please set FIREBASE_SERVICE_ACCOUNT_PATH environment variable or update the script with your service account key path")
    exit(1)

cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

print("🔥 Starting Firebase seeding...")

# Seed Projects
projects = [
    {
        'title': 'E-Commerce Platform Redesign',
        'description': 'Complete redesign and development of a modern e-commerce platform with advanced filtering and seamless checkout experience.',
        'imageUrl': '/placeholder.svg?height=600&width=800',
        'tags': ['Design', 'Development', 'E-Commerce'],
        'link': 'https://example.com/project1',
        'featured': True,
        'order': 1,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'title': 'Corporate Brand Identity',
        'description': 'Comprehensive brand identity system including logo, guidelines, and marketing materials for a fintech startup.',
        'imageUrl': '/placeholder.svg?height=600&width=800',
        'tags': ['Branding', 'Design'],
        'featured': True,
        'order': 2,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'title': 'Mobile App Development',
        'description': 'Native iOS and Android app for fitness tracking with real-time analytics and social features.',
        'imageUrl': '/placeholder.svg?height=600&width=800',
        'tags': ['Mobile', 'Development', 'UX/UI'],
        'featured': False,
        'order': 3,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'title': 'SaaS Dashboard Design',
        'description': 'Intuitive dashboard interface for a B2B analytics platform with complex data visualization.',
        'imageUrl': '/placeholder.svg?height=600&width=800',
        'tags': ['Design', 'SaaS', 'Data Visualization'],
        'featured': True,
        'order': 4,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
]

projects_ref = db.collection('projects')
for project in projects:
    projects_ref.add(project)
    print(f"✅ Added project: {project['title']}")

# Seed Testimonials
testimonials = [
    {
        'name': 'Sarah Johnson',
        'role': 'CEO',
        'company': 'TechStart Inc',
        'content': 'Working with this team transformed our digital presence. Their attention to detail and innovative approach exceeded our expectations.',
        'imageUrl': '/placeholder.svg?height=200&width=200',
        'rating': 5,
        'featured': True,
        'order': 1,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'name': 'Michael Chen',
        'role': 'Product Manager',
        'company': 'Innovation Labs',
        'content': 'The level of professionalism and expertise is unmatched. They delivered a product that our users absolutely love.',
        'imageUrl': '/placeholder.svg?height=200&width=200',
        'rating': 5,
        'featured': True,
        'order': 2,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'name': 'Emily Rodriguez',
        'role': 'Marketing Director',
        'company': 'GrowthCo',
        'content': 'Exceptional work from start to finish. The team was responsive, creative, and delivered exactly what we needed.',
        'rating': 5,
        'featured': True,
        'order': 3,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
]

testimonials_ref = db.collection('testimonials')
for testimonial in testimonials:
    testimonials_ref.add(testimonial)
    print(f"✅ Added testimonial: {testimonial['name']}")

# Seed Services
services = [
    {
        'title': 'Brand Strategy & Identity',
        'description': 'We craft compelling brand narratives and visual identities that resonate with your target audience and stand out in the market.',
        'icon': 'palette',
        'order': 1,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'title': 'Web & Mobile Development',
        'description': 'Custom-built websites and applications using cutting-edge technologies to deliver exceptional user experiences.',
        'icon': 'code',
        'order': 2,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'title': 'UX/UI Design',
        'description': 'User-centered design solutions that prioritize functionality, accessibility, and aesthetic excellence.',
        'icon': 'layout',
        'order': 3,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'title': 'Digital Strategy',
        'description': 'Comprehensive digital strategies that align with your business goals and drive measurable results.',
        'icon': 'target',
        'order': 4,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
]

services_ref = db.collection('services')
for service in services:
    services_ref.add(service)
    print(f"✅ Added service: {service['title']}")

# Seed Home Stats
home_stats = [
    {'label': 'Projects Completed', 'value': '150+', 'order': 1},
    {'label': 'Happy Clients', 'value': '80+', 'order': 2},
    {'label': 'Years Experience', 'value': '12', 'order': 3},
    {'label': 'Team Members', 'value': '25', 'order': 4},
]

stats_ref = db.collection('homeStats')
for stat in home_stats:
    stats_ref.add(stat)
    print(f"✅ Added stat: {stat['label']}")

# Seed Content Sections
content_sections = [
    {
        'section': 'hero',
        'title': 'Creating Digital Experiences That Matter',
        'subtitle': 'A Creative Team',
        'content': 'We transform ideas into exceptional digital products through innovative design and strategic thinking.',
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'section': 'about',
        'title': 'About Our Team',
        'content': 'We are a collective of designers, developers, and strategists who believe in the power of thoughtful digital experiences. With over a decade of combined experience, we partner with ambitious brands to create products that make a lasting impact. Our approach combines creative excellence with technical expertise to deliver solutions that exceed expectations.',
        'imageUrl': '/placeholder.svg?height=600&width=800',
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'section': 'mission',
        'title': 'Our Mission',
        'content': 'To elevate brands through exceptional design and development, creating digital experiences that inspire, engage, and drive meaningful results. We believe in collaboration, innovation, and the pursuit of excellence in everything we create.',
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
    {
        'section': 'contact',
        'title': 'Let\'s Work Together',
        'content': 'Have a project in mind? We\'d love to hear from you. Get in touch and let\'s create something extraordinary.',
        'updatedAt': firestore.SERVER_TIMESTAMP,
    },
]

content_ref = db.collection('content')
for content in content_sections:
    content_ref.add(content)
    print(f"✅ Added content section: {content['section']}")

# Seed Contact Info
contact_info = {
    'email': 'hello@yourteam.com',
    'phone': '+1 (555) 123-4567',
    'address': '123 Creative Street, Design City, DC 12345',
    'socialLinks': {
        'linkedin': 'https://linkedin.com/company/yourteam',
        'twitter': 'https://twitter.com/yourteam',
        'instagram': 'https://instagram.com/yourteam',
        'github': 'https://github.com/yourteam',
    },
    'updatedAt': firestore.SERVER_TIMESTAMP,
}

contact_ref = db.collection('contactInfo')
contact_ref.add(contact_info)
print("✅ Added contact info")

print("\n🎉 Firebase seeding completed successfully!")
print("\n📝 Next steps:")
print("1. Add your Firebase config to environment variables")
print("2. The data is now ready to be displayed on your portfolio")
