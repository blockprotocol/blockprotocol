import {
  Box,
  Button,
  MenuItem,
  Popover,
  Select,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { JsonView } from "./json-view";

export const EntitySwitcher = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { blockEntity, setBlockEntity, datastore } = useMockBlockDockContext();
  const [entityTypeId, setEntityTypeId] = useState(blockEntity.entityTypeId);
  const [entityId, setEntityId] = useState(blockEntity.entityId);

  const selectedEntity = datastore.entities.find(
    (entity) =>
      entity.entityId === entityId && entity.entityTypeId === entityTypeId,
  );

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = () => {
    setBlockEntity(selectedEntity);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button
        size="small"
        component="button"
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          textTransform: "none",
          color: "inherit",
          lineHeight: 1,
          opacity: 0.9,
        }}
      >
        Switch Entity
      </Button>
      <Popover
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            p: 3,
            display: "flex",
          },
        }}
      >
        <Box width={150} display="flex" flexDirection="column" mr={3}>
          <Box>
            <Typography
              component="label"
              htmlFor="entity-type-id-selector"
              fontWeight={500}
              variant="caption"
            >
              Entity Type Id
            </Typography>
            <Select
              size="small"
              id="entity-type-id-selector"
              value={entityTypeId}
              onChange={(event) => {
                if (event.target.value !== entityTypeId) {
                  setEntityId(undefined);
                }
                setEntityTypeId(event.target.value);
              }}
              sx={{ mb: 2 }}
              fullWidth
            >
              {datastore.entityTypes.map((type) => (
                <MenuItem key={type.entityTypeId} value={type.entityTypeId}>
                  {type.entityTypeId}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography
              component="label"
              htmlFor="entity-id-selector"
              fontWeight={500}
              variant="caption"
            >
              Entity Id
            </Typography>
            <Select
              id="entity-id-selector"
              size="small"
              value={entityId}
              placeholder="Select Entity"
              onChange={(event) => {
                setEntityId(event.target.value);
              }}
              sx={{
                mb: 2,
              }}
              fullWidth
            >
              {datastore.entities
                .filter((entity) => entity.entityTypeId === entityTypeId)
                .map((entity) => (
                  <MenuItem key={entity.entityId} value={entity.entityId}>
                    {entity.entityId}
                  </MenuItem>
                ))}
            </Select>
          </Box>

          <Button
            variant="contained"
            disableFocusRipple
            disableRipple
            sx={{ textTransform: "none" }}
            onClick={handleSubmit}
          >
            Switch Entity
          </Button>
        </Box>
        <Box
          sx={{
            ".react-json-view": {
              height: 250,
              width: 400,
              overflowY: "scroll",
            },
          }}
        >
          <JsonView
            rootName="properties"
            collapseKeys={[]}
            src={selectedEntity?.properties ?? {}}
            enableClipboard={false}
            quotesOnKeys={false}
            displayObjectSize={false}
            displayDataTypes={false}
          />
        </Box>
      </Popover>
    </Box>
  );
};
