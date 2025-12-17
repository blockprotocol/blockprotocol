import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Box, Stack, styled, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import { Button } from "../../../../components/button";
import { FontAwesomeIcon } from "../../../../components/icons";
import { InfoCircleIcon } from "../../../../components/icons/info-circle-icon";
import { TextField } from "../../../../components/text-field";
import { ColoredCard } from "./shared/colored-card";

interface ApiKeyCardProps {
  onClose: () => void;
  inputLabel: string;
  defaultValue?: string;
  showDiscardButton?: boolean;
  onSubmit: (displayName: string) => Promise<void>;
  submitTitle: string;
}

const DiscardButton = styled(Button)(({ theme: { palette } }) => ({
  color: palette.purple[90],
  background: palette.purple[20],
  "&:before": {
    borderColor: "rgba(228, 221, 253, 0.66)",
  },
}));

interface FormValues {
  displayName: string;
}

export const ApiKeyCard = ({
  onClose,
  inputLabel,
  defaultValue,
  onSubmit: onSubmitProp,
  submitTitle,
  showDiscardButton,
}: ApiKeyCardProps) => {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { displayName: defaultValue },
  });

  const onSubmit = ({ displayName }: FormValues) => onSubmitProp(displayName);

  return (
    <ColoredCard color="purple" onClose={onClose}>
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={(theme) => ({
          flexDirection: "row",
          gap: 2.5,
          alignItems: "flex-end",

          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            gap: 1.5,
            alignItems: "stretch",
          },
        })}
      >
        <TextField
          label={inputLabel}
          placeholder="Key name"
          autoFocus
          fullWidth
          InputProps={{
            ...register("displayName", { required: true }),
            sx: { background: "white" },
          }}
          error={!!formState.errors.displayName}
          sx={{ minWidth: "40%" }}
        />
        <Button
          type="submit"
          loading={formState.isSubmitting}
          squared
          endIcon={<FontAwesomeIcon icon={faCheck} />}
          sx={{ whiteSpace: "nowrap" }}
        >
          {submitTitle}
        </Button>
        {showDiscardButton && (
          <DiscardButton
            squared
            variant="secondary"
            onClick={onClose}
            sx={{ whiteSpace: "nowrap" }}
          >
            Discard changes
          </DiscardButton>
        )}
      </Stack>

      <Stack
        direction="row"
        sx={{ gap: 1, mt: 2, alignItems: "flex-start", color: "#3A2084" }}
      >
        <InfoCircleIcon sx={{ fontSize: 13, mt: 0.2 }} />
        <Typography
          sx={{
            color: "inherit",
            fontSize: 14,
            lineHeight: 1.3,
          }}
        >
          Key names usually refer to the website or environment where they’ll be
          used.{" "}
          <Box component="span" sx={{ color: "purple.70" }}>
            e.g. “WordPress” or “Staging”
          </Box>
        </Typography>
      </Stack>
    </ColoredCard>
  );
};
