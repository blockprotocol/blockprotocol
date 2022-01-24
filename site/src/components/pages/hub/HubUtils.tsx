import { BlockProtocolUploadFileFunction } from "blockprotocol";

/** @todo type as JSON Schema. make part of blockprotocol package and publish. */
export type BlockSchema = Record<string, any>;
export type BlockDependency = keyof typeof blockDependencies;
export type BlockExports = {
  default: React.FC;
};

export type BlockProtocolFileMediaType = "image" | "video";

export const dummyUploadFile: BlockProtocolUploadFileFunction = async ({
  file,
  url,
  mediaType,
}) => {
  return new Promise((resolve, reject) => {
    if (!file && !url) {
      reject(
        new Error(
          `Please enter a valid ${mediaType} URL or select a file below`,
        ),
      );
      return;
    }

    if (url?.trim()) {
      resolve({
        accountId: "file-account-xxx",
        entityId: "file-entity-xxx",
        url,
        mediaType,
      });
      return;
    }

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          resolve({
            accountId: "file-account-xxx",
            entityId: "file-entity-xxx",
            url: event.target.result.toString(),
            mediaType,
          });
        } else {
          reject(new Error("Couldn't read your file"));
        }
      };

      reader.readAsDataURL(file);
    }
  });
};

/* eslint-disable global-require */
export const blockDependencies = {
  react: require("react"),
  "react-dom": require("react-dom"),
  twind: require("twind"),
  lodash: require("lodash"),
  uploadFile: dummyUploadFile,
};

type OembedResponse = {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
};

// @todo temporary fallback until block implements workarounds for CORS-blocked oembed endpoints
export async function getEmbedBlock(url: string): Promise<{
  html: string;
  error?: string;
  height?: number;
  width?: number;
  providerName?: string;
}> {
  let embedResponse: (OembedResponse & { error: boolean }) | null = null;

  try {
    embedResponse = await fetch(`/api/fetchEmbedCode?url=${url}`).then(
      (response) =>
        response.json() as unknown as OembedResponse & { error: boolean },
    );
  } catch (error) {
    return {
      html: "",
      error: `Embed Code for URL ${url} not found`,
    };
  }

  if (!embedResponse) {
    return {
      html: "",
      error: `Embed Code for URL ${url} not found`,
    };
  }

  const { html, error, provider_name, height, width } = embedResponse;

  if (error) {
    return {
      html: "",
      error: `Embed Code for URL ${url} not found`,
    };
  }

  return {
    html,
    providerName: provider_name,
    height,
    width,
  };
}
