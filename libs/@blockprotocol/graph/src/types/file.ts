import { Entity } from "./entity.js";

export type UploadFileData = {
  description?: string;
  name?: string;
} & ({ file: File } | { url: string });

// @todo -
export type FileEntityProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/description/v/1"?: string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/filename/v/1": string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/v/1": string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/url/v/1": string;
};

export type FileEntity = Entity<true, FileEntityProperties>;

export type UploadFileReturn = FileEntity;
