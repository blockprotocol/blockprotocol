import { FormData } from "formdata-node";
// eslint-disable-next-line -- import/no-unresolved and import/extensions do not support sub-paths defined
import { fileFromPath } from "formdata-node/file-from-path";
import fetch from "node-fetch";

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

  const form = new FormData();

  const file = await fileFromPath(tarballFilePath);

  form.set("blockName", blockName);
  form.set("tarball", file, "tarball.tar.gz");

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
    .catch((error) => {
      if (typeof error === "object" && error) {
        if (
          ("code" in error && error.code === "ENOTFOUND") ||
          error.code === "ECONNREFUSED"
        ) {
          // the host is not contactable at all – probably a network issue or non-running dev/staging instance
          return {
            errors: [
              { msg: `Could not connect to host ${blockProtocolSiteHost}` },
            ],
          };
        }
        if ("msg" in error) {
          // should be a meaningful error provided by the API about why the request failed, e.g. bad API key
          return { errors: [{ msg: error.msg }] };
        }
      }

      return { errors: [{ msg: `Unknown error: ${error}` }] };
    });
};
