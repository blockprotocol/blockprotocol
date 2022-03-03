import { Box, Typography } from "@mui/material";
import { FC, useState, FormEvent, useCallback, ReactNode } from "react";
import { useRouter } from "next/router";
import { unstable_batchedUpdates } from "react-dom";
import { Modal } from "./Modal";
import { apiClient } from "../../lib/apiClient";
import { Button } from "../Button";
import { useUser } from "../../context/UserContext";
import { TextField } from "../TextField";

type CreateSchemaModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateSchemaModal: FC<CreateSchemaModalProps> = ({
  open,
  onClose,
}) => {
  const [newSchemaTitle, setNewSchemaTitle] = useState("");
  const [touchedInput, setTouchedInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<ReactNode>(undefined);
  const router = useRouter();
  const { user } = useUser();

  // @todo might be a good idea to split this into a hook
  // @see https://github.com/blockprotocol/blockprotocol/pull/223#discussion_r808072665
  const handleSchemaTitleChange = (value: string) => {
    let formattedText = value.trim();
    // replace all empty spaces
    formattedText = formattedText.replace(/\s/g, "");

    // capitalize text
    if (formattedText.length > 0) {
      formattedText = formattedText[0].toUpperCase() + formattedText.slice(1);
    }

    setNewSchemaTitle(formattedText);
  };

  const handleCreateSchema = useCallback(
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
        schema: {
          title: newSchemaTitle,
        },
      });
      setLoading(false);
      if (error) {
        setApiErrorMessage(error.message);
      } else if (data) {
        const schemaTitle = data.entityType.schema.title;
        void router.push(`/@${user.shortname}/types/${schemaTitle}`);
      }
    },
    [user, newSchemaTitle, router],
  );

  // @todo introduce a library for handling forms
  const helperText = touchedInput
    ? apiErrorMessage ||
      (newSchemaTitle === "" ? "Please enter a valid value" : undefined)
    : undefined;

  const isSchemaTitleInvalid = !!apiErrorMessage || newSchemaTitle === "";

  const displayError = touchedInput && isSchemaTitleInvalid;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        top: "40%",
      }}
    >
      <Box>
        <Typography
          variant="bpHeading4"
          sx={{
            mb: 2,
            display: "block",
          }}
        >
          Create New <strong>Schema</strong>
        </Typography>
        <Typography
          sx={{
            mb: 4,
            fontSize: 16,
            lineHeight: 1.5,
            width: { xs: "90%", md: "85%" },
          }}
        >
          Schemas are used to define the structure of entities - in other words,
          define a ‘type’ of entity
        </Typography>
        <Box component="form" onSubmit={handleCreateSchema}>
          <TextField
            sx={{ mb: 3 }}
            autoFocus
            label="Schema Title"
            fullWidth
            helperText={helperText}
            value={newSchemaTitle}
            onChange={(evt) => {
              if (apiErrorMessage) {
                setApiErrorMessage(undefined);
              }
              handleSchemaTitleChange(evt.target.value);
            }}
            required
            error={displayError}
          />

          <Button
            disabled={isSchemaTitleInvalid}
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
