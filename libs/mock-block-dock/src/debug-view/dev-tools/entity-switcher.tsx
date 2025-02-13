import {
  Entity as EntityNonTemporal,
  EntityRecordId as EntityRecordIdNonTemporal,
  VersionedUrl,
} from "@blockprotocol/graph";
import {
  getEntities as getEntitiesNonTemporal,
  getEntityRevision as getEntityRevisionNonTemporal,
  getEntityTypes as getEntityTypesNonTemporal,
  getRoots as getRootsNonTemporal,
} from "@blockprotocol/graph/stdlib";
import {
  Entity as EntityTemporal,
  EntityRecordId as EntityRecordIdTemporal,
} from "@blockprotocol/graph/temporal";
import {
  getEntities as getEntitiesTemporal,
  getEntityRevision as getEntityRevisionTemporal,
  getEntityTypes as getEntityTypesTemporal,
  getRoots as getRootsTemporal,
} from "@blockprotocol/graph/temporal/stdlib";
import {
  Box,
  Button,
  MenuItem,
  Popover,
  Select,
  Typography,
} from "@mui/material";
import { Dispatch, MouseEvent, SetStateAction, useMemo, useState } from "react";

import {
  useMockBlockDockNonTemporalContext,
  useMockBlockDockTemporalContext,
} from "../../mock-block-dock-context";
import { JsonView } from "./json-view";

