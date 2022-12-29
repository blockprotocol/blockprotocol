import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {
  FormEvent,
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { unstable_batchedUpdates } from "react-dom";

import { useUser } from "../../context/user-context";
import { apiClient } from "../../lib/api-client";
import { Button } from "../button";
import { TextField } from "../text-field";
import { Modal } from "./modal";

type CreateTypeModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateTypeModal: FunctionComponent<CreateTypeModalProps> = ({
  open,
  onClose,
}) => {
  const [newTypeTitle, setNewTypeTitle] = useState("");
  const [touchedInput, setTouchedInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<ReactNode>(undefined);
  const router = useRouter();
  const { user } = useUser();

  // @todo might be a good idea to split this into a hook
  // @see https://github.com/blockprotocol/blockprotocol/pull/223#discussion_r808072665
  const handleTypeTitleChange = (value: string) => {
    let formattedText = value.trim();
    // replace all empty spaces
    formattedText = formattedText.replace(/\s/g, "");

    // capitalize text
    const firstChar = formattedText[0];
    if (typeof firstChar === "string") {
      formattedText = firstChar.toUpperCase() + formattedText.slice(1);
    }

    setNewTypeTitle(formattedText);
  };

  const handleCreateType = useCallback(
    async (evt: FormEvent) => {
      evt.preventDefault();
      if (!user || user === "loading") {
        return;
      }

      unstable_batchedUpdates(() => {
        setTouchedInput(true);
        setLoading(true);
        setApiErrorMessage(undefined);
      });

      const { data, error } = await apiClient.createEntityType({
        type: {
          title: newTypeTitle,
        },
      });
      setLoading(false);
      if (error) {
        setApiErrorMessage(error.message);
      } else if (data) {
        const typeTitle = data.entityType.type.title;
        void router.push(`/@${user.shortname}/types/${typeTitle}`);
      }
    },
    [user, newTypeTitle, router],
  );

  // @todo introduce a library for handling forms
  const helperText = touchedInput
    ? apiErrorMessage ||
      (newTypeTitle === "" ? "Please enter a valid value" : undefined)
    : undefined;

  const isTypeTitleInvalid = !!apiErrorMessage || newTypeTitle === "";

  const displayError = touchedInput && isTypeTitleInvalid;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        top: "40%",
      }}
      data-testid="create-type-modal"
    >
      <Box>
        <Typography
          variant="bpHeading4"
          sx={{
            mb: 2,
            display: "block",
          }}
        >
          Create New <strong>Type</strong>
        </Typography>
        <Typography
          sx={{
            mb: 4,
            fontSize: 16,
            lineHeight: 1.5,
            width: { xs: "90%", md: "85%" },
          }}
        >
          Types are used to define the structure of entities - in other words,
          define a ‘type’ of entity
        </Typography>
        <Box component="form" onSubmit={handleCreateType}>
          <TextField
            sx={{ mb: 3 }}
            autoFocus
            label="Type Title"
            fullWidth
            helperText={helperText}
            value={newTypeTitle}
            onChange={(evt) => {
              if (apiErrorMessage) {
                setApiErrorMessage(undefined);
              }
              handleTypeTitleChange(evt.target.value);
            }}
            required
            error={displayError}
          />

          <Button
            disabled={isTypeTitleInvalid}
            loading={loading}
            size="small"
            squared
            type="submit"
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
