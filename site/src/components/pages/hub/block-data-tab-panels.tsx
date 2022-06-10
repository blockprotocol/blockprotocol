import { Box, BoxProps, experimental_sx as sx, styled } from "@mui/material";
import { ChangeEvent, VoidFunctionComponent } from "react";

import { Snippet } from "../../snippet";
import { BlockSchema } from "./hub-utils";
import { TabPanel } from "./tab-panel";

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
      fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
      overflow: "auto",
      height: "100%",
      whiteSpace: "break-spaces",
    },
  }),
);

export const BlockDataTabPanels: VoidFunctionComponent<
  BlockDataTabPanelProps
> = ({ blockDataTab, schema, exampleGraph, text, setText, modalOpen }) => {
  const modalHeight = modalOpen ? "60vh" : 450;

  return (
    <>
      <TabPanel value={blockDataTab} index={0}>
        <Box sx={{ height: modalHeight, fontSize: 14, width: "100%" }}>
          <Box
            component="textarea"
            value={text}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setText(event.target.value)
            }
            sx={(theme) => ({
              minHeight: "100%",
              backgroundColor: theme.palette.gray[90],
              color: "white",
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
              fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
              resize: "none",
              width: "100%",
              overflow: "auto",
            })}
            p={2}
            placeholder="Your block input goes here..."
          />
        </Box>
      </TabPanel>
      <TabPanel value={blockDataTab} index={1}>
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
