import { Entity } from "@blockprotocol/graph";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

/** @todo type as JSON Schema. */
export type BlockSchema = Record<string, any>;

/** @todo possibly extend this type */
export type BlockExampleGraph = {
  entities?: Entity[];
};

const defaultBrowseType = "blocks";

export const getRouteHubBrowseType = (query: NextParsedUrlQuery) =>
  query.type?.toString() ?? defaultBrowseType;

export const getHubBrowseQuery = (type: string) =>
  type === defaultBrowseType ? {} : { type };
