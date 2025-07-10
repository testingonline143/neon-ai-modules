import type { Express } from "express";
import { db } from "./db";
import { users, enrollments } from "../shared/schema";
import { eq } from "drizzle-orm";

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

  const httpServer = app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on http://0.0.0.0:5000");
  });

  return httpServer;
}