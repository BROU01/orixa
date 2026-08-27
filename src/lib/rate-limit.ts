/**
 * Rate limiter défensif en mémoire.
 * Il protège une instance et doit être complété en production par un
 * rate limiter distribué (Redis/Upstash) ou un WAF au niveau du fournisseur.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const MAX_ENTRIES = 10_000;

// Nettoyage périodique (toutes les 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (entry.resetAt <= now) store.delete(key);
    });
  }, 5 * 60 * 1000);
}

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

/**
 * Vérifie si une requête dépasse la limite.
 * La taille du store est bornée pour éviter qu’un attaquant ne crée une
 * infinité de clés et provoque une saturation mémoire.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60_000, max: 10 }
): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    if (store.size >= MAX_ENTRIES) {
      const oldestKey = store.keys().next().value as string | undefined;
      if (oldestKey) store.delete(oldestKey);
    }
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { limited: false, retryAfter: 0 };
  }

  entry.count += 1;

  if (entry.count > config.max) {
    const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { limited: true, retryAfter };
  }

  return { limited: false, retryAfter: 0 };
}

/**
 * Génère une clé bornée. Les en-têtes d’identité sont fournis par le proxy
 * de déploiement ; ils ne doivent pas être considérés comme une preuve
 * d’identité en dehors de cette couche.
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip =
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('cf-connecting-ip')?.trim() ||
    forwarded?.split(',')[0]?.trim() ||
    'unknown';
  return `${prefix}:${ip.slice(0, 128)}`;
}
