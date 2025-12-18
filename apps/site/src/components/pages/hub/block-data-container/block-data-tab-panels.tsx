import { Box, BoxProps, styled } from "@mui/material";
import { FunctionComponent } from "react";

import { Snippet } from "../../../snippet";
import { BlockExampleGraph, BlockSchema } from "../hub-utils";
import { JsonEditor } from "./block-data-tab-panels/json-editor";
import { TabPanel } from "./block-data-tab-panels/tab-panel";

type BlockDataTabPanelProps = {
  modalOpen?: boolean;
  blockDataTab: number;
  schema: BlockSchema;
  exampleGraph: BlockExampleGraph | null;
  text: string;
  setText: (newValue: string) => void;
};

const SnippetContainer = styled(Box)(({ theme }) =>
  theme.unstable_sx({
    fontSize: 14,
    backgroundColor: theme.palette.gray[90],
    borderTopLeftRadius: {
      xs: 6,
      md: 0,
    },
    borderTopRightRadius: {
      xs: 6,
      md: 0,
    },
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    overflow: "auto",
    width: "100%",
    padding: 4,

    ".snippet": {
      overflow: "auto",
      height: "100%",
      whiteSpace: "break-spaces",
    },
  }),
) as typeof Box;

export const blockPreviewAndDataHeight = 500;

export const BlockDataTabPanels: FunctionComponent<BlockDataTabPanelProps> = ({
  blockDataTab,
  schema,
  exampleGraph,
  text,
  setText,
  modalOpen,
}) => {
  const modalHeight = modalOpen ? "60vh" : blockPreviewAndDataHeight;

  return (
    <>
      <TabPanel
        data-testid="block-properties-tabpanel"
        value={blockDataTab}
        index={0}
      >
        <JsonEditor height={modalHeight} value={text} onChange={setText} />
      </TabPanel>
      <TabPanel
        data-testid="block-schema-tabpanel"
        value={blockDataTab}
        index={1}
      >
        <SnippetContainer component="pre" height={modalHeight}>
          <Snippet
            className="snippet"
            source={JSON.stringify(schema, null, 2)}
            language="json"
          />
        </SnippetContainer>
      </TabPanel>
      {!!exampleGraph && (
        <TabPanel value={blockDataTab} index={2}>
          <SnippetContainer component="pre" height={modalHeight}>
            <Snippet
              className="snippet"
              source={JSON.stringify(exampleGraph, null, 2)}
              language="json"
            />
          </SnippetContainer>
        </TabPanel>
      )}
    </>
  );
};
