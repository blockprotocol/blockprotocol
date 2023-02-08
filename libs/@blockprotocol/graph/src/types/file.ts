import { Entity } from "./entity.js";

export type UploadFileData = {
  description?: string;
  name?: string;
} & ({ file: File } | { url: string });

// @todo - auto-generate this from File type in blockprotocol.org when available
export type FileEntityProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/description/"?: string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/filename/": string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/": string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/url/": string;
};

export type FileEntity = Entity<true, FileEntityProperties>;

export type UploadFileReturn = FileEntity;
