#!/usr/bin/env bash
set -euo pipefail

base="${BASE_URL:-http://localhost:3005}"
admin_email='security-test@example.invalid'
admin_password='A-strong-local-test-password-2026!'
secret='0123456789abcdef0123456789abcdef0123456789abcdef'

printf '%s\n' '--- route admin sans session ---'
status=$(curl -sS -o /dev/null -D /tmp/orixa-admin-headers -w '%{http_code}' "$base/admin")
test "$status" = '307'
grep -qi '^location: .*admin/login' /tmp/orixa-admin-headers

echo '--- rate limit admin local ---'
rm -f /tmp/orixa-rate-headers
for attempt in 1 2 3 4 5; do
  status=$(curl -sS -o /dev/null -w '%{http_code}' -H 'x-forwarded-for: 203.0.113.10' -H 'content-type: application/json' -d '{"email":"wrong@example.invalid","password":"wrong-password"}' "$base/api/auth/admin")
  test "$status" = '401'
done
status=$(curl -sS -o /dev/null -D /tmp/orixa-rate-headers -w '%{http_code}' -H 'x-forwarded-for: 203.0.113.10' -H 'content-type: application/json' -d '{"email":"wrong@example.invalid","password":"wrong-password"}' "$base/api/auth/admin")
test "$status" = '429'
grep -qi '^retry-after:' /tmp/orixa-rate-headers

echo '--- login admin et session HMAC ---'
curl -sS -D /tmp/orixa-login-headers -o /tmp/orixa-login-body -H 'content-type: application/json' -d "{\"email\":\"$admin_email\",\"password\":\"$admin_password\"}" "$base/api/auth/admin" >/dev/null
grep -qi 'set-cookie: orixa:admin-session=' /tmp/orixa-login-headers
grep -qi 'httponly' /tmp/orixa-login-headers
grep -qi 'samesite=lax' /tmp/orixa-login-headers
cookie=$(awk 'BEGIN{IGNORECASE=1} /^set-cookie: orixa:admin-session=/{sub(/^set-cookie: /, ""); sub(/;.*$/, ""); print; exit}' /tmp/orixa-login-headers)
test -n "$cookie"
status=$(curl -sS -o /tmp/orixa-admin-authorized -w '%{http_code}' -H "Cookie: $cookie" "$base/admin")
test "$status" = '200'

echo '--- cookie falsifié ---'
tampered_cookie=$(printf '%s' "$cookie" | sed 's/.$/x/')
status=$(curl -sS -o /dev/null -w '%{http_code}' -H "Cookie: $tampered_cookie" "$base/admin")
test "$status" = '307'

echo 'security-smoke=ok'
