import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { lessons } from '../../shared/schema';
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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const moduleId = parseInt(req.query.moduleId as string);
    const moduleLessons = await db.select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.order);
    
    // Only return published lessons
    const publishedLessons = moduleLessons.filter(lesson => lesson.isPublished);
    res.json(publishedLessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
}