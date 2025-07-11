import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { enrollments } from '../shared/schema';
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
      const allEnrollments = await db.select().from(enrollments);
      res.json(allEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id, progress } = req.body;
      
      const updated = await db
        .update(enrollments)
        .set({ 
          progress,
          completedAt: progress === 100 ? new Date() : null,
          updatedAt: new Date()
        })
        .where(eq(enrollments.id, parseInt(id)))
        .returning();

      res.json(updated[0]);
    } catch (error) {
      console.error('Error updating enrollment:', error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}