import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { lessons, insertLessonSchema } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const allLessons = await db.select().from(lessons);
      res.json(allLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  } else if (req.method === 'POST') {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const newLesson = await db.insert(lessons).values(lessonData).returning();
      res.status(201).json(newLesson[0]);
    } catch (error) {
      console.error('Error creating lesson:', error);
      res.status(500).json({ message: "Failed to create lesson" });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id, ...lessonData } = req.body;
      
      const updated = await db
        .update(lessons)
        .set({ ...lessonData, updatedAt: new Date() })
        .where(eq(lessons.id, parseInt(id)))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json(updated[0]);
    } catch (error) {
      console.error('Error updating lesson:', error);
      res.status(500).json({ message: "Failed to update lesson" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const lessonId = parseInt(id as string);
      const deleted = await db.delete(lessons).where(eq(lessons.id, lessonId)).returning();

      if (deleted.length === 0) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      res.status(500).json({ message: "Failed to delete lesson" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}