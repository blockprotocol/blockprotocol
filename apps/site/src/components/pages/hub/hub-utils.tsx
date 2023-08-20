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

const defaultBrowseType = "blocks";

export const getRouteHubBrowseType = (query: NextParsedUrlQuery) =>
  query.type?.toString() ?? defaultBrowseType;

export const getHubBrowseQuery = (type: string) =>
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
