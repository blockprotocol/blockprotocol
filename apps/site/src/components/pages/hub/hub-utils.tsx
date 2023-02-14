import {
  Entity,
  EntityType,
  Link,
  LinkedAggregation,
} from "@blockprotocol/graph";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { NextRouter } from "next/router";

/** @todo type as JSON Schema. */
export type BlockSchema = Record<string, any>;

/** @todo possibly extend this type */
export type BlockExampleGraph = {
  entities?: Entity[];
  entityTypes?: EntityType[];
  links?: Link[];
  linkedAggregations?: LinkedAggregation[];
};

const defaultBrowseType = "blocks";

export const getRouteHubBrowseType = (query: NextParsedUrlQuery) =>
  query.type ?? defaultBrowseType;

export const getHubBrowseQuery = (type: string) =>
  type === defaultBrowseType ? {} : { type };
