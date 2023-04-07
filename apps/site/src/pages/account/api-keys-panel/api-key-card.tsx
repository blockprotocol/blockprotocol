import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Stack, styled } from "@mui/material";
import { useState } from "react";

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
  onSubmit: (name: string) => Promise<void>;
  submitTitle: string;
}

const DiscardButton = styled(Button)(({ theme: { palette } }) => ({
  color: palette.purple[90],
  background: palette.purple[20],
  "&:before": {
    borderColor: "#e4ddfda8",
  },
}));

export const ApiKeyCard = ({
  onClose,
  inputLabel,
  defaultValue,
  onSubmit,
  submitTitle,
  showDiscardButton,
}: ApiKeyCardProps) => {
  const [value, setValue] = useState(defaultValue ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(value);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ColoredCard color="purple" onClose={onClose}>
      <Stack
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
          value={value}
          onChange={(event) => setValue(event.target.value)}
          label={inputLabel}
          placeholder="Key name"
          autoFocus
          fullWidth
          InputProps={{ sx: { background: "white" } }}
          sx={{ minWidth: "40%" }}
        />
        <Button
          loading={loading}
          onClick={handleSubmit}
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
