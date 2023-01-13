import {
  Configuration,
  DefaultApi as InternalApiClient,
} from "@local/internal-api-client";

const basePath = "/api/internal";

const config = new Configuration({ basePath });

export const internalApi = new InternalApiClient(config, basePath);
