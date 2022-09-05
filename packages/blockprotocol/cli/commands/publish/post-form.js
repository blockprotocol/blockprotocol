import { FormData } from "formdata-node";
// eslint-disable-next-line import/extensions -- rule does not support sub-paths defined in 'exports'
import { fileFromPath } from "formdata-node/file-from-path";
import fetch from "node-fetch";

/**
 * Posts to the Block Protocol API /blocks/create endpoint
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

  return fetch(url, options)
    .then((resp) => resp.json())
    .catch((err) => {
      if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
        return {
          errors: [
            { msg: `Could not connect to host ${blockProtocolSiteHost}` },
          ],
        };
      }
      return err;
    });
};
