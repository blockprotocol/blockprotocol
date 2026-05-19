/**
 * Customer.io Pipelines (CDP) client.
 *
 * Modelled on the equivalent helper in `internal-sites/apps/hashdotai`. We
 * use the CDP REST API (`identify` / `track`) rather than the App API so we
 * can set persistent traits AND fire events from a single workspace without
 * juggling two sets of credentials.
 *
 * The client is intentionally configuration-tolerant: when
 * `CUSTOMERIO_API_KEY` is unset (local dev, preview deployments without
 * secrets) `isConfigured()` returns `false` and callers should treat the
 * signup as a no-op success. See the three API route handlers
 * (`/api/signup-notify`, `/api/subscribe-email`, `/api/vote-application`)
 * for that pattern.
 */
const CUSTOMERIO_API_KEY = process.env.CUSTOMERIO_API_KEY ?? "";
const CUSTOMERIO_ENDPOINT =
  process.env.CUSTOMERIO_REGION === "eu"
    ? "https://cdp-eu.customer.io/v1"
    : "https://cdp.customer.io/v1";

const REQUEST_TIMEOUT_MS = 10_000;

const authHeader = (): Record<string, string> => ({
  // Customer.io expects HTTP Basic auth with the API key as the username
  // and an empty password.
  Authorization: `Basic ${Buffer.from(`${CUSTOMERIO_API_KEY}:`).toString("base64")}`,
  "Content-Type": "application/json",
});

const buildContext = (ip?: string | null) => (ip ? { ip } : {});

const send = async (path: string, body: object): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${CUSTOMERIO_ENDPOINT}${path}`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `Customer.io ${path} responded ${response.status}${text ? `: ${text}` : ""}`,
      );
    }
  } finally {
    clearTimeout(timeout);
  }
};

export const isConfigured = (): boolean => CUSTOMERIO_API_KEY.length > 0;

export const identifyPerson = async (params: {
  userId: string;
  traits?: Record<string, unknown>;
  ip?: string | null;
}): Promise<void> => {
  await send("/identify", {
    userId: params.userId,
    traits: {
      ...params.traits,
      ...(params.ip ? { last_ip: params.ip } : {}),
    },
    context: buildContext(params.ip),
  });
};

export const trackEvent = async (params: {
  userId: string;
  event: string;
  properties?: Record<string, unknown>;
  ip?: string | null;
}): Promise<void> => {
  await send("/track", {
    userId: params.userId,
    event: params.event,
    properties: {
      ...params.properties,
      ...(params.ip ? { ip: params.ip } : {}),
    },
    context: buildContext(params.ip),
  });
};

/**
 * Best-effort extraction of the originating client IP from an API request.
 * Mirrors the behaviour of `extractRemoteIp` in `hashdotai`: prefer the
 * first hop in `x-forwarded-for` (Vercel sets this in front of our routes),
 * then fall back to other common proxy headers, and finally the socket
 * remote address. Returns `null` when nothing is usable.
 */
export const extractRemoteIp = (
  headers: Record<string, string | string[] | undefined>,
  socketRemoteAddress?: string | null,
): string | null => {
  const headerValue = (name: string) => {
    const raw = headers[name];
    if (Array.isArray(raw)) {
      return raw[0];
    }
    return raw;
  };

  const forwardedFor = headerValue("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = headerValue("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return socketRemoteAddress ?? null;
};
