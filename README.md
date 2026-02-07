# Professional Team Portfolio

A modern, minimalist team portfolio website built with Next.js and Django, featuring a full-featured admin CMS for content management.

## Features

### Public Portfolio Website
- **Home Page**: Hero section, dynamic stats, featured projects, and testimonials
- **Projects Page**: Showcases all portfolio projects with filtering
- **Services Page**: Highlights team services and offerings
- **About Page**: Team information and values
- **Contact Page**: Contact information and social links
- **Fully Responsive**: Optimized for desktop, tablet, and mobile
- **Real-time Updates**: Content changes reflect instantly from Firebase

### Admin CMS Dashboard
- **Protected Route**: Secure `/admin` access with Django Authentication
- **Projects Management**: Add, edit, delete projects with images and tags
- **Testimonials Management**: Manage client testimonials and ratings
- **Services Management**: Update service offerings
- **Content Editor**: Edit hero, about, mission, and contact content
- **Stats Manager**: Update homepage statistics
- **Real-time Sync**: Changes instantly update the public site

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Backend**: Django (Django Rest Framework)
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full type safety
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Django Configuration

1. Create a Django project at [django-admin](https://django-admin)
2. Enable Django Rest Framework
3. Enable Firebase Authentication (Email/Password)
4. Get your Firebase config from Project Settings

### 2. Environment Variables

Add these to your Vercel project or `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Seed Database

Run the Python script to populate Django with initial data:

```bash
# Install Django Rest Framework
pip install djangorestframework

# Download your Firebase service account key from:
# Firebase Console > Project Settings > Service Accounts > Generate New Private Key

# Set environment variable
export FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json

# Run the seeding script
python scripts/seed-firebase.py
```

### 4. Create Admin User

In Django Console:
1. Go to Authentication > Users
2. Add a user with email/password
3. Use these credentials to log in at `/admin/login`

### 5. Deploy to Vercel

```bash
# Install dependencies
npm install

# Deploy
vercel
```

Or connect your Git repository to Vercel for automatic deployments.

## Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard pages
│   ├── about/           # About page
│   ├── contact/         # Contact page
│   ├── projects/        # Projects page
│   ├── services/        # Services page
│   └── page.tsx         # Home page
├── components/
│   ├── admin/           # Admin CMS components
│   ├── ui/              # Reusable UI components
│   ├── navigation.tsx   # Main navigation
│   └── footer.tsx       # Site footer
├── lib/
│   ├── firebase.ts      # Firebase client initialization
│   ├── firebase-admin.ts # Server-side data fetching
│   ├── firebase-client.ts # Client-side CRUD operations
│   └── types.ts         # TypeScript interfaces
├── scripts/
│   └── seed-firebase.py # Database seeding script
└── middleware.ts        # Route protection
```

## Usage

### Public Site
- Visit `/` for the home page
- Browse `/projects`, `/services`, `/about`, and `/contact`
- All content is dynamically loaded from Firestore

### Admin Dashboard
1. Navigate to `/admin/login`
2. Sign in with your Firebase credentials
3. Manage all content through the dashboard tabs
4. Changes reflect immediately on the public site

## Customization

### Styling
- Edit `app/globals.css` for theme colors
- Modify component styles in individual files
- Uses Tailwind CSS utility classes

### Content
- All content is managed through the admin dashboard
- No code changes needed for content updates

### Features
- Extend TypeScript interfaces in `lib/types.ts`
- Create new admin tabs in `components/admin/`


```json file="" isHidden
