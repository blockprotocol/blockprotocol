import {
  EntityTypeEditorFormData,
  useEntityTypeFormState,
} from "@hashintel/type-editor";
import { Box, Collapse, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useRouter } from "next/router";
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
        sx={({ palette, zIndex, shadows }) => ({
          backgroundColor: palette.purple[60],
          color: "white",
          position: "sticky",
          top: "var(--navbar-height)",
          zIndex: zIndex.appBar - 1,
          boxShadow: shadows[1],
        })}
      >
        <Container>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              py: "18px",
            }}
          >
            <PencilSimpleLineIcon sx={{ height: 16, width: 16 }} />
            <Typography sx={{ ml: 1, color: "white" }}>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Currently editing
              </Box>{" "}
              {isDraft ? (
                <>– this type has not yet been created</>
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
        </Container>
      </Box>
    </Collapse>
  );
};
