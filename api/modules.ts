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
      const publishedModules = await db.select().from(schema.modules).where(eq(schema.modules.isPublished, true));
      res.status(200).json(publishedModules);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}