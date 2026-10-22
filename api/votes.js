import { kv } from './_redis.js';

// GET /api/votes  →  { "<遊戲ID>": 票數, ... }
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method not allowed' });
  }
  const votes = (await kv.hgetall('votes')) || {};
  // 只回傳數字型票數
  const clean = {};
  for (const [k, v] of Object.entries(votes)) {
    const n = parseInt(v, 10);
    if (!isNaN(n)) clean[k] = n;
  }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(clean);
}
