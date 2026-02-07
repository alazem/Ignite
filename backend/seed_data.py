import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "portfolio_backend.settings")
django.setup()

from api.models import ContentSection, ContactInfo, HomeStats, Service, Testimonial, Project

def seed():
    # Content Sections
    sections = [
        {
            "section": "hero",
            "title": "Welcome to My Portfolio",
            "subtitle": "I build amazing things",
            "content": "This is the default hero content. Please edit it in the admin panel.",
        },
        {
            "section": "mission",
            "title": "My Mission",
            "subtitle": "To deliver excellence",
            "content": "This is the default mission content. Please edit it in the admin panel.",
        },
        {
            "section": "about",
            "title": "About Me",
            "subtitle": "A brief introduction",
            "content": "This is the default about content. Please edit it in the admin panel.",
        },
        {
            "section": "contact",
            "title": "Let's Work Together",
            "subtitle": "Get in Touch",
            "content": "Have a project in mind? We'd love to hear from you.",
        }
    ]

    for data in sections:
        obj, created = ContentSection.objects.get_or_create(
            section=data["section"],
            defaults={
                "title": data["title"],
                "subtitle": data["subtitle"],
                "content": data["content"],
            }
        )
        if created:
            print(f"Created section: {data['section']}")
        else:
            print(f"Section already exists: {data['section']}")

    # Contact Info
    if not ContactInfo.objects.exists():
        ContactInfo.objects.create(
            email="ignitetechnologies3@gmail.com",
            phone="+251 942 830 589",
            address="Addis Ababa, Ethiopia",
            social_links={
                "github": "https://github.com",
                "linkedin": "https://linkedin.com",
                "twitter": "https://twitter.com",
                "instagram": "https://instagram.com"
            }
        )
        print("Created default contact info")
    else:
        print("Contact info already exists")

    # Testimonials
    if not Testimonial.objects.exists():
        Testimonial.objects.create(
            name="Ignite Technologies",
            role="CEO",
            company="Ignite Technologies",
            content="Working with this team transformed our digital presence. Their attention to detail and innovative approach exceeded our expectations.",
            rating=5,
            featured=True,
            order=0
        )
        Testimonial.objects.create(
            name="Michael Chen",
            role="Product Manager",
            company="Innovation Labs",
            content="The level of professionalism and expertise is unmatched. They delivered a product that our users absolutely love.",
            rating=5,
            featured=True,
            order=1
        )
        print("Created default testimonials")
    else:
        print("Testimonials already exist")

    # Services
    if not Service.objects.exists():
        Service.objects.create(
            title="Web Development",
            description="Building fast, responsive, and accessible websites using modern technologies like React, Next.js, and Tailwind CSS.",
            icon="code",
            order=0
        )
        Service.objects.create(
            title="UI/UX Design",
            description="Creating intuitive and beautiful user interfaces that prioritize user experience and drive engagement.",
            icon="palette",
            order=1
        )
        print("Created default services")
    else:
        print("Services already exist")

    # Home Stats
    if not HomeStats.objects.exists():
        HomeStats.objects.create(label="Years Experience", value="5+", order=0)
        HomeStats.objects.create(label="Projects Completed", value="50+", order=1)
        HomeStats.objects.create(label="Happy Clients", value="30+", order=2)
        print("Created default stats")
    else:
        print("Stats already exist")

    # Projects
    if not Project.objects.exists():
        Project.objects.create(
            title="E-Commerce Platform",
            description="A modern e-commerce solution with real-time inventory and seamless checkout.",
            tags=["Next.js", "Stripe", "PostgreSQL"],
            featured=True,
            order=0
        )
        Project.objects.create(
            title="Task Management App",
            description="Collaborative task manager for remote teams with real-time updates.",
            tags=["React", "Firebase", "Tailwind"],
            featured=True,
            order=1
        )
        print("Created default projects")
    else:
        print("Projects already exist")
    
    # Defaults
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
