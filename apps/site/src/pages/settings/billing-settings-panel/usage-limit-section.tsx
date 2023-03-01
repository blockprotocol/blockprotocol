import { faCheck, faWarning } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  CircularProgress,
  InputAdornment,
  outlinedInputClasses,
  Tooltip,
  Typography,
} from "@mui/material";
import debounce from "lodash/debounce";
import {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FontAwesomeIcon } from "../../../components/icons";
import { TextField } from "../../../components/text-field";
import { useUser } from "../../../context/user-context";
import { apiClient } from "../../../lib/api-client";
import { ApiSetUsageLimitRequestBody } from "../../api/set-usage-limit.api";
import { priceToHumanReadable } from "../../shared/subscription-utils";

// Regex to allow for a fixed two decimal number that only allows a single
// leading zeros but allow the field to be empty
const usageLimitUsdRegex = /^((0|[1-9][0-9]*)(\.[0-9]{0,2})?)?$/;

// Conver a USD usage limit to cents without using floating point arithmetic.
const convertToCents = (usageLimitUsd: string): number => {
  const [dollars = "0", cents = "00"] = usageLimitUsd.split(".");
  return parseInt(dollars, 10) * 100 + parseInt(cents.padEnd(2, "0"), 10);
};

type UsageLimitState = ApiSetUsageLimitRequestBody;

type ActionState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; message: string };

const Adornment: FunctionComponent<{
  state: ActionState;
}> = ({ state }) => {
  switch (state.state) {
    case "loading":
      return (
        <CircularProgress size={16} sx={{ p: 0, m: 0, color: "#c3c3c3" }} />
      );
    case "success":
      return <FontAwesomeIcon icon={faCheck} />;
    case "error":
      return (
        <Tooltip title={state.message} placement="top">
          <FontAwesomeIcon
            icon={faWarning}
            sx={{
              "&:hover": {
                background: ({ palette }) => palette.gray[20],
              },
            }}
          />
        </Tooltip>
      );
    default:
      return null;
  }
};

export const UsageLimitSection: FunctionComponent = () => {
  const { user } = useUser();

  const [usageLimitValue, setUsageLimitValue] = useState("");

  const [actionState, setActionState] = useState<ActionState>({
    state: "loading",
  });
  const [usageLimit, setUsageLimit] = useState<UsageLimitState | null>(null);

  useEffect(() => {
    if (
      user &&
      user !== "loading" &&
      user.usageLimitCents &&
      Number.isInteger(user.usageLimitCents)
    ) {
      setUsageLimitValue(
        priceToHumanReadable({
          amountInCents: user.usageLimitCents,
          currency: "",
        }),
      );
    } else {
      setUsageLimitValue("");
    }

    setActionState({ state: "idle" });
  }, [user, setActionState]);

  const handleLimitChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (usageLimitUsdRegex.test(value)) {
      setUsageLimitValue(value);

      const newUsageLimit: UsageLimitState = value
        ? { limit: "capped", usageLimitCents: convertToCents(value) }
        : { limit: "uncapped" };

      setUsageLimit(newUsageLimit);
      setActionState({ state: "idle" });
    }
  };

  const debouncedUsageLimit = useMemo(
    () =>
      debounce(async (params: { usageLimitState: UsageLimitState }) => {
        const { usageLimitState } = params;

        setActionState({ state: "loading" });

        const { error } = await apiClient.setUsageLimit(usageLimitState);

        if (error) {
          setActionState({
            state: "error",
            message: "An error occurred, please try again with a valid value.",
          });
        } else {
          setActionState({ state: "success" });
        }

        setUsageLimit(null);
      }, 500),
    [],
  );

  useEffect(() => {
    if (actionState.state === "loading" || usageLimit === null) {
      return;
    }

    void debouncedUsageLimit({
      usageLimitState: usageLimit,
    });
  }, [debouncedUsageLimit, usageLimit, actionState]);

  return (
    <Box marginBottom={6}>
      <Typography
        variant="bpHeading2"
        sx={{ fontSize: 28, fontWeight: 400, marginBottom: 1 }}
      >
        Usage Limits
      </Typography>
      <Typography
        component="p"
        variant="bpSmallCopy"
        sx={{
          color: ({ palette }) => palette.gray[90],
          opacity: 0.66,
          marginBottom: 2,
        }}
      >
        Optionally cap usage-based charges. Leave blank to uncap, or enter $0 to
        prevent all overage charges.
      </Typography>
      <Typography
        htmlFor="usage-limit-input"
        component="label"
        variant="bpSmallCopy"
        sx={{
          color: ({ palette }) => palette.gray[70],
        }}
      >
        Spending cap
      </Typography>
      <TextField
        id="usage-limit-input"
        sx={{
          maxWidth: 400,
          [`.${outlinedInputClasses.input}`]: {
            paddingLeft: 0,
          },
        }}
        fullWidth
        type="text"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          endAdornment: (
            <Box display="inherit">
              <Adornment state={actionState} />
            </Box>
          ),
        }}
        value={usageLimitValue}
        onChange={handleLimitChange}
        placeholder="Leave blank, or enter an amount - e.g. 10.00"
      />
    </Box>
  );
};
