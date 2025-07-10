import { users, enrollments, type User, type InsertUser, type Enrollment, type InsertEnrollment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserEnrollment(userId: number): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(userId: number, progress: number): Promise<void>;
  
  // Admin methods
  getAllUsers(): Promise<User[]>;
  getAllModules(): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: number, module: Partial<InsertModule>): Promise<Module>;
  deleteModule(id: number): Promise<void>;
  getAllLessons(): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: number): Promise<void>;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface InsertModule {
  title: string;
  description: string;
  lessons: number;
  duration: string;
  order: number;
  isPublished: boolean;
}

interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  videoThumbnail?: string;
  order: number;
  duration: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface InsertLesson {
  moduleId: number;
  title: string;
  description: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  videoThumbnail?: string;
  order: number;
  duration: string;
  isPublished: boolean;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserEnrollment(userId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.userId, userId));
    return enrollment || undefined;
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(enrollments)
      .values(insertEnrollment)
      .returning();
    return enrollment;
  }

  async updateEnrollmentProgress(userId: number, progress: number): Promise<void> {
    await db
      .update(enrollments)
      .set({ progress })
      .where(eq(enrollments.userId, userId));
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAllModules(): Promise<Module[]> {
    // For now, return dummy data since we don't have the modules table yet
    return [
      {
        id: 1,
        title: "Introduction to AI",
        description: "Fundamentals of artificial intelligence and machine learning",
        lessons: 8,
        duration: "2 hours",
        order: 1,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: "Machine Learning Basics",
        description: "Core concepts of supervised and unsupervised learning",
        lessons: 12,
        duration: "3 hours",
        order: 2,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: "Neural Networks",
        description: "Deep dive into neural network architectures",
        lessons: 10,
        duration: "2.5 hours",
        order: 3,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async createModule(module: InsertModule): Promise<Module> {
    // For now, return dummy data
    return {
      id: Date.now(),
      ...module,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateModule(id: number, module: Partial<InsertModule>): Promise<Module> {
    // For now, return dummy data
    return {
      id,
      title: module.title || "Updated Module",
      description: module.description || "Updated description",
      lessons: module.lessons || 0,
      duration: module.duration || "1 hour",
      order: module.order || 1,
      isPublished: module.isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async deleteModule(id: number): Promise<void> {
    // For now, just return
    return;
  }

  async getAllLessons(): Promise<Lesson[]> {
    // For now, return sample YouTube lesson data
    return [
      {
        id: 1,
        moduleId: 1,
        title: "What is AI?",
        description: "Introduction to artificial intelligence concepts",
        youtubeUrl: "https://www.youtube.com/watch?v=JMUxmLyrhSk",
        youtubeVideoId: "JMUxmLyrhSk",
        videoThumbnail: "https://img.youtube.com/vi/JMUxmLyrhSk/maxresdefault.jpg",
        order: 1,
        duration: "15 minutes",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        moduleId: 1,
        title: "History of AI",
        description: "Evolution of artificial intelligence over time",
        youtubeUrl: "https://www.youtube.com/watch?v=kWmX3pd1f10",
        youtubeVideoId: "kWmX3pd1f10",
        videoThumbnail: "https://img.youtube.com/vi/kWmX3pd1f10/maxresdefault.jpg",
        order: 2,
        duration: "20 minutes",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    // For now, return dummy data
    return {
      id: Date.now(),
      ...lesson,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<Lesson> {
    // For now, return dummy data
    return {
      id,
      moduleId: lesson.moduleId || 1,
      title: lesson.title || "Updated Lesson",
      description: lesson.description || "Updated description",
      youtubeUrl: lesson.youtubeUrl,
      youtubeVideoId: lesson.youtubeVideoId,
      videoThumbnail: lesson.videoThumbnail,
      order: lesson.order || 1,
      duration: lesson.duration || "10 minutes",
      isPublished: lesson.isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async deleteLesson(id: number): Promise<void> {
    // For now, just return
    return;
  }
}

export const storage = new DatabaseStorage();
