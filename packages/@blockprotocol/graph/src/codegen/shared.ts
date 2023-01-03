import fetch from "node-fetch";

import { EntityType } from "./entity-type-meta-schema.gen";

export const fetchTypeAsJson = (versionedUri: string) =>
  fetch(versionedUri, {
    headers: {
      accept: "application/json",
    },
  }).then((resp) => resp.json());

export const generateTypeNameFromSchema = (schema: EntityType) =>
  schema.title?.replace(/ /g, "");
