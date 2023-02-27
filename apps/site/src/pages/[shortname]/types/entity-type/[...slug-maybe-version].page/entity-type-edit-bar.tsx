import {
  EntityTypeEditorFormData,
  useEntityTypeFormState,
} from "@hashintel/type-editor";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { Button } from "../../../../../components/button";
import { PencilSimpleLineIcon } from "../../../../../components/icons/pencil-simple-line";

const useFrozenValue = <T extends any>(value: T): T => {
  const { isDirty } = useEntityTypeFormState<EntityTypeEditorFormData>();

  const [frozen, setFrozen] = useState(value);

  if (isDirty && frozen !== value) {
    setFrozen(value);
  }

  return frozen;
};

export const EntityTypeEditBar = ({
  currentVersion,
  reset,
}: {
  currentVersion: number;
  reset: () => void;
}) => {
  const { isDirty } = useEntityTypeFormState<EntityTypeEditorFormData>();
  const frozenVersion = useFrozenValue(currentVersion);

  const { isSubmitting } = useEntityTypeFormState<EntityTypeEditorFormData>();

  const frozenSubmitting = useFrozenValue(isSubmitting);

  if (!isDirty) {
    return null;
  }

  return (
    <Box
      sx={({ palette }) => ({
        backgroundColor: palette.purple[60],
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "18px 30px",
      })}
    >
      <PencilSimpleLineIcon />
      <Typography sx={{ ml: 1, color: "white" }}>
        <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
          Currently editing
        </Box>{" "}
        {`Version ${frozenVersion} -> ${frozenVersion + 1}`}
      </Typography>
      <Stack spacing={1.25} sx={{ marginLeft: "auto" }} direction="row">
        <Button
          disabled={frozenSubmitting}
          onClick={() => reset()}
          type="button"
          variant="secondary"
          size="small"
        >
          Discard changes
        </Button>
        <Button
          disabled={frozenSubmitting}
          variant="primary"
          size="small"
          type="submit"
        >
          Publish update
        </Button>
      </Stack>
    </Box>
  );
};
