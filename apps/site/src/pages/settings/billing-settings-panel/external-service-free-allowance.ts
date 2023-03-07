const externalServiceNames = [
  "Mapbox Address Autofill Session",
  "Mapbox Isochrone Request",
  "Mapbox Directions Request",
  "Mapbox Temporary Geocoding Request",
  "Mapbox Static Image Request",
  "OpenAI Create Image Request",
  "OpenAI GPT-3.5 Turbo Token",
  "OpenAI Ada Token",
  "OpenAI Babbage Token",
  "OpenAI Curie Token",
  "OpenAI Davinci Token",
] as const;

export type ExternalServicePriceName = (typeof externalServiceNames)[number];

/**
 * @todo use the internal API as the source of truth for these values, by fetching
 * them from an internal API endpoint.
 *
 * @see https://app.asana.com/0/1203179076056209/1204082150544746/f
 */
export const externalServiceFreeAllowance: Record<
  ExternalServicePriceName,
  { free: number; hobby: number; pro: number }
> = {
  "Mapbox Address Autofill Session": {
    free: 10,
    hobby: 25,
    pro: 50,
  },
  "Mapbox Isochrone Request": {
    free: 5,
    hobby: 5,
    pro: 500,
  },
  "Mapbox Directions Request": {
    free: 5,
    hobby: 5,
    pro: 500,
  },
  "Mapbox Temporary Geocoding Request": {
    free: 5,
    hobby: 5,
    pro: 500,
  },
  "Mapbox Static Image Request": {
    free: 100,
    hobby: 300,
    pro: 600,
  },
  "OpenAI Create Image Request": {
    free: 5,
    hobby: 50,
    pro: 100,
  },
  "OpenAI GPT-3.5 Turbo Token": {
    free: 10_000,
    hobby: 50_000,
    pro: 100_000,
  },
  "OpenAI Ada Token": {
    free: 0,
    hobby: 100_000,
    pro: 200_000,
  },
  "OpenAI Babbage Token": {
    free: 0,
    hobby: 50_000,
    pro: 100_000,
  },
  "OpenAI Curie Token": {
    free: 0,
    hobby: 40_000,
    pro: 80_000,
  },
  "OpenAI Davinci Token": {
    free: 5_000,
    hobby: 10_000,
    pro: 20_000,
  },
};
