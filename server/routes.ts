import type { Express } from "express";
import express from "express";
import { db } from "./db";
import { users, enrollments, modules, lessons, insertModuleSchema, insertLessonSchema } from "../shared/schema";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

export function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get user profile
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await db.select().from(users).where(eq(users.id, parseInt(userId)));

      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user[0]);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user enrollments and progress
  app.get("/api/user/:id/enrollments", async (req, res) => {
    try {
      const userId = req.params.id;
      const userEnrollments = await db.select().from(enrollments).where(eq(enrollments.userId, parseInt(userId)));

      res.json(userEnrollments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create or update user
  app.post("/api/users", async (req, res) => {
    try {
      const { username, email, name } = req.body;

      const newUser = await db.insert(users).values({
        username,
        email,
        name,
        password: '', // Firebase handles auth, so password can be empty
      }).returning();

      res.status(201).json(newUser[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update enrollment progress
  app.patch("/api/enrollments/:id", async (req, res) => {
    try {
      const enrollmentId = req.params.id;
      const { progress } = req.body;

      const updated = await db
        .update(enrollments)
        .set({ 
          progress,
          completedAt: progress === 100 ? new Date() : null,
          updatedAt: new Date()
        })
        .where(eq(enrollments.id, parseInt(enrollmentId)))
        .returning();

      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Get enrollments for dashboard
  app.get("/api/enrollments", async (req, res) => {
    try {
      const allEnrollments = await db.select().from(enrollments);
      res.json(allEnrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = './uploads';
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error, uploadDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    }
  });

  // === ADMIN ENDPOINTS ===

  // Get all users (admin)
  app.get("/api/admin/users", async (req, res) => {
    try {
      const allUsers = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        username: users.username,
        createdAt: users.createdAt
      }).from(users);
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get all modules (admin)
  app.get("/api/admin/modules", async (req, res) => {
    try {
      const allModules = await db.select().from(modules);
      res.json(allModules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  // Create module (admin)
  app.post("/api/admin/modules", async (req, res) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const newModule = await db.insert(modules).values(moduleData).returning();
      res.status(201).json(newModule[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to create module" });
    }
  });

  // Update module (admin)
  app.patch("/api/admin/modules/:id", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const moduleData = req.body;
      
      const updated = await db
        .update(modules)
        .set({ ...moduleData, updatedAt: new Date() })
        .where(eq(modules.id, moduleId))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ message: "Module not found" });
      }

      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to update module" });
    }
  });

  // Delete module (admin)
  app.delete("/api/admin/modules/:id", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      
      // First delete associated lessons
      await db.delete(lessons).where(eq(lessons.moduleId, moduleId));
      
      // Then delete the module
      const deleted = await db.delete(modules).where(eq(modules.id, moduleId)).returning();

      if (deleted.length === 0) {
        return res.status(404).json({ message: "Module not found" });
      }

      res.json({ message: "Module deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete module" });
    }
  });

  // Get all lessons (admin)
  app.get("/api/admin/lessons", async (req, res) => {
    try {
      const allLessons = await db.select().from(lessons);
      res.json(allLessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  // Create lesson (admin)
  app.post("/api/admin/lessons", async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const newLesson = await db.insert(lessons).values(lessonData).returning();
      res.status(201).json(newLesson[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  // Update lesson (admin)
  app.patch("/api/admin/lessons/:id", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lessonData = req.body;
      
      const updated = await db
        .update(lessons)
        .set({ ...lessonData, updatedAt: new Date() })
        .where(eq(lessons.id, lessonId))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lesson" });
    }
  });

  // Delete lesson (admin)
  app.delete("/api/admin/lessons/:id", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const deleted = await db.delete(lessons).where(eq(lessons.id, lessonId)).returning();

      if (deleted.length === 0) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete lesson" });
    }
  });

  // PDF upload endpoint (admin)
  app.post("/api/admin/upload-pdf", upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      const pdfUrl = `/uploads/${req.file.filename}`;
      const pdfFileName = req.file.originalname;

      res.json({
        message: "PDF uploaded successfully",
        pdfUrl,
        pdfFileName,
        fileSize: req.file.size
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload PDF" });
    }
  });

  // Validate YouTube URL endpoint (admin)
  app.post("/api/admin/validate-youtube", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "YouTube URL is required" });
      }

      // Import the YouTube utility functions
      const { validateAndFormatYouTubeUrl } = await import('../shared/youtube.js');
      const result = validateAndFormatYouTubeUrl(url);
      
      if (!result.isValid) {
        return res.status(400).json({ message: result.error });
      }

      res.json({
        message: "Valid YouTube URL",
        videoId: result.videoId,
        thumbnailUrl: result.thumbnailUrl,
        embedUrl: result.embedUrl,
        originalUrl: result.originalUrl
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate YouTube URL" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Return the Express app instead of creating a server
  return app;
}