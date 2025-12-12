import { readFile } from "node:fs/promises";

/**
 * Posts to the Block Protocol API /blocks/publish endpoint
 * @param {object} payload
 * @param {string} payload.blockProtocolSiteHost
 * @param {string} payload.tarballFilePath
 * @param {string} payload.blockName
 * @param {string} payload.apiKey
 * @return { Promise<{ errors?: { msg: string }[], block?: { blockSitePath: string }}> }
 */
export const postPublishForm = async ({
  blockProtocolSiteHost,
  tarballFilePath,
  blockName,
  apiKey,
}) => {
  const url = `${blockProtocolSiteHost}/api/blocks/publish`;

  // Node 24 provides WHATWG fetch + FormData + File globally.
  const form = new FormData();

  const tarballBytes = await readFile(tarballFilePath);
  const file = new File([tarballBytes], "tarball.tar.gz", {
    type: "application/gzip",
  });

  form.set("blockName", blockName);
  form.set("tarball", file);

  /** @type {RequestInit} */
  const options = {
    body: form,
    headers: {
      "x-api-key": apiKey,
    },
    method: "POST",
  };

  // @todo when we add another command that connects to the API this should be moved to a shared location
  return fetch(url, options)
    .then(async (response) => {
      try {
        return /** @type {{ block: { blockSitePath: string }}} */ (
          await response.json()
        );
      } catch (error) {
        // if the JSON parsing failed, the user is probably trying to contact a host that doesn't implement the endpoint
        const errorMessage =
          response.status !== 200
            ? `Request to ${blockProtocolSiteHost} errored: ${response.status} ${response.statusText}`
            : `Malformed JSON response: ${
                error instanceof Error ? error.message : error
              }`; // a non-parsable 200 status response should not happen
        return {
          errors: [
            {
              msg: errorMessage,
            },
          ],
        };
      }
    })
    .catch((/** @type unknown */ error) => {
      if (typeof error === "object" && error) {
        // @ts-expect-error -- code can be a property on the error object
        const errorCode = error.code;
        if (errorCode === "ENOTFOUND" || errorCode === "ECONNREFUSED") {
          // the host is not contactable at all – probably a network issue or non-running dev/staging instance
          return {
            errors: [
              { msg: `Could not connect to host ${blockProtocolSiteHost}` },
            ],
          };
        }
        if ("errors" in error) {
          // should be a meaningful error provided by the API about why the request failed, e.g. bad API key
          return /** @type {{ errors: { msg: string; }[] | undefined }} */ (
            error
          );
        }
      }

      return { errors: [{ msg: `Unknown error: ${error}` }] };
    });
};
