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
      const allModules = await db.select().from(schema.modules);
      res.status(200).json(allModules);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  } else if (req.method === 'POST') {
    try {
      const moduleData = req.body;
      const newModule = await db.insert(schema.modules).values(moduleData).returning();
      res.status(201).json(newModule[0]);
    } catch (error) {
      console.error('Failed to create module:', error);
      res.status(500).json({ message: "Failed to create module" });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...moduleData } = req.body;
      const updated = await db
        .update(schema.modules)
        .set({ ...moduleData, updatedAt: new Date() })
        .where(eq(schema.modules.id, id))
        .returning();
      res.status(200).json(updated[0]);
    } catch (error) {
      console.error('Failed to update module:', error);
      res.status(500).json({ message: "Failed to update module" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await db.delete(schema.modules).where(eq(schema.modules.id, parseInt(id)));
      res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
      console.error('Failed to delete module:', error);
      res.status(500).json({ message: "Failed to delete module" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}