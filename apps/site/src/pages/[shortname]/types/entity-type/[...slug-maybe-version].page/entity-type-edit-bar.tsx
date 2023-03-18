import { faSmile } from "@fortawesome/free-regular-svg-icons";
import {
  EntityTypeEditorFormData,
  useEntityTypeFormState,
} from "@hashintel/type-editor";
import { Box, Collapse, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import { Button } from "../../../../../components/button";
import { FontAwesomeIcon } from "../../../../../components/icons";
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
  isDraft,
}: {
  currentVersion: number;
  reset: () => void;
  isDraft: boolean;
}) => {
  const router = useRouter();
  const { isDirty } = useEntityTypeFormState<EntityTypeEditorFormData>();
  const frozenVersion = useFrozenValue(currentVersion);

  const { isSubmitting } = useEntityTypeFormState<EntityTypeEditorFormData>();

  const frozenSubmitting = useFrozenValue(isSubmitting);

  return (
    <Collapse in={isDirty || isDraft}>
      <Box
        sx={({ palette }) => ({
          backgroundColor: palette.purple[60],
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "18px 30px",
        })}
      >
        {isDraft ? (
          <FontAwesomeIcon icon={faSmile} sx={{ fontSize: 14 }} />
        ) : (
          <PencilSimpleLineIcon />
        )}
        <Typography sx={{ ml: 1, color: "white" }}>
          <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
            Currently editing
          </Box>{" "}
          {isDraft ? (
            <>- this type has not yet been created</>
          ) : (
            `Version ${frozenVersion} -> ${frozenVersion + 1}`
          )}
        </Typography>
        <Stack spacing={1.25} sx={{ marginLeft: "auto" }} direction="row">
          <Button
            disabled={frozenSubmitting}
            type="button"
            variant="secondary"
            size="small"
            {...(isDraft
              ? { href: `/${router.query.shortname}/all-types` }
              : { onClick: () => reset() })}
          >
            Discard changes
          </Button>
          <Button
            disabled={frozenSubmitting}
            variant="primary"
            size="small"
            type="submit"
          >
            {isDraft ? <>Create</> : <>Publish update</>}
          </Button>
        </Stack>
      </Box>
    </Collapse>
  );
};
