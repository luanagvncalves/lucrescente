import { NextResponse, type NextRequest } from "next/server";

/**
 * Password wall for /admin.
 *
 * Those pages read orders through the Supabase service role, which bypasses
 * every row-level policy — customer names, addresses and emails. So the guard
 * lives in middleware rather than in the page: middleware runs before the route
 * exists, which means a page added under /admin later is covered the moment it
 * is created, instead of relying on whoever adds it to remember.
 *
 * Browser basic auth, deliberately. It needs no login page, no session table
 * and no cookie, and the browser offers to remember it — which is the whole
 * interface for one person checking what to pack.
 *
 * ADMIN_PASSWORD must be set in the hosting provider. With no password set the
 * pages refuse to load at all: an admin area that silently opens to everyone
 * because an environment variable is missing is worse than one that is down.
 */
export const config = { matcher: ["/admin/:path*"] };

const CHALLENGE = { "WWW-Authenticate": 'Basic realm="lucrescente", charset="UTF-8"' };

/**
 * Compares in time that does not depend on how much of the password matched.
 * Node's timingSafeEqual is not available on the edge runtime, so this is the
 * same idea by hand: always walk the full length, never return early.
 */
function sameSecret(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return new NextResponse("a área de encomendas ainda não tem palavra-passe definida.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      // Only the password is checked; the username can be anything, so there is
      // one thing to remember rather than two.
      const password = decoded.slice(decoded.indexOf(":") + 1);
      if (sameSecret(password, expected)) return NextResponse.next();
    } catch {
      // A malformed header is just a failed attempt, not an error worth raising.
    }
  }

  return new NextResponse("palavra-passe necessária.", {
    status: 401,
    headers: { ...CHALLENGE, "Content-Type": "text/plain; charset=utf-8" },
  });
}
