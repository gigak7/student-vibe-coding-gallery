import { kv } from './_redis.js';

// POST /api/vote  { id: "遊戲ID" }  →  { id, votes }
// 同一 IP 每 60 秒最多投 10 票（學校 WiFi 共用 IP，過嚴會擋住正常投票）
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }
  const { id } = req.body || {};
  if (!id || typeof id !== 'string' || id.length > 200) {
    return res.status(400).json({ error: 'bad id' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const rlKey = `rl:${ip}`;
  const allowed = await kv.set(rlKey, '1', { ex: 60, nx: true });
  // 用計數器放寬為每分鐘 10 票
  const n = allowed ? 1 : await kv.incr(rlKey);
  if (!allowed && n > 10) {
    const ttl = await kv.ttl(rlKey);
    return res.status(429).json({ error: 'too fast', retryAfter: ttl > 0 ? ttl : 60 });
  }
  const votes = await kv.hincrby('votes', id, 1);
  return res.status(200).json({ id, votes });
}
