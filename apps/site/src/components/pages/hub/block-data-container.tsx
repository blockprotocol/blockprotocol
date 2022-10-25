import { BlockVariant } from "@blockprotocol/core";
import { Entity } from "@blockprotocol/graph";
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
import { Validator } from "jsonschema";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks.js";
import { Alert } from "../../alert.js";
import {
  BlockDataTabPanels,
  blockPreviewAndDataHeight,
} from "./block-data-tab-panels.js";
import { BlockDataTabs } from "./block-data-tabs.js";
import { BlockModalButton } from "./block-modal-button.js";
import { BlockTabsModal } from "./block-tabs-modal.js";
import { BlockVariantsTabs } from "./block-variants-tabs.js";
import { BlockExampleGraph, BlockSchema } from "./hub-utils.js";
import { SandboxedBlockDemo } from "./sandboxed-block-demo.js";

type BlockDataContainerProps = {
  metadata: BlockMetadata;
  schema: BlockSchema;
  sandboxBaseUrl: string;
  exampleGraph: BlockExampleGraph | null;
};

const validator = new Validator();

/** Blocks that aren't compliant with BP V0.2  */
const checkIfBlockIsSupported = ({ protocol }: BlockMetadata) =>
  protocol === "0.2";

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

  const [text, setText] = useState("{}");
  const [exampleEntityId, setExampleEntityId] = useState<string>(
    `test-entity-${metadata.name}`,
  );

  const previousBlockVariantsTab = useRef(-1);
  const propertiesToRemove = useRef<string[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeMobileTab, setActiveMobileTab] = useState(0);

  const prevPackage = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevPackage.current !== metadata?.pathWithNamespace) {
      const example = {
        ...metadata?.examples?.[0],
        ...metadata?.variants?.[0]?.examples?.[0],
        ...metadata?.variants?.[0]?.properties,
      };

      // reset data source input when switching blocks
      if (example) {
        if (typeof example.entityId === "string") {
          setExampleEntityId(example.entityId);
          if (example.properties && typeof example.properties === "object") {
            setText(JSON.stringify(example.properties, undefined, 2));
          }
        } else {
          setText(JSON.stringify(example, undefined, 2));
          setExampleEntityId(`test-entity-${metadata.name}`);
        }
      } else {
        setText("{}");
      }

      setBlockVariantsTab(0);

      prevPackage.current = metadata.pathWithNamespace;
    }
  }, [metadata]);

  useEffect(() => {
    const blockVariant: BlockVariant | undefined =
      metadata?.variants?.[blockVariantsTab];

    if (blockVariant && previousBlockVariantsTab.current !== blockVariantsTab) {
      try {
        const parsedText = JSON.parse(text);

        for (const propertyToRemove of propertiesToRemove.current) {
          delete parsedText[propertyToRemove];
        }

        const nextText = {
          ...parsedText,
          ...metadata?.examples?.[0],
          ...blockVariant.examples?.[0],
          ...blockVariant.properties,
        };

        setText(JSON.stringify(nextText, undefined, 2));
        previousBlockVariantsTab.current = blockVariantsTab;
      } catch (err) {
        setAlertSnackBarOpen(true);
        setBlockVariantsTab(previousBlockVariantsTab.current);
      }
    }

    return () => {
      const previousBlockVariant: BlockVariant | undefined =
        metadata?.variants?.[blockVariantsTab];

      if (previousBlockVariant) {
        propertiesToRemove.current = Object.keys({
          ...previousBlockVariant.properties,
          ...previousBlockVariant.examples?.[0],
        });
      }
    };
  }, [blockVariantsTab, metadata?.examples, metadata?.variants, text]);

  /** used to recompute props and errors on dep changes (caching has no benefit here) */
  const [props, errors] = useMemo<[Entity<any> | undefined, string[]]>(() => {
    const result = {
      entityId: exampleEntityId,
      properties: {},
      readonly,
    };

    try {
      Object.assign(result.properties, JSON.parse(text));
    } catch (err) {
      return [result, [(err as Error).message]];
    }

    const errorsToEat = ["uploadFile", "getEmbedBlock"];

    const errorMessages = validator
      .validate(result.properties, schema ?? {})
      .errors.map((err) => `ValidationError: ${err.stack}`)
      .filter(
        (err) => !errorsToEat.some((errorToEat) => err.includes(errorToEat)),
      );

    return [result, errorMessages];
  }, [exampleEntityId, text, schema, readonly]);

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
          <Tab label="Source Code" />
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
                backgroundColor: "#F7FAFC",
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
              text={text}
              setText={setText}
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
                    text={text}
                    setText={setText}
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
            <Alert
              description={
                <>
                  Please fix the errors in <b>Block Properties</b> before
                  proceeding.
                </>
              }
              type="warning"
            />
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};
