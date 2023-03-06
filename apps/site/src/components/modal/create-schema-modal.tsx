import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {
  FormEvent,
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from "react";

import { useUser } from "../../context/user-context";
import { apiClient } from "../../lib/api-client";
import { generateOntologyUrl } from "../../pages/shared/schema";
import { Button } from "../button";
import { TextField } from "../text-field";
import { Modal } from "./modal";

type CreateSchemaModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateSchemaModal: FunctionComponent<CreateSchemaModalProps> = ({
  open,
  onClose,
}) => {
  const [newSchemaTitle, setNewSchemaTitle] = useState("");
  const [touchedTitleInput, setTouchedTitleInput] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<ReactNode>(undefined);
  const router = useRouter();
  const { user } = useUser();

  const handleSchemaTitleChange = (value: string) => {
    // trim surrounding whitespace and remove most special characters
    const formattedText = value.replace(/[^a-zA-Z0-9\-_ ()']/g, "");

    setNewSchemaTitle(formattedText);
  };

  const handleCreateSchema = useCallback(
    async (evt: FormEvent) => {
      evt.preventDefault();
      if (!user || user === "loading") {
        return;
      }

      setTouchedTitleInput(true);
      setLoading(true);
      setApiErrorMessage(undefined);

      const title = newSchemaTitle.trim();
      const { baseUrl, versionedUrl } = generateOntologyUrl({
        author: router.query.shortname as `@${string}`,
        title,
        kind: "entityType",
        version: 1,
      });

      const draft: EntityTypeWithMetadata = {
        schema: {
          description: newDescription.trim(),
          title,
          $schema:
            "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
          $id: versionedUrl,
          kind: "entityType",
          properties: {},
          type: "object",
        },
        metadata: {
          recordId: {
            baseUrl,
            version: 1,
          },
        },
      };

      const exists = await apiClient
        .getEntityTypeByUrl({
          versionedUrl: `${baseUrl}/v/1`,
        })
        .then((res) => !res.error);

      if (exists) {
        setLoading(false);
        setApiErrorMessage("Type title must be unique");
      } else {
        void router.push(
          `${new URL(draft.schema.$id).pathname}?draft=${encodeURIComponent(
            Buffer.from(JSON.stringify(draft)).toString("base64"),
          )}`,
        );
      }
    },
    [user, newDescription, newSchemaTitle, router],
  );

  // @todo introduce a library for handling forms
  const helperText = touchedTitleInput
    ? apiErrorMessage ||
      (newSchemaTitle === "" ? "Please enter a valid value" : undefined)
    : undefined;

  const isSchemaTitleInvalid = !!apiErrorMessage || newSchemaTitle === "";

  const displayError = touchedTitleInput && isSchemaTitleInvalid;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        top: "40%",
      }}
      data-testid="create-schema-modal"
    >
      <Box>
        <Typography
          variant="bpHeading4"
          sx={{
            mb: 2,
            display: "block",
          }}
        >
          Create New <strong>Entity Type</strong>
        </Typography>
        <Typography
          sx={{
            mb: 4,
            fontSize: 16,
            lineHeight: 1.5,
            width: { xs: "90%", md: "85%" },
          }}
        >
          Types are used to define the structure of entities and their
          relationships to other entities.
        </Typography>
        <Box component="form" onSubmit={handleCreateSchema}>
          <TextField
            sx={{ mb: 3 }}
            autoFocus
            label="Title"
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

          <TextField
            sx={{ mb: 3 }}
            label="Description"
            fullWidth
            value={newDescription}
            onChange={(evt) => setNewDescription(evt.target.value)}
            multiline
            required
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
