const externalServiceNames = [
  "Mapbox Address Autofill Session",
  "Mapbox Isochrone Request",
  "Mapbox Directions Request",
  "Mapbox Temporary Geocoding Request",
  "Mapbox Static Image Request",
  "OpenAI Create Image Request",
  "OpenAI Ada Token",
  "OpenAI Babbage Token",
  "OpenAI Curie Token",
  "OpenAI GPT-3.5 Turbo Token",
  "OpenAI Davinci Token",
  "OpenAI GPT-4 Input Token",
  "OpenAI GPT-4 Output Token",
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
    free: 2_000,
    hobby: 100_000,
    pro: 200_000,
  },
  "OpenAI Babbage Token": {
    free: 2_000,
    hobby: 50_000,
    pro: 100_000,
  },
  "OpenAI Curie Token": {
    free: 2_000,
    hobby: 40_000,
    pro: 80_000,
  },
  "OpenAI Davinci Token": {
    free: 2_000,
    hobby: 10_000,
    pro: 20_000,
  },
  "OpenAI GPT-4 Input Token": {
    free: 0,
    hobby: 2_000,
    pro: 4_000,
  },
  "OpenAI GPT-4 Output Token": {
    free: 0,
    hobby: 3_333,
    pro: 6_666,
  },
};

const openaiLanguageFreeAllowances = [
  externalServiceFreeAllowance["OpenAI GPT-3.5 Turbo Token"],
  externalServiceFreeAllowance["OpenAI GPT-4 Input Token"],
  externalServiceFreeAllowance["OpenAI GPT-4 Output Token"],
  externalServiceFreeAllowance["OpenAI Ada Token"],
  externalServiceFreeAllowance["OpenAI Babbage Token"],
  externalServiceFreeAllowance["OpenAI Curie Token"],
  externalServiceFreeAllowance["OpenAI Davinci Token"],
];

export const numberOfOpenaiHobbyLanguageTokens =
  openaiLanguageFreeAllowances.reduce((prev, { hobby }) => prev + hobby, 0);

export const numberOfOpenaiProLanguageTokens =
  openaiLanguageFreeAllowances.reduce((prev, { pro }) => prev + pro, 0);

export const numberOfOpenaiHobbyWords =
  numberOfOpenaiHobbyLanguageTokens * 0.75;

export const numberOfOpenaiProWords = numberOfOpenaiProLanguageTokens * 0.75;

export const numberToNumberOfThousandsHumanReadable = (input: number) => {
  const numberOfThousands = input * 0.001;

  const roundedNumberOfThousands = Math.round(numberOfThousands);

  return `${roundedNumberOfThousands}k${
    roundedNumberOfThousands * 1000 < input ? "+" : ""
  }`;
};
