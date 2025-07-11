import { neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
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
      const allUsers = await db.select().from(schema.users);
      res.status(200).json(allUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  } else if (req.method === 'POST') {
    try {
      const { username, email, name } = req.body;
      const newUser = await db.insert(schema.users).values({
        username,
        email,
        name,
        password: '', // Firebase handles auth
      }).returning();
      res.status(201).json(newUser[0]);
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(500).json({ message: "Failed to create user" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}