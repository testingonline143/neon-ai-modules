import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { modules, lessons, insertModuleSchema } from '../../shared/schema';
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
      const allModules = await db.select().from(modules);
      res.json(allModules);
    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  } else if (req.method === 'POST') {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const newModule = await db.insert(modules).values(moduleData).returning();
      res.status(201).json(newModule[0]);
    } catch (error) {
      console.error('Error creating module:', error);
      res.status(500).json({ message: "Failed to create module" });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id, ...moduleData } = req.body;
      
      const updated = await db
        .update(modules)
        .set({ ...moduleData, updatedAt: new Date() })
        .where(eq(modules.id, parseInt(id)))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ message: "Module not found" });
      }

      res.json(updated[0]);
    } catch (error) {
      console.error('Error updating module:', error);
      res.status(500).json({ message: "Failed to update module" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const moduleId = parseInt(id as string);
      
      // First delete associated lessons
      await db.delete(lessons).where(eq(lessons.moduleId, moduleId));
      
      // Then delete the module
      const deleted = await db.delete(modules).where(eq(modules.id, moduleId)).returning();

      if (deleted.length === 0) {
        return res.status(404).json({ message: "Module not found" });
      }

      res.json({ message: "Module deleted successfully" });
    } catch (error) {
      console.error('Error deleting module:', error);
      res.status(500).json({ message: "Failed to delete module" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}