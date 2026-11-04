// Anonymous, persistent counters using Vercel Marketplace Upstash Redis REST.
// Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel.
const slugs = [
  'how-to-create-minor-seventh-chord-stabs-with-zpunk',
  'when-a-musical-idea-doesnt-need-a-studio',
  'how-to-write-a-dark-driving-techno-bassline',
  'why-zpunk-is-built-in-portrait-for-music-on-the-go',
  'how-to-sample-chops-effectively-for-electronic-music'
];
const known = new Set(slugs);
const prefix = 'zpunk:analytics:v1:';
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
async function redis(command) {
  const response = await fetch(redisUrl.replace(/\/$/, ''), {
    method: 'POST', headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command), signal: AbortSignal.timeout(4500)
  });
  if (!response.ok) throw new Error('Redis request failed');
  const json = await response.json();
  if (json.error) throw new Error('Redis command failed');
  return json.result;
}
const script = `
local was_new = redis.call('SET', KEYS[1], '1', 'NX')
if was_new then redis.call('INCR', KEYS[2]) end
return redis.call('GET', KEYS[2]) or '0'
`;
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!redisUrl || !redisToken) return res.status(503).json({ error: 'Counters are not configured' });
  try {
    if (req.method === 'GET') {
      const keys = [prefix + 'visitors:count', ...slugs.map(s => prefix + 'reads:' + s + ':count')];
      const counts = await redis(['MGET', ...keys]);
      return res.status(200).json({ visitors: Number(counts[0] || 0), articles: Object.fromEntries(slugs.map((s,i) => [s, Number(counts[i+1] || 0)])) });
    }
    const origin = req.headers.origin;
    const host = req.headers.host;
    if (origin && new URL(origin).host !== host) return res.status(403).json({ error: 'Invalid origin' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { kind, visitorId, slug } = body || {};
    if (typeof visitorId !== 'string' || !/^[a-f0-9-]{36}$/i.test(visitorId) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId)) return res.status(400).json({ error: 'Invalid visitor identifier' });
    if (kind !== 'visit' && kind !== 'read') return res.status(400).json({ error: 'Invalid event' });
    if (kind === 'read' && !known.has(slug)) return res.status(400).json({ error: 'Unknown article' });
    const scope = kind === 'visit' ? 'visitors' : 'reads:' + slug;
    const result = await redis(['EVAL', script, '2', prefix + scope + ':seen:' + visitorId, prefix + scope + ':count']);
    return res.status(200).json({ count: Number(result || 0) });
  } catch (err) {
    console.error('Counter API error:', err.message);
    return res.status(503).json({ error: 'Counter service temporarily unavailable' });
  }
}
