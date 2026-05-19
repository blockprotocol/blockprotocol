import { Entity, EntityRecordId } from "@blockprotocol/graph";
import { Variants } from "framer-motion";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import { useState } from "react";

/** @todo type as JSON Schema. */
export type BlockSchema = Record<string, any>;

/** @todo possibly extend this type */
export type BlockExampleGraph = {
  blockEntityRecordId: EntityRecordId;
  entities: Entity[];
};

/**
 * Allowlist of accepted values for the `?type=` query parameter. Keep this in
 * sync with the dispatch in `hub.page.tsx` (`fetchListing`) and the header
 * table in `hub.tsx` (`HubBrowseHeaderComponents`).
 *
 * The "types" tab was removed when the type system spun out into SemType
 * (https://semtype.org) — types are no longer browsed under the BP Hub.
 */
export const HUB_BROWSE_TYPES = ["blocks", "services"] as const;

export type HubBrowseType = (typeof HUB_BROWSE_TYPES)[number];

const defaultBrowseType: HubBrowseType = "blocks";

const isHubBrowseType = (value: string): value is HubBrowseType =>
  (HUB_BROWSE_TYPES as readonly string[]).includes(value);

/**
 * Normalises the `?type=` query parameter to a known {@link HubBrowseType}.
 * Unknown values fall back to {@link defaultBrowseType} — this matters for
 * security as well as UX: the result is used to index dispatch tables in the
 * server-side handler, and accepting an arbitrary string would expose a
 * dynamic-property-access sink (CodeQL js/unvalidated-dynamic-method-call).
 */
export const getRouteHubBrowseType = (
  query: NextParsedUrlQuery,
): HubBrowseType => {
  const raw = query.type?.toString();
  return raw !== undefined && isHubBrowseType(raw) ? raw : defaultBrowseType;
};

export const getHubBrowseQuery = (type: HubBrowseType) =>
  type === defaultBrowseType ? {} : { type };

export const fadeInWrapper: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const fadeInChildren: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

/**
 * A hook to track the route changing state via adding a manual listener with the route change trigger
 * @returns
 * `routeChanging`: whether the route is changing
 * `listenRouteChange`: function to execute along with the route change trigger
 */
export const useRouteChangingWithTrigger = () => {
  const router = useRouter();
  const [routeChanging, setRouteChanging] = useState(false);

  const listenRouteChange = () => {
    setRouteChanging(true);

    const handleStop = () => {
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
      setRouteChanging(false);
    };

    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
  };

  return [routeChanging, listenRouteChange] as const;
};
