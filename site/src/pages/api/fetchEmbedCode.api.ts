import { query as queryValidator, validationResult } from "express-validator";
import oEmbedData from "oembed-providers/providers.json";

import { createBaseHandler } from "../../lib/api/handler/baseHandler";
import { formatErrors } from "../../util/api";

oEmbedData.unshift({
  provider_name: "HASH",
  provider_url: "https://hash.ai",
  endpoints: [
    {
      schemes: ["https://core.hash.ai/@*"],
      url: "https://api.hash.ai/oembed",
      discovery: false,
    },
  ],
});

interface Endpoint {
  schemes?: string[];
  url: string;
  discovery: boolean;
  formats: string[];
}

interface IoEmbedData {
  provider_name: string;
  provider_url: string;
  endpoints: Endpoint[];
}

type FetchEmbedCodeQuery = {
  url: string;
  error?: string;
};

export default createBaseHandler<null, FetchEmbedCodeQuery>()
  .use(queryValidator("url").notEmpty().isString())
  .get(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { query } = req;
    const { url } = query as FetchEmbedCodeQuery;

    let oembedEndpoint = "";

    for (const { endpoints } of oEmbedData as IoEmbedData[]) {
      for (const endpoint of endpoints) {
        const isMatch = !!endpoint.schemes?.find((scheme) =>
          scheme.split("*").every((substring) => url.search(substring) > -1),
        );

        if (isMatch) {
          oembedEndpoint = endpoint.url;
        }
      }
    }

    if (!oembedEndpoint) {
      return res.status(404).send({ url: "", error: "Embed not found" });
    }

    try {
      const oEmbedResponse = await fetch(
        `${oembedEndpoint}?url=${url}&maxheight=350&maxwidth=300`,
      ).then((response) => response.json());

      res.send(oEmbedResponse);
    } catch (error) {
      res.status(400).send({ url: "", error: (error as string).toString() });
    }
  });
