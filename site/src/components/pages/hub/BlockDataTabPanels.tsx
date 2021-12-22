import { Box } from "@mui/material";
import { ChangeEvent, VoidFunctionComponent } from "react";

import { Snippet } from "../../Snippet";
import { BlockSchema } from "./HubUtils";
import { TabPanel } from "./TabPanel";

interface BlockDataTabPanelProps {
  modalOpen?: boolean;
  blockDataTab: number;
  schema: BlockSchema;
  text: string;
  setText: (newValue: string) => void;
}

export const BlockDataTabPanels: VoidFunctionComponent<
  BlockDataTabPanelProps
> = ({ blockDataTab, schema, text, setText, modalOpen }) => {
  const modalHeight = modalOpen ? "60vh" : 320;

  return (
    <>
      <TabPanel value={blockDataTab} index={1}>
        <Box
          component="div"
          sx={{
            height: modalHeight,
            fontSize: 14,
            backgroundColor: "#37434F",
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            width: "100%",
          }}
          p={3}
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
        <div style={{ height: modalHeight, fontSize: 14, width: "100%" }}>
          <Box
            component="textarea"
            value={text}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setText(event.target.value)
            }
            style={{
              minHeight: "100%",
              backgroundColor: "#37434F",
              color: "white",
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
              fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
              resize: "none",
              width: "100%",
              overflow: "auto",
            }}
            p={3}
            placeholder="Your block input goes here..."
          />
        </div>
      </TabPanel>
    </>
  );
};
