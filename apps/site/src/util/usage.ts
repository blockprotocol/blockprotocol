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
