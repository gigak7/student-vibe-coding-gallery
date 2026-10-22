import { Redis } from '@upstash/redis';

// 建立 Redis 連線：自動尋找 Upstash / Vercel KV 的環境變數，
// 支援標準命名（UPSTASH_REDIS_* / KV_*）以及 Vercel 連接時自訂的任何前綴
//（自訂前綴時用「值」來辨認：upstash 的 REST URL 形如 https://xxx.upstash.io）
//（2026-10-22 Upstash 已連接，觸發含新環境變數的重新部署）
function connectRedis() {
  const env = process.env;
  let url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  let token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  if (!url) {
    const urlKey = Object.keys(env).find((k) =>
      /^https:\/\/[a-z0-9-]+\.upstash\.io\/?$/i.test(env[k] || '')
    );
    if (urlKey) {
      url = env[urlKey];
      const prefix = urlKey.replace(/_REST_URL$|_URL$/, '');
      token =
        env[prefix + '_REST_TOKEN'] ||
        env[prefix + '_TOKEN'] ||
        env[prefix + '_READ_ONLY_TOKEN'];
    }
  }
  if (!url || !token) {
    throw new Error('Redis env vars missing: connect an Upstash database to the project first');
  }
  return new Redis({ url, token });
}

export const kv = connectRedis();
