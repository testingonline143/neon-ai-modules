# AI Course Platform - Serverless Deployment

## Overview
This AI Course Platform has been migrated to a serverless architecture compatible with Vercel and other serverless platforms. The application features:

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Serverless functions in `/api` directory
- **Database**: PostgreSQL with Neon serverless driver
- **Authentication**: Firebase Auth
- **Deployment**: Vercel-ready with `vercel.json` configuration

## Deployment Instructions

### Vercel Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Set Environment Variables**:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - Add any Firebase configuration variables if needed

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables in Vercel Dashboard**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add your `DATABASE_URL` and any other required variables

### Alternative Deployment: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Create `netlify.toml`**:
   ```toml
   [build]
   command = "npm run build"
   publish = "client/dist"

   [functions]
   directory = "api"

   [[redirects]]
   from = "/api/*"
   to = "/.netlify/functions/:splat"
   status = 200

   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## API Endpoints

### Student Endpoints
- `GET /api/health` - Health check
- `GET /api/modules` - Get published modules
- `GET /api/lessons/[moduleId]` - Get lessons for a module
- `GET /api/enrollments` - Get user enrollments

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/modules` - Get all modules (admin)
- `POST /api/admin/modules` - Create new module
- `PATCH /api/admin/modules` - Update module
- `DELETE /api/admin/modules` - Delete module
- `GET /api/admin/lessons` - Get all lessons
- `POST /api/admin/lessons` - Create new lesson
- `PATCH /api/admin/lessons` - Update lesson
- `DELETE /api/admin/lessons` - Delete lesson

## Database Schema

The application uses PostgreSQL with the following tables:
- `users` - User information
- `enrollments` - User course enrollment and progress
- `modules` - Course modules
- `lessons` - Individual lessons with YouTube videos and PDFs

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (Neon format)
- Firebase configuration variables (if using Firebase Auth)

## Testing

Use the included `index.html` file to test the serverless API endpoints locally or after deployment.

## Migration Notes

This project has been migrated from a traditional Express.js server to serverless functions:
- Each API endpoint is now a separate serverless function
- Database connections use Neon's HTTP-based driver for serverless compatibility
- No persistent server state or session storage
- CORS headers are included for cross-origin requests

The frontend React application can be deployed as static files and will communicate with the serverless API endpoints.