/** @todo type as JSON Schema. */
export type BlockSchema = Record<string, any>;

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
    embedResponse = await fetch(`/api/fetch-embed-code?url=${url}`).then(
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
