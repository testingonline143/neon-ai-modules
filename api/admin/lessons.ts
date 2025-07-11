import { neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from "../../shared/schema";

neonConfig.fetchConnectionCache = true;

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const db = drizzle(process.env.DATABASE_URL!, { schema });

  if (req.method === 'GET') {
    try {
      const allLessons = await db.select().from(schema.lessons);
      res.status(200).json(allLessons);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  } else if (req.method === 'POST') {
    try {
      const lessonData = req.body;
      const newLesson = await db.insert(schema.lessons).values(lessonData).returning();
      res.status(201).json(newLesson[0]);
    } catch (error) {
      console.error('Failed to create lesson:', error);
      res.status(500).json({ message: "Failed to create lesson" });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...lessonData } = req.body;
      const updated = await db
        .update(schema.lessons)
        .set({ ...lessonData, updatedAt: new Date() })
        .where(eq(schema.lessons.id, id))
        .returning();
      res.status(200).json(updated[0]);
    } catch (error) {
      console.error('Failed to update lesson:', error);
      res.status(500).json({ message: "Failed to update lesson" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await db.delete(schema.lessons).where(eq(schema.lessons.id, parseInt(id)));
      res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      res.status(500).json({ message: "Failed to delete lesson" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}