import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Stack, styled } from "@mui/material";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/button";
import { FontAwesomeIcon } from "../../../components/icons";
import { TextField } from "../../../components/text-field";
import { ColoredCard } from "./colored-card";
import { KeyNameInfoText } from "./key-name-info-text";

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
    borderColor: "#e4ddfda8",
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

      <KeyNameInfoText />
    </ColoredCard>
  );
};
