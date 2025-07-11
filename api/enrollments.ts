import { neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from "../shared/schema";

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
      const allEnrollments = await db.select().from(schema.enrollments);
      res.status(200).json(allEnrollments);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const { progress } = req.body;

      const updated = await db
        .update(schema.enrollments)
        .set({ 
          progress,
          completedAt: progress === 100 ? new Date() : null,
          updatedAt: new Date()
        })
        .where(eq(schema.enrollments.id, parseInt(id)))
        .returning();

      res.status(200).json(updated[0]);
    } catch (error) {
      console.error('Failed to update enrollment:', error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}