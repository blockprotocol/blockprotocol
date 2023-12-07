import { BlockMetadata } from "@blockprotocol/core";

import { DbEntities, DbEntity } from "./shared/api";

declare global {
  interface Window {
    block_protocol_sentry_config?: {
      dsn: string;
      release: string;
      environment: string;
      anonymous_id: string;
      public_id?: string;
    };
    block_protocol_data: {
      // available in admin mode
      blocks: (BlockMetadata & { verified?: boolean })[];
      entities: (DbEntity & {
        locations: { [key: number]: { edit_link: string; title: string } };
      })[];
      plugin_url: string;
    };
    block_protocol_block_data: {
      // available in render, non-admin mode
      entities: Record<string, DbEntities>; // map of entityId -> Entity[] (entities in the block's subgraph)
      sourceStrings: Record<string, string>;
    };
  }
}

export {};
