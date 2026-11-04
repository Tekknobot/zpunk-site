/* Anonymous browser-based unique visitor and per-article reader counters.
   Each browser is counted once per site, and once per article. */
(() => {
  const API = '/api/counters';
  const slug = location.pathname.match(/\/blog\/([^/]+)\.html$/)?.[1];
  const display = (data) => {
    document.querySelectorAll('[data-visitor-count]').forEach(el => {
      if (Number.isFinite(data.visitors)) el.textContent = data.visitors.toLocaleString();
    });
    document.querySelectorAll('[data-article-count]').forEach(el => {
      const count = data.articles?.[el.dataset.articleCount];
      if (Number.isFinite(count)) el.textContent = count.toLocaleString();
    });
  };
  const request = async (method, body) => {
    const response = await fetch(API, { method, cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
    if (!response.ok) throw new Error('Counter unavailable');
    return response.json();
  };
  (async () => {
    try {
      let visitorId = localStorage.getItem('zpunk-anonymous-visitor-v1');
      if (!visitorId && crypto?.randomUUID) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('zpunk-anonymous-visitor-v1', visitorId);
      }
      if (visitorId) {
        await request('POST', { kind: 'visit', visitorId });
        if (slug) await request('POST', { kind: 'read', visitorId, slug });
      }
      display(await request('GET'));
    } catch (_) {
      // Counters remain as a dash when offline, blocked, or unconfigured.
    }
  })();
})();
