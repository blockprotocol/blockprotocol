import { Box, Tabs, Tab, useTheme, useMediaQuery } from "@mui/material";
import { Validator } from "jsonschema";
import { useMemo, useState, VoidFunctionComponent } from "react";
import { MockBlockDock } from "mock-block-dock";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";
import { BlockDataTabPanels } from "./BlockDataTabPanels";
import { BlockDataTabs } from "./BlockDataTabs";
import { BlockModalButton } from "./BlockModalButton";
import { BlockTabsModal } from "./BlockTabsModal";
import { BlockExports, BlockSchema, getEmbedBlock } from "./HubUtils";
import { TabPanel } from "./TabPanel";

type BlockDataContainerProps = {
  metadata: BlockMetadata;
  schema: BlockSchema;
  blockModule: BlockExports | undefined;
};

const validator = new Validator();

export const BlockDataContainer: VoidFunctionComponent<
  BlockDataContainerProps
> = ({ metadata, schema, blockModule }) => {
  const [blockDataTab, setBlockDataTab] = useState(0);
  const [blockTab, setBlockTab] = useState(0);
  const [blockModalOpen, setBlockModalOpen] = useState(false);

  const metadataExample = metadata.examples?.length
    ? JSON.stringify(metadata.examples[0], null, 2)
    : "{}";

  const [text, setText] = useState(metadataExample);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeMobileTab, setActiveMobileTab] = useState(0);

  /** used to recompute props and errors on dep changes (caching has no benefit here) */
  const [props, errors] = useMemo<[object | undefined, string[]]>(() => {
    let result;

    const blockFunctions: Record<string, (params: any) => unknown> = {
      getEmbedBlock,
    };

    try {
      result = JSON.parse(text);
      result.accountId = "test-account-id";
      result.entityId = "test-entity-id";
      result.getEmbedBlock = getEmbedBlock;

      for (const functionName of Object.keys(blockFunctions)) {
        result[functionName] = blockFunctions[functionName];
      }
    } catch (err) {
      return [result, [(err as Error).message]];
    }

    const errorsToEat = ["uploadFile", "getEmbedBlock"];

    const errorMessages = validator
      .validate(result, schema ?? {})
      .errors.map((err) => `ValidationError: ${err.stack}`)
      .filter(
        (err) => !errorsToEat.some((errorToEat) => err.includes(errorToEat)),
      );

    return [result, errorMessages];
  }, [text, schema]);

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
              width: "48% !important",
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
          <Box sx={{ height: 450, backgroundColor: "white" }}>
            <Tabs
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  color: ({ palette }) => palette.gray[60],
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.gray[10],
                    color: theme.palette.purple[700],
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  },
                },
              }}
              value={blockTab}
              onChange={(_event, newValue: number) => setBlockTab(newValue)}
            >
              <Tab label={metadata.displayName} />
            </Tabs>
            <TabPanel
              value={blockTab}
              index={0}
              sx={{
                overflow: "auto",
                padding: theme.spacing(4, 4),
                height: "100%",
                backgroundColor: "#F7FAFC",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  height: "max-content",
                  minHeight: "100%",
                  mx: "auto",
                }}
              >
                {blockModule && (
                  <MockBlockDock>
                    <blockModule.default {...props} />
                  </MockBlockDock>
                )}
              </Box>
            </TabPanel>
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
                  <li key={err}>{err}</li>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
