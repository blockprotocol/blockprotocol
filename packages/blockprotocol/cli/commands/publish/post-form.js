import { FormData } from "formdata-node";
// eslint-disable-next-line import/extensions -- rule does not support sub-paths defined in 'exports'
import { fileFromPath } from "formdata-node/file-from-path";
import fetch from "node-fetch";

/**
 * Posts to the Block Protocol API /blocks/publish endpoint
 * @param {string} blockProtocolSiteHost
 * @param {String} tarballFilePath
 * @param {String} blockName
 * @param {String} apiKey
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
    .then(async (resp) => {
      try {
        return await resp.json();
      } catch (err) {
        // if the JSON parsing failed, the user is probably trying to contact a host that doesn't implement the endpoint
        const errorMsg =
          resp.status !== 200
            ? `Request to ${blockProtocolSiteHost} errored: ${resp.status} ${resp.statusText}`
            : `Malformed JSON response: ${err.message}`; // a non-parseable 200 status response should not happen
        return {
          errors: [
            {
              msg: errorMsg,
            },
          ],
        };
      }
    })
    .catch((err) => {
      if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
        // the host is not contactable at all – probably a network issue or non-running dev/staging instance
        return {
          errors: [
            { msg: `Could not connect to host ${blockProtocolSiteHost}` },
          ],
        };
      }
      return err; // should be a meaningful error provided by the API about why the request failed, e.g. bad API key
    });
};
