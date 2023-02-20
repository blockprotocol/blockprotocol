import { Entity } from "./entity.js";

export type FileAtUrlData = {
  // Optionally describe the file
  description?: string;
  // Optionally provide a filename. Otherwise it will be inferred from the URL.
  name?: string;
  url: string;
};

export type FileData = {
  // Optionally describe the file
  description?: string;
  // Optionally provide a name to override the file's name
  name?: string;
  file: File;
};

export type UploadFileData = FileAtUrlData | FileData;

export const isFileAtUrlData = (
  fileData: UploadFileData,
): fileData is FileAtUrlData => "url" in fileData;

export const isFileData = (fileData: UploadFileData): fileData is FileData =>
  "file" in fileData;

// @todo - auto-generate this from File type in blockprotocol.org when available
export type FileEntityProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/description/"?: string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/filename/": string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/": string;
  "https://blockprotocol.org/@blockprotocol/types/property-type/url/": string;
};

export type FileEntity = Entity<true, FileEntityProperties>;

export type UploadFileReturn = FileEntity;
