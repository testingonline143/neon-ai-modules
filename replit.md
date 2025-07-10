# AI Course Platform

## Overview

This is a full-stack web application built as an AI course platform with a modern tech stack. The application features a React frontend with shadcn/ui components, an Express.js backend, and uses both PostgreSQL (via Drizzle ORM) and Firebase for different aspects of data management. The platform is designed with a sleek dark theme featuring neon teal accents for an AI-focused aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring dark theme and neon teal accents
- **State Management**: TanStack Query for server state, React Context for authentication
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with `/api` prefix
- **Development**: Hot reload with tsx for development server

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for schema management and type-safe database operations
- **Authentication**: Firebase Auth for user authentication and session management
- **Database Tables**: 
  - `users` table with id, username, password, email, name, and timestamps
  - `enrollments` table to track user course enrollment and progress
  - `modules` table to store course modules with lessons count and metadata
  - `lessons` table to store individual lesson content with video/PDF URLs
- **API Endpoints**: RESTful APIs for user management, enrollment tracking, and admin content management

### Authentication and Authorization
- **Provider**: Firebase Authentication
- **Features**: Email/password authentication with signup and login flows
- **Integration**: React Context provider for auth state management across components
- **UI**: Modal-based authentication with forms for login and registration

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Located in `shared/schema.ts` with users, enrollments, modules, and lessons entities
- **Migrations**: Auto-generated via `npm run db:push` command
- **Connection**: Uses Neon Database serverless driver

### UI System
- **Design System**: Custom dark theme with neon teal primary color (#00FFD1)
- **Component Library**: Complete shadcn/ui component set including forms, dialogs, toasts, etc.
- **Typography**: Inter font family for modern, clean appearance
- **Responsive**: Mobile-first design with responsive breakpoints

### Course Management
- **Course Modules**: Structured learning content with video lessons stored in database
- **Progress Tracking**: Built-in progress indicators and completion states
- **User Experience**: Card-based layout with modern glassmorphism effects
- **Admin Dashboard**: Full content management system for modules, lessons, and user tracking
- **File Upload**: Support for video and PDF file uploads with multer integration

## Data Flow

1. **Authentication Flow**: Users authenticate via Firebase Auth → Context updates → UI reflects auth state
2. **API Communication**: Frontend makes requests to Express backend via `/api` endpoints
3. **Database Operations**: Backend uses Drizzle ORM to interact with PostgreSQL database
4. **State Management**: TanStack Query handles server state caching and synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation resolvers

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Modern icon library

### Firebase Integration
- **firebase**: Authentication and potentially other services
- **@firebase/auth**: Authentication SDK

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code for production deployment
- **Environment**: Supports both development and production configurations

### Development Workflow
- **Local Development**: Vite dev server with HMR and error overlay
- **Database**: Drizzle Kit for schema management and migrations
- **Type Safety**: Full TypeScript coverage across frontend and backend

### Production Considerations
- **Static Assets**: Served by Express in production mode
- **Database**: Requires PostgreSQL connection via DATABASE_URL environment variable
- **Session Management**: Uses connect-pg-simple for PostgreSQL session storage
- **Error Handling**: Centralized error handling middleware in Express

The application is designed as a monorepo with shared TypeScript definitions, making it easy to maintain type safety across the full stack while providing a modern, performant learning platform for AI-related content.

## Recent Changes (July 2025)

### YouTube Video Platform Implementation
- Transformed from file-based to YouTube-based course delivery platform
- Updated database schema to use youtube_url, youtube_video_id, and video_thumbnail columns
- Implemented comprehensive YouTube URL validation system with video ID extraction
- Created YouTube video management interface in admin dashboard
- Added real-time YouTube URL validation tool for admins
- Replaced file upload functionality with YouTube video integration
- Enhanced admin dashboard with YouTube video preview and management features

### Admin System Implementation
- Added complete admin dashboard with content management capabilities
- Implemented modules and lessons database tables with full CRUD operations
- Created admin API endpoints for user management and content creation
- Removed admin access button from student dashboard for security
- Added proper admin routing with authentication checks