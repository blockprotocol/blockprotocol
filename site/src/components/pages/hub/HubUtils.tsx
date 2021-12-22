export const disableTabAnimations = {
  disableFocusRipple: true,
  disableTouchRipple: true,
  disableRipple: true,
};

/** @todo type as JSON Schema. make part of blockprotocol package and publish. */
export type BlockSchema = Record<string, any>;
export type BlockDependency = keyof typeof blockDependencies;

export type BlockProtocolFileMediaType = "image" | "video";

type DummyUploadFile = (action: {
  file?: File;
  url?: string;
  mediaType: BlockProtocolFileMediaType;
}) => Promise<{
  entityId: string;
  url: string;
  mediaType: BlockProtocolFileMediaType;
}>;

export const dummyUploadFile: DummyUploadFile = async ({
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
        entityId: "xxx",
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
            entityId: "xxx",
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

// @todo wait for hash backend to start working
const apiGraphQLEndpoint = "https://alpha-api.hash.ai/graphql";

export async function getEmbedBlock(
  url: string,
  type?: string,
): Promise<{
  html: string;
  error?: string;
  height?: number;
  width?: number;
}> {
  return fetch(apiGraphQLEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "getEmbedCode",
      variables: { url, type },
      query:
        "query getEmbedCode($url: String!, $type: String) {\n  embedCode(url: $url, type: $type) {\n    html\n    providerName\n     height\n     width\n    __typename\n  }\n}\n",
    }),
  })
    .then((response) => response.json())
    .then((responseData) => ({
      ...responseData.data?.embedCode,
      error: responseData?.errors?.[0]?.message,
    }));
}
