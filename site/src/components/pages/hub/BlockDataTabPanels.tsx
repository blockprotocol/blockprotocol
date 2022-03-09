import { Box } from "@mui/material";
import { ChangeEvent, VoidFunctionComponent } from "react";

import { Snippet } from "../../Snippet";
import { BlockSchema } from "./HubUtils";
import { TabPanel } from "./TabPanel";

type BlockDataTabPanelProps = {
  modalOpen?: boolean;
  blockDataTab: number;
  schema: BlockSchema;
  text: string;
  setText: (newValue: string) => void;
};

export const BlockDataTabPanels: VoidFunctionComponent<
  BlockDataTabPanelProps
> = ({ blockDataTab, schema, text, setText, modalOpen }) => {
  const modalHeight = modalOpen ? "60vh" : 450;

  return (
    <>
      <TabPanel value={blockDataTab} index={1}>
        <Box
          component="pre"
          sx={(theme) => ({
            height: modalHeight,
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
          })}
          p={4}
        >
          <Snippet
            sx={{
              fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
              overflow: "auto",
              height: "100%",
              whiteSpace: "break-spaces",
            }}
            source={JSON.stringify(schema, null, 2)}
            language="json"
          />
        </Box>
      </TabPanel>
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
    </>
  );
};
