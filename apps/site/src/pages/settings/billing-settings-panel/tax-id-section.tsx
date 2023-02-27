import { StripeTaxId } from "@local/internal-api-client";
import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Collapse,
  Fade,
  IconButton,
  outlinedInputClasses,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import debounce from "lodash/debounce";
import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { TextField } from "../../../components/text-field";
import { internalApi } from "../../../lib/internal-api-client";
import { StripeTaxIdType, stripeTaxIdTypes } from "./tax-id-types";

export const TaxIdSection: FunctionComponent = () => {
  const [existingTaxId, setExistingTaxId] = useState<StripeTaxId | null>();

  const taxIdInputRef = useRef<HTMLInputElement>(null);
  const [taxIdValue, setTaxIdValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<ReactNode>();
  const [loading, setLoading] = useState<boolean>();
  const [stripeTaxIdType, setStripeTaxIdType] =
    useState<StripeTaxIdType | null>(null);

  const fetchTaxId = useCallback(async () => {
    const {
      data: { taxId },
    } = await internalApi.getTaxId();

    setExistingTaxId(taxId ?? null);

    if (taxId) {
      setTaxIdValue(taxId.value);
      setStripeTaxIdType(
        stripeTaxIdTypes.find(({ shortCode }) => shortCode === taxId.type) ??
          null,
      );
    }
  }, []);

  useEffect(() => {
    void fetchTaxId();
  }, [fetchTaxId]);

  const debouncedUpdateTaxId = useMemo(
    () =>
      debounce(
        async (params: {
          updatedTaxIdType: StripeTaxIdType;
          updatedTaxIdValue: string;
        }) => {
          const { updatedTaxIdType, updatedTaxIdValue } = params;

          setLoading(true);
          setErrorMessage(undefined);

          if (updatedTaxIdValue === "") {
            await internalApi.deleteTaxId().catch((error: AxiosError) => {
              if (error.response?.status === 400) {
                return undefined;
              }
              throw error;
            });

            setExistingTaxId(null);
          } else {
            const { shortCode } = updatedTaxIdType;

            const {
              data: { taxId },
            } = await internalApi
              .setTaxId({
                stripeTaxIdTypeShortCode: shortCode,
                taxIdValue: updatedTaxIdValue,
              })
              .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                  setErrorMessage("Invalid Tax ID value");
                  return { data: { taxId: undefined } };
                }

                throw error;
              });

            if (taxId) {
              setExistingTaxId(taxId);
            }
          }
          setLoading(false);
        },
        500,
      ),
    [],
  );

  useEffect(() => {
    if (stripeTaxIdType) {
      void debouncedUpdateTaxId({
        updatedTaxIdType: stripeTaxIdType,
        updatedTaxIdValue: taxIdValue,
      });
    }
  }, [stripeTaxIdType, taxIdValue, debouncedUpdateTaxId]);

  const handleDeleteTaxId = useCallback(async () => {
    await internalApi.deleteTaxId();
    setExistingTaxId(null);
    setTaxIdValue("");
  }, []);

  return (
    <Box marginBottom={2}>
      <Typography
        variant="bpHeading2"
        sx={{ fontSize: 28, fontWeight: 400, marginBottom: 3 }}
      >
        Tax ID
      </Typography>
      <Box display="flex">
        <Autocomplete
          sx={{
            width: 250,
          }}
          options={stripeTaxIdTypes}
          value={stripeTaxIdType}
          onChange={(_, updatedAutocompleteValue) => {
            setStripeTaxIdType(updatedAutocompleteValue);
            setTimeout(() => taxIdInputRef.current?.focus(), 150);
          }}
          getOptionLabel={({ shortCode, country }) =>
            `${shortCode?.split("_").join(" ").toUpperCase()} - ${country}`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Select a tax region"
            />
          )}
        />
        <Fade in={!!stripeTaxIdType}>
          <Box display="flex" alignItems="center" marginLeft={1}>
            <TextField
              sx={{
                [`.${outlinedInputClasses.input}`]: {
                  padding: "8px",
                },
              }}
              inputRef={taxIdInputRef}
              value={taxIdValue}
              onChange={(event) => setTaxIdValue(event.target.value)}
              onBlur={() => {
                if (errorMessage) {
                  setTaxIdValue(existingTaxId?.value ?? "");
                }
              }}
              disabled={!stripeTaxIdType}
              placeholder={stripeTaxIdType?.example}
              error={!!errorMessage}
              InputProps={{
                endAdornment: (
                  <Fade in={loading}>
                    <CircularProgress size={22} />
                  </Fade>
                ),
              }}
            />
            <Fade in={!!existingTaxId}>
              <IconButton sx={{ padding: 0 }} onClick={handleDeleteTaxId}>
                <Close />
              </IconButton>
            </Fade>
          </Box>
        </Fade>
      </Box>
      <Collapse in={!!errorMessage} sx={{ marginBottom: 1 }}>
        <Typography
          variant="bpSmallCopy"
          sx={{ color: ({ palette }) => palette.error.main }}
        >
          {errorMessage}
        </Typography>
      </Collapse>
    </Box>
  );
};
