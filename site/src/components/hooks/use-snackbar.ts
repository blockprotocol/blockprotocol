import {
  OptionsObject,
  ProviderContext,
  SnackbarKey,
  SnackbarMessage,
  // eslint-disable-next-line no-restricted-imports
  useSnackbar as libUseStackbar,
  VariantType,
} from "notistack";

type EnqueueWithoutVariant = (
  message: SnackbarMessage,
  options?: Omit<OptionsObject, "variant">,
) => SnackbarKey;

type SnackbarVariants = Record<VariantType, EnqueueWithoutVariant>;

const variantTypes: VariantType[] = [
  "default",
  "error",
  "info",
  "success",
  "warning",
];

const generateSnackbarVariants = (
  enqueueSnackbar: ProviderContext["enqueueSnackbar"],
) => {
  /** @todo explain */
  const entries = variantTypes.map(
    (variant) =>
      [
        variant,
        (message, options) => enqueueSnackbar(message, { ...options, variant }),
      ] as [VariantType, EnqueueWithoutVariant],
  );

  /** @todo explain */
  return Object.fromEntries(entries) as SnackbarVariants;
};

export const useSnackbar = () => {
  const { enqueueSnackbar } = libUseStackbar();

  return generateSnackbarVariants(enqueueSnackbar);
};
