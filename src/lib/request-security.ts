export const MAX_JSON_BODY_BYTES = 16 * 1024;

export function isBodyTooLarge(request: Request): boolean {
  const rawLength = request.headers.get('content-length');
  if (!rawLength) return false;
  const length = Number(rawLength);
  return Number.isFinite(length) && length > MAX_JSON_BODY_BYTES;
}

export function isJsonRequest(request: Request): boolean {
  const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  return contentType === 'application/json';
}
