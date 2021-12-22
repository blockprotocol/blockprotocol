import { Box, Tabs, Tab } from "@mui/material";
import { Validator } from "jsonschema";
import { useMemo, useState, VoidFunctionComponent } from "react";

import { BlockMetadata } from "../../../pages/api/blocks.api";
import { BlockDataTabPanels } from "./BlockDataTabPanels";
import { BlockDataTabs } from "./BlockDataTabs";
import { BlockModalButton } from "./BlockModalButton";
import { BlockTabsModal } from "./BlockTabsModal";
import {
  BlockExports,
  BlockSchema,
  disableTabAnimations,
  dummyUploadFile,
  getEmbedBlock,
} from "./HubUtils";
import { TabPanel } from "./TabPanel";

interface BlockDataContainerProps {
  metadata: BlockMetadata;
  schema: BlockSchema;
  blockModule: BlockExports | undefined;
}

const validator = new Validator();

export const BlockDataContainer: VoidFunctionComponent<
  BlockDataContainerProps
> = ({ metadata, schema, blockModule }) => {
  const [blockDataTab, setBlockDataTab] = useState(0);
  const [blockTab, setBlockTab] = useState(0);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [text, setText] = useState("{}");

  /** used to recompute props and errors on dep changes (caching has no benefit here) */
  const [props, errors] = useMemo<[object | undefined, string[]]>(() => {
    let result;

    try {
      result = JSON.parse(text);
      result.accountId = "test-account-id";
      result.entityId = "test-entity-id";
      result.uploadFile = dummyUploadFile;
      result.getEmbedBlock = getEmbedBlock;
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
    <Box
      component="div"
      mt={5}
      sx={{
        display: { xs: "flex", md: "grid" },
        flexDirection: { xs: "column", md: "unset" },
        gridTemplateColumns: { md: "60% 40%" },
      }}
    >
      <div>
        <div style={{ height: 320, backgroundColor: "white" }}>
          <Tabs
            disableRipple
            disableTouchRipple
            TabIndicatorProps={{
              style: { display: "none" },
            }}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                color: "#64778C",
              },
              "& .MuiTab-root.Mui-selected": {
                backgroundColor: "#F7FAFC",
                color: "#6048E5",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              },
            }}
            value={blockTab}
            onChange={(_event, newValue: number) => setBlockTab(newValue)}
          >
            <Tab {...disableTabAnimations} label={metadata.displayName} />
          </Tabs>
          <TabPanel value={blockTab} index={0}>
            <div
              style={{
                backgroundColor: "#F7FAFC",
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "0px 30px",
                overflow: "auto",
              }}
            >
              {blockModule && <blockModule.default {...props} />}
            </div>
          </TabPanel>
        </div>
      </div>
      <div>
        <BlockDataTabs
          blockDataTab={blockDataTab}
          setBlockDataTab={setBlockDataTab}
        />

        <div
          style={{
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

          <div
            style={{
              position: "absolute",
              height: "80px",
              width: "100%",
              bottom: 0,
              background:
                "linear-gradient(0deg, #39444F 18.14%, rgba(57, 68, 79, 0) 100%)",
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
              textAlign: "right",
            }}
          >
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
          </div>
        </div>

        {errors.length > 0 && (
          <Box
            component="details"
            mt={2}
            px={4}
            py={2}
            sx={{ borderRadius: 6, backgroundColor: "#fecaca" }}
          >
            <summary style={{ cursor: "pointer" }}>Errors</summary>
            <Box component="ul" px={4} py={2} sx={{ listStyleType: "square" }}>
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </Box>
          </Box>
        )}
      </div>
    </Box>
  );
};
