import { BlockMetadata } from "@blockprotocol/core";

import { DbEntities, DbEntity } from "./shared/api";

type ThemeJsonButtonColor = {
  background: string;
  text: string;
};

type ThemeJsonTypographySettings = {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  textDecoration?: string;
  textTransform?: string;
};

// @todo generate this type from https://schemas.wp.org/trunk/theme.json
type ThemeJson = {
  settings: {
    color: {
      palette: {
        color: string;
        name: string;
        slug: string; // seen so far: base, contrast, primary, secondary, tertiary
      }[];
    };
    typography: {};
  };
  styles: {
    color: {
      background: string;
      text: string;
    };
    typography: ThemeJsonTypographySettings;
    elements: {
      button: {
        border: {
          radius: number;
        };
        ":active": ThemeJsonButtonColor;
        ":focus": ThemeJsonButtonColor;
        ":hover": ThemeJsonButtonColor;
        ":visited": ThemeJsonButtonColor;
        color: ThemeJsonButtonColor;
      };
      h1: {
        typography: ThemeJsonTypographySettings;
      };
      h2: {
        typography: ThemeJsonTypographySettings;
      };
      h3: {
        typography: ThemeJsonTypographySettings;
      };
      h4: {
        typography: ThemeJsonTypographySettings;
      };
      h5: {
        typography: ThemeJsonTypographySettings;
      };
      h6: {
        typography: ThemeJsonTypographySettings;
      };
      link: {
        color: {
          text: string;
        };
        typography: ThemeJsonTypographySettings;
        ":active": {
          color: { text: string };
          typography: ThemeJsonTypographySettings;
        };
        ":focus": {
          color: { text: string };
          typography: ThemeJsonTypographySettings;
        };
        ":hover": {
          color: { text: string };
          typography: ThemeJsonTypographySettings;
        };
        ":visited": {
          color: { text: string };
          typography: ThemeJsonTypographySettings;
        };
      };
    };
  };
};

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
      theme?: ThemeJson;
    };
    block_protocol_block_data: {
      // available in render, non-admin mode
      entities: Record<string, DbEntities>; // map of entityId -> Entity[] (entities in the block's subgraph)
      sourceStrings: Record<string, string>;
      theme?: ThemeJson;
    };
  }
}

export {};
