import { BaseApiRequest } from "../lib/api/handler/base-handler";

const dataUrl = process.env.DATA_URL;
const dataWriteKey = process.env.DATA_WRITE_KEY;

export type BlockListingProperties = {
  origin: string | null;
  bpUserId: string;
  ip: string | null;
  userAgent: string | null;
  query: string | null;
  resultCount: number;
};

export type EventContext = {
  event: "block_listing";
  userId: string;
  properties: BlockListingProperties;
};

/**
 * @param {string} context.identifier - used as the Anonymous ID for data sending
 */
const createReport = (context: EventContext) => ({
  userId: context.userId,
  event: context.event,
  properties: {
    ...context.properties,
    BpTimestamp: new Date().toISOString(),
  },
});

/**
 * Send a report to the data endpoint, for now we only support using it in the
 * server-side.
 *
 * @param context - context for the event to report
 */
export const sendReport = async (context: EventContext) => {
  if (dataUrl && dataWriteKey) {
    const data = createReport(context);

    // set the write key as the username and leave the password blank using
    // HTTP basic authentication.
    const encodedKey = Buffer.from(`${dataWriteKey}:`).toString("base64");

    const authHeader = `Basic ${encodedKey}`;
    const _response = await fetch(dataUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      // eslint-disable-next-line no-console -- TODO: consider using logger
      console.error(
        `Error sending report [report=${JSON.stringify(
          context,
        )},error="${error}"]`,
      );
    });
  }
};

export const parseClientIp = <RequestBody = unknown>(
  req: BaseApiRequest<RequestBody>,
): string | null => {
  const xForwardedFor = req.headers["x-forwarded-for"];

  const parseIp =
    // This header would be given by Vercel
    req.headers["x-real-ip"] ??
    // x-forwarded-for is usually a list of IPs where the first one is the client (if we can trust all proxies)
    (xForwardedFor && typeof xForwardedFor === "string"
      ? xForwardedFor.split(/, /)[0]
      : Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : null) ??
    // A fallback would be the remote address on the socket
    req.socket.remoteAddress;

  // This ensures that we don't pass down an array of IPs to the caller
  let clientIp = (Array.isArray(parseIp) ? parseIp[0] : parseIp) ?? null;

  // IPv4 addressed mapped as IPv6 are prefixed "::ffff:", we can just get rid of that
  if (clientIp && clientIp.substring(0, 7) === "::ffff:") {
    clientIp = clientIp.substring(7);
  }

  return clientIp;
};
