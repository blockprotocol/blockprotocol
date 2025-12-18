import { Entity, EntityPropertiesObject } from "@blockprotocol/graph";
import {
  Entity as EntityTemporal,
  EntityTemporalVersioningMetadata,
} from "@blockprotocol/graph/temporal";
import { VersionedUrl } from "@blockprotocol/type-system/slim";
import {
  Box,
  FormControlLabel,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";
import { Alert } from "../../alert";
import {
  BlockDataTabPanels,
  blockPreviewAndDataHeight,
} from "./block-data-container/block-data-tab-panels";
import { BlockDataTabs } from "./block-data-container/block-data-tabs";
import { BlockModalButton } from "./block-data-container/block-modal-button";
import { BlockTabsModal } from "./block-data-container/block-tabs-modal";
import { BlockVariantsTabs } from "./block-data-container/block-variants-tabs";
import { SandboxedBlockDemo } from "./block-data-container/sandboxed-block-demo";
import { BlockExampleGraph, BlockSchema } from "./hub-utils";

const intervalForAllTime =
  (): EntityTemporalVersioningMetadata[keyof EntityTemporalVersioningMetadata] => {
    return {
      start: {
        kind: "inclusive",
        limit: new Date(0).toISOString(),
      },
      end: {
        kind: "unbounded",
      },
    } as const;
  };

const stringifyProperties = (properties: EntityPropertiesObject) =>
  JSON.stringify(properties, null, 2);

type BlockDataContainerProps = {
  metadata: BlockMetadata;
  schema: BlockSchema;
  sandboxBaseUrl: string;
  exampleGraph: BlockExampleGraph | null;
};

/** Blocks that aren't compliant with BP V0.3  */
const checkIfBlockIsSupported = ({ protocol }: BlockMetadata) =>
  protocol === "0.3";

export const BlockDataContainer: FunctionComponent<BlockDataContainerProps> = ({
  metadata,
  schema,
  exampleGraph,
  sandboxBaseUrl,
}) => {
  const [blockDataTab, setBlockDataTab] = useState(0);
  const [blockVariantsTab, setBlockVariantsTab] = useState(0);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [alertSnackBarOpen, setAlertSnackBarOpen] = useState(false);
  const [readonly, setReadonly] = useState(false);

  const [propertiesText, setPropertiesText] = useState<string | null>(null);

  const [errors, setErrors] = useState<string[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeMobileTab, setActiveMobileTab] = useState(0);

  const prevPackage = useRef<string | undefined>(undefined);

  const [entity, setEntity] = useState<Entity | EntityTemporal | null>(null);

  useEffect(() => {
    const interval = intervalForAllTime();

    // Without a schema, or a full entity (provided within the `exampleGraph`) we're unable to infer what a correct
    // entity looks like, and as such we can't continue
    if (metadata.schema) {
      // Create the boilerplate of an entity
      const exampleEntity: Entity | EntityTemporal = {
        properties: {},
        metadata: {
          recordId: {
            entityId: `test-entity-${metadata.name}`,
            editionId: interval.start.limit,
          },
          entityTypeId: metadata.schema as VersionedUrl,
          temporalVersioning: {
            transactionTime: interval,
            decisionTime: interval,
          },
        },
      };

      let entityProperties: EntityPropertiesObject | undefined;

      // Prefer the `variants` field if it exists
      const selectedVariant = metadata.variants?.[blockVariantsTab];
      if (selectedVariant) {
        if (selectedVariant.examples) {
          [entityProperties] = selectedVariant.examples;
        } else {
          entityProperties = selectedVariant.properties;
        }
      } else {
        const examples = metadata.examples;
        if (examples) {
          [entityProperties] = examples;
        }
      }

      exampleEntity.properties = entityProperties ?? {};
      setEntity(exampleEntity);
      return;
    }

    if (exampleGraph) {
      const exampleEntity = exampleGraph.entities.find(
        (graphEntity) =>
          graphEntity.metadata.recordId.entityId ===
            exampleGraph.blockEntityRecordId.entityId &&
          graphEntity.metadata.recordId.editionId ===
            exampleGraph.blockEntityRecordId.editionId,
      );

      if (exampleEntity) {
        setEntity(exampleEntity);
      } else {
        throw new Error(
          `Unable to find an entity for block ${metadata.name} in the example graph`,
        );
      }
    } else if (!metadata.variants && !metadata.examples) {
      // The block hasn't supplied an example graph or a schema, so as long as there aren't any variants or examples
      // we can pass it anything as the type should be unconstrained. We can't pass in a variant or an example as we
      // don't know what the type should be.

      /* @todo - ideally we'd generate this to ensure it stays compatible with the type */
      const exampleThingEntity: Entity | EntityTemporal = {
        properties: {
          "https://blockprotocol.org/types/@blockprotocol/property-type/name/":
            "World",
        },
        metadata: {
          recordId: {
            entityId: `test-entity-${metadata.name}`,
            editionId: interval.start.limit,
          },
          entityTypeId:
            "https://blockprotocol.org/@blockprotocol/types/entity-type/thing/v/2",
          temporalVersioning: {
            transactionTime: interval,
            decisionTime: interval,
          },
        },
      };

      setEntity(exampleThingEntity);
    } else {
      throw new Error(
        `Unable to create a new entity for block ${metadata.name} from its \`examples\` or \`variants\` as it doesn't have an associated schema`,
      );
    }
  }, [blockVariantsTab, exampleGraph, metadata]);

  useEffect(() => {
    if (prevPackage.current !== metadata?.pathWithNamespace) {
      setBlockVariantsTab(0);

      prevPackage.current = metadata.pathWithNamespace;
    }
  }, [exampleGraph, metadata]);

  // If the entity is changed, update the text input of the properties
  useEffect(() => {
    if (entity) {
      setPropertiesText(stringifyProperties(entity.properties));
    }
  }, [entity, setPropertiesText]);

  // If the text of the properties is updated, try and update the entity
  useEffect(() => {
    if (propertiesText) {
      try {
        const parsedProperties = JSON.parse(propertiesText);

        setEntity((prevEntity: Entity | EntityTemporal | null) => {
          if (prevEntity) {
            if (stringifyProperties(prevEntity.properties) === propertiesText) {
              return prevEntity;
            } else {
              return {
                ...prevEntity,
                properties: parsedProperties,
              };
            }
          }

          return null;
        });

        setErrors([]);
      } catch (err) {
        setErrors([(err as Error).message]);
        setAlertSnackBarOpen(true);
      }
    }
  }, [propertiesText]);

  /** used to recompute props on dep changes (caching has no benefit here) */
  const props = useMemo<
    { blockEntity: Entity | EntityTemporal; readonly: boolean } | undefined
  >(() => {
    if (!entity) {
      /* @todo - we need should handle this case and display a loading skeleton or error message */
      return undefined;
    } else {
      // const errorsToEat = ["uploadFile", "getEmbedBlock"];

      // const errorMessages: string[] = [];
      // @todo-0.3 validating this requires fetching the entire schema for the block
      // const errorMessages = validator
      //   .validate(result.properties, schema ?? {})
      //   .errors.map((err) => `ValidationError: ${err.stack}`)
      //   .filter(
      //     (err) => !errorsToEat.some((errorToEat) => err.includes(errorToEat)),
      //   );
      // setErrors(errorMessages);

      return {
        blockEntity: entity,
        readonly,
      };
    }
  }, [entity, readonly]);

  return (
    <>
      {isMobile && (
        <Tabs
          value={activeMobileTab}
          onChange={(_event, newValue: number) => setActiveMobileTab(newValue)}
          sx={{
            backgroundColor: theme.palette.gray[10],
            border: `1px solid ${theme.palette.gray[20]}`,
            borderRadius: "6px",
            display: "flex",
            position: "relative",

            "& .MuiTab-root": {
              flex: 1,
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              marginRight: 0,
            },
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: theme.palette.common.white,
              borderRadius: "6px",
              position: "absolute",
              top: 4,
              bottom: 4,
              marginLeft: "4px",
              height: "unset",
              boxShadow: theme.shadows[1],
              width: "48%",
            },
          }}
        >
          <Tab label="Preview" />
          <Tab label="Block Data" />
        </Tabs>
      )}
      <Box
        mt={{ xs: 2, md: 5 }}
        sx={{
          display: { xs: "flex", md: "grid" },
          flexDirection: { xs: "column", md: "unset" },
          gridTemplateColumns: { md: "60% 40%" },
        }}
      >
        <Box
          sx={{
            ...(isMobile && {
              display: activeMobileTab === 0 ? "block" : "none",
            }),
          }}
        >
          <Box
            sx={{
              height: blockPreviewAndDataHeight,
            }}
          >
            <BlockVariantsTabs
              blockVariantsTab={blockVariantsTab}
              setBlockVariantsTab={setBlockVariantsTab}
              metadata={metadata}
            />
            <Box
              sx={{
                overflow: "auto",
                padding: theme.spacing(4, 4),
                height: "100%",
                backgroundColor: ({ palette }) => palette.gray[10],
                borderRadius: {
                  xs: 3,
                  md: 0,
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  height: "max-content",
                  minHeight: "100%",
                  mx: "auto",
                  position: "relative",
                }}
              >
                {!checkIfBlockIsSupported(metadata) ? (
                  <>
                    This block was written for an earlier version of the Block
                    Protocol specification and cannot currently be displayed in
                    the Hub.
                  </>
                ) : (
                  <SandboxedBlockDemo
                    key={metadata.blockSitePath} // reset sandbox state when switching block
                    metadata={metadata}
                    props={props}
                    sandboxBaseUrl={sandboxBaseUrl}
                  />
                )}
              </Box>
            </Box>
            {checkIfBlockIsSupported(metadata) && (
              <FormControlLabel
                control={
                  <Switch
                    data-testid="readonly-toggle"
                    checked={readonly}
                    onChange={(event) => setReadonly(event.target.checked)}
                  />
                }
                label="Read-only mode"
              />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            ...(isMobile && {
              // @todo use an enum value instead
              display: activeMobileTab === 1 ? "block" : "none",
            }),
          }}
        >
          <BlockDataTabs
            blockDataTab={blockDataTab}
            setBlockDataTab={setBlockDataTab}
            showExampleGraphTab={!!exampleGraph}
          />

          <Box
            sx={{
              position: "relative",
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }}
          >
            <BlockDataTabPanels
              blockDataTab={blockDataTab}
              text={propertiesText ?? "{}"}
              setText={setPropertiesText}
              schema={schema}
              exampleGraph={exampleGraph}
            />
            <Box
              sx={{
                position: "absolute",
                height: 80,
                width: "100%",
                bottom: 0,
                background:
                  "linear-gradient(0deg, #39444F 18.14%, rgba(57, 68, 79, 0) 100%)",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                textAlign: "right",
              }}
            >
              {!isMobile && (
                <>
                  <BlockModalButton setBlockModalOpen={setBlockModalOpen} />
                  <BlockTabsModal
                    open={blockModalOpen}
                    setOpen={setBlockModalOpen}
                    blockDataTab={blockDataTab}
                    setBlockDataTab={setBlockDataTab}
                    schema={schema}
                    exampleGraph={exampleGraph}
                    text={propertiesText ?? "{}"}
                    setText={setPropertiesText}
                  />
                </>
              )}
            </Box>
          </Box>

          {errors.length > 0 && (
            <Box
              component="details"
              mt={2}
              px={3}
              py={2}
              sx={{ borderRadius: "6px", backgroundColor: "#fecaca" }}
            >
              <Box component="summary" sx={{ cursor: "pointer" }}>
                Errors
              </Box>
              <Box
                component="ul"
                px={4}
                py={2}
                sx={{ listStyleType: "square" }}
              >
                {errors.map((err) => (
                  <Typography
                    component="li"
                    key={err}
                    sx={{ wordBreak: "break-word" }}
                  >
                    {err}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          <Snackbar
            open={alertSnackBarOpen}
            autoHideDuration={4000}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
            onClose={() => setAlertSnackBarOpen(false)}
          >
            <div>
              <Alert
                description={
                  <>
                    Please fix the errors in <b>Block Properties</b> before
                    proceeding.
                  </>
                }
                type="warning"
              />
            </div>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};
