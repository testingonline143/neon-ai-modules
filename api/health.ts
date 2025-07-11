export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.json({ status: "ok", timestamp: new Date().toISOString() });
}