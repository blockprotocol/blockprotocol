export type FileMediaType = "image" | "video";

export type UploadFileData = {
  file?: File | null;
  url?: string | null;
  mediaType: FileMediaType;
};

export type UploadFileReturn = {
  entityId: string;
  url: string;
  mediaType: FileMediaType;
};
