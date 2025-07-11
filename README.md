# AI Course Platform - Serverless

A modern AI course platform built with React, TypeScript, and serverless functions.

## Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for server state management
- **Firebase Auth** for authentication

### Backend
- **Serverless Functions** (Vercel/Netlify compatible)
- **Neon Database** with HTTP-based connections
- **Drizzle ORM** for type-safe database operations
- **No persistent server processes**

### Data Storage
- **PostgreSQL** via Neon serverless
- **No session storage** - stateless authentication
- **Connection pooling** handled by Neon

## Deployment Options

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist/public
```

### Static Hosting + Serverless Functions
The platform works as a JAMstack application:
- Static frontend hosted on CDN
- API endpoints as serverless functions
- Database connections created per request

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
VITE_API_URL=https://your-api-domain.com
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/modules` - Published course modules
- `GET /api/lessons/[moduleId]` - Lessons for a module
- `GET /api/enrollments` - User enrollments

### Admin Endpoints
- `GET /api/admin/users` - All users
- `POST /api/admin/users` - Create user
- `GET /api/admin/modules` - All modules
- `POST /api/admin/modules` - Create module
- `PUT /api/admin/modules` - Update module
- `DELETE /api/admin/modules` - Delete module
- `GET /api/admin/lessons` - All lessons
- `POST /api/admin/lessons` - Create lesson
- `PUT /api/admin/lessons` - Update lesson
- `DELETE /api/admin/lessons` - Delete lesson

## Features

### Course Management
- YouTube video integration
- PDF document support
- Module and lesson organization
- Progress tracking
- Admin dashboard for content management

### User Experience
- Responsive design
- Dark theme with neon accents
- Real-time updates
- Offline-capable static frontend

### Security
- Stateless authentication
- CORS configuration
- Input validation
- SQL injection protection via Drizzle ORM

## Database Schema

### Users
- id, username, email, name, created_at

### Modules
- id, title, description, lessons_count, duration, order, is_published

### Lessons
- id, module_id, title, description, youtube_url, pdf_url, order, duration, is_published

### Enrollments
- id, user_id, enrolled, progress, completed_at

## Performance

- **Static frontend** - CDN distribution
- **Serverless functions** - Auto-scaling
- **Database pooling** - Neon connection management
- **Query optimization** - TanStack Query caching
- **Bundle optimization** - Vite tree-shaking

## Scalability

- **Horizontal scaling** - Serverless auto-scaling
- **Global distribution** - CDN + edge functions
- **Database scaling** - Neon serverless scaling
- **Cost optimization** - Pay-per-request model