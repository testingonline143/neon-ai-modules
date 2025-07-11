import { neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and } from 'drizzle-orm';
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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { moduleId } = req.query;

  try {
    const db = drizzle(process.env.DATABASE_URL!, { schema });
    
    const moduleLessons = await db.select()
      .from(schema.lessons)
      .where(and(
        eq(schema.lessons.moduleId, parseInt(moduleId)),
        eq(schema.lessons.isPublished, true)
      ))
      .orderBy(schema.lessons.order);

    res.status(200).json(moduleLessons);
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
}