const EntitySwitcherComponent = ({
  blockEntity,
  selectedEntity,
  entityIds,
  entityTypeIds,
  entityIdOfProposedEntity,
  setEntityIdOfProposedEntity,
  selectedEntityTypeId,
  setSelectedEntityTypeId,
  setEntityRecordIdOfEntityForBlock,
  anchorEl,
  setAnchorEl,
}: {
  blockEntity: EntityNonTemporal | EntityTemporal;
  selectedEntity: EntityNonTemporal | EntityTemporal;
  entityIds: string[];
  entityTypeIds: VersionedUrl[];
  entityIdOfProposedEntity: string | undefined;
  setEntityIdOfProposedEntity: Dispatch<SetStateAction<string | undefined>>;
  selectedEntityTypeId: VersionedUrl | undefined;
  setSelectedEntityTypeId: Dispatch<SetStateAction<VersionedUrl>>;
  setEntityRecordIdOfEntityForBlock: Dispatch<
    SetStateAction<EntityRecordIdNonTemporal | EntityRecordIdTemporal>
  >;
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<HTMLElement | null>;
}) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const handleSubmit = () => {
    if (selectedEntity) {
      setEntityRecordIdOfEntityForBlock(selectedEntity.metadata.recordId);
    }
    closePopover();
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button
        size="small"
        component="button"
        id="entity-switcher-trigger"
        aria-controls={open ? "entity-switcher-popover" : undefined}
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
        id="entity-switcher-popover"
        aria-labelledby="entity-switcher-trigger"
        anchorEl={anchorEl}
        open={open}
        onClose={closePopover}
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
              value={selectedEntityTypeId}
              onChange={(event) => {
                if (event.target.value !== selectedEntityTypeId) {
                  setEntityIdOfProposedEntity(undefined);
                }
                setSelectedEntityTypeId(event.target.value as VersionedUrl);
              }}
              sx={{ mb: 2 }}
              fullWidth
            >
              {entityTypeIds.map((entityTypeId) => (
                <MenuItem key={entityTypeId} value={entityTypeId}>
                  {entityTypeId}
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
              value={entityIdOfProposedEntity}
              onChange={(event) => {
                setEntityIdOfProposedEntity(event.target.value);
              }}
              sx={{
                mb: 2,
              }}
              fullWidth
            >
              {entityIds.map((entityId) => (
                <MenuItem key={entityId} value={entityId}>
                  {entityId}
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
            src={blockEntity?.properties ?? {}}
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

const EntitySwitcherNonTemporal = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { blockEntitySubgraph, setEntityRecordIdOfEntityForBlock, graph } =
    useMockBlockDockNonTemporalContext();

  const blockEntity = useMemo(
    () => getRootsNonTemporal(blockEntitySubgraph)[0]!,
    [blockEntitySubgraph],
  );

  const [selectedEntityTypeId, setSelectedEntityTypeId] = useState(
    blockEntity.metadata.entityTypeId,
  );
  const [entityIdOfProposedEntity, setEntityIdOfProposedEntityForBlock] =
    useState<string | undefined>(blockEntity.metadata.recordId.entityId);

  const selectedEntity = useMemo(
    () =>
      entityIdOfProposedEntity
        ? getEntityRevisionNonTemporal(graph, entityIdOfProposedEntity)!
        : blockEntity,
    [graph, blockEntity, entityIdOfProposedEntity],
  );

  const entityIds = useMemo(
    () =>
      getEntitiesNonTemporal(graph)
        .filter(
          (entity) => entity.metadata.entityTypeId === selectedEntityTypeId,
        )
        .map((entity) => entity.metadata.recordId.entityId),
    [graph, selectedEntityTypeId],
  );

  const entityTypeIds = useMemo(
    () =>
      getEntityTypesNonTemporal(graph).map(
        ({ schema: entityType }) => entityType.$id,
      ),
    [graph],
  );

  return (
    <EntitySwitcherComponent
      blockEntity={blockEntity}
      selectedEntity={selectedEntity}
      entityIds={entityIds}
      entityTypeIds={entityTypeIds}
      entityIdOfProposedEntity={entityIdOfProposedEntity}
      setEntityIdOfProposedEntity={setEntityIdOfProposedEntityForBlock}
      selectedEntityTypeId={selectedEntityTypeId}
      setSelectedEntityTypeId={setSelectedEntityTypeId}
      setEntityRecordIdOfEntityForBlock={setEntityRecordIdOfEntityForBlock}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
    />
  );
};

const EntitySwitcherTemporal = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { blockEntitySubgraph, setEntityRecordIdOfEntityForBlock, graph } =
    useMockBlockDockTemporalContext();

  const blockEntity = useMemo(
    () => getRootsTemporal(blockEntitySubgraph)[0]!,
    [blockEntitySubgraph],
  );

  const [selectedEntityTypeId, setSelectedEntityTypeId] = useState(
    blockEntity.metadata.entityTypeId,
  );
  const [entityIdOfProposedEntity, setEntityIdOfProposedEntityForBlock] =
    useState<string | undefined>(blockEntity.metadata.recordId.entityId);

  const selectedEntity = useMemo(
    () =>
      entityIdOfProposedEntity
        ? getEntityRevisionTemporal(graph, entityIdOfProposedEntity)!
        : blockEntity,
    [graph, blockEntity, entityIdOfProposedEntity],
  );

  const entityIds = useMemo(
    () =>
      getEntitiesTemporal(graph)
        .filter(
          (entity) => entity.metadata.entityTypeId === selectedEntityTypeId,
        )
        .map((entity) => entity.metadata.recordId.entityId),
    [graph, selectedEntityTypeId],
  );

  const entityTypeIds = useMemo(
    () =>
      getEntityTypesTemporal(graph).map(
        ({ schema: entityType }) => entityType.$id,
      ),
    [graph],
  );

  return (
    <EntitySwitcherComponent
      blockEntity={blockEntity}
      selectedEntity={selectedEntity}
      entityIds={entityIds}
      entityTypeIds={entityTypeIds}
      entityIdOfProposedEntity={entityIdOfProposedEntity}
      setEntityIdOfProposedEntity={setEntityIdOfProposedEntityForBlock}
      selectedEntityTypeId={selectedEntityTypeId}
      setSelectedEntityTypeId={setSelectedEntityTypeId}
      setEntityRecordIdOfEntityForBlock={setEntityRecordIdOfEntityForBlock}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
    />
  );
};

/**
 * Interface to change the entity selected for loading into a block
 * 1. Choose the entity type the user wants to look for entities from
 * 2. Choose an entity of that type as a candidate for loading into the block
 * 3. Confirm the choice to send the entityId of the chosen entity
 */
export const EntitySwitcher = ({ temporal }: { temporal: boolean }) =>
  temporal ? <EntitySwitcherTemporal /> : <EntitySwitcherNonTemporal />;
