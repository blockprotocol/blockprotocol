import { Box, BoxProps, experimental_sx as sx, styled } from "@mui/material";
import { FunctionComponent } from "react";

import { Snippet } from "../../snippet.js";
import { BlockSchema } from "./hub-utils.js";
import { JsonEditor } from "./json-editor.js";
import { TabPanel } from "./tab-panel.js";

type BlockDataTabPanelProps = {
  modalOpen?: boolean;
  blockDataTab: number;
  schema: BlockSchema;
  exampleGraph: any;
  text: string;
  setText: (newValue: string) => void;
};

const SnippetContainer = styled(({ children, ...props }: BoxProps) => (
  <Box {...props} component="pre" p={4}>
    {children}
  </Box>
))(({ theme }) =>
  sx({
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

    ".snippet": {
      overflow: "auto",
      height: "100%",
      whiteSpace: "break-spaces",
    },
  }),
);

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
        <SnippetContainer height={modalHeight}>
          <Snippet
            className="snippet"
            source={JSON.stringify(schema, null, 2)}
            language="json"
          />
        </SnippetContainer>
      </TabPanel>
      {!!exampleGraph && (
        <TabPanel value={blockDataTab} index={2}>
          <SnippetContainer height={modalHeight}>
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
