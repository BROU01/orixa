/**
 * Rate limiter simple en mémoire.
 * Pour la production, utiliser Redis (ioredis + rate-limiter-flexible).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Nettoyage périodique (toutes les 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (entry.resetAt < now) store.delete(key);
    });
  }, 5 * 60 * 1000);
}

interface RateLimitConfig {
  windowMs: number;   // Fenêtre en millisecondes
  max: number;        // Nombre max de requêtes par fenêtre
}

/**
 * Vérifie si une requête dépasse la limite.
 * Retourne { limited: true, retryAfter } si bloquée.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60_000, max: 10 }
): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // Nouvelle fenêtre
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { limited: false, retryAfter: 0 };
  }

  entry.count++;

  if (entry.count > config.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { limited: true, retryAfter };
  }

  return { limited: false, retryAfter: 0 };
}

/**
 * Génère une clé de rate limit à partir de la requête.
 * Utilise l'IP + un préfixe (ex: "login:", "signup:").
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || '127.0.0.1';
  return `${prefix}:${ip}`;
}
