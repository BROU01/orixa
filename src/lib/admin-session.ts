const encoder = new TextEncoder();

export interface AdminSession {
  email: string;
  role: 'admin';
  exp: number;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(base64);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || '';
}

export async function createAdminSessionToken(email: string, ttlMs = 8 * 60 * 60 * 1000): Promise<string> {
  const secret = getSessionSecret();
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters.');
  }

  const payload = toBase64Url(encoder.encode(JSON.stringify({
    email,
    role: 'admin',
    exp: Math.floor((Date.now() + ttlMs) / 1000),
  })));
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<AdminSession | null> {
  const secret = getSessionSecret();
  if (!secret || secret.length < 32 || !token) return null;

  const separator = token.lastIndexOf('.');
  if (separator <= 0 || separator === token.length - 1) return null;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expectedSignature = await sign(payload, secret);
  if (!constantTimeEqual(signature, expectedSignature)) return null;

  try {
    const decoded = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as Partial<AdminSession>;
    if (
      typeof decoded.email !== 'string' ||
      decoded.role !== 'admin' ||
      typeof decoded.exp !== 'number' ||
      !Number.isFinite(decoded.exp) ||
      decoded.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return { email: decoded.email, role: 'admin', exp: decoded.exp };
  } catch {
    return null;
  }
}
