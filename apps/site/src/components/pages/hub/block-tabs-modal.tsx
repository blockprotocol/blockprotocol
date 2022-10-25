import { Box, Modal } from "@mui/material";
import { FunctionComponent } from "react";

import { BlockDataTabPanels } from "./block-data-tab-panels.jsx";
import { BlockDataTabs } from "./block-data-tabs.jsx";
import { BlockModalButton } from "./block-modal-button.jsx";
import { BlockExampleGraph, BlockSchema } from "./hub-utils.jsx";

interface BlockTabsModalProps {
  open: boolean;
  setOpen: (setBlockCallback: (oldValue: boolean) => boolean) => void;
  blockDataTab: number;
  setBlockDataTab: (newValue: number) => void;
  schema: BlockSchema;
  text: string;
  setText: (newValue: string) => void;
  exampleGraph: BlockExampleGraph | null;
}

export const BlockTabsModal: FunctionComponent<BlockTabsModalProps> = ({
  open,
  setOpen,
  blockDataTab,
  setBlockDataTab,
  schema,
  text,
  setText,
  exampleGraph,
}) => {
  return (
    <Modal open={open} onClose={() => setOpen((oldValue) => !oldValue)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "75vw",
          boxShadow: 24,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
        }}
      >
        <Box position="relative">
          <BlockDataTabs
            blockDataTab={blockDataTab}
            setBlockDataTab={setBlockDataTab}
            modalOpen
            showExampleGraphTab={!!exampleGraph}
          />
          <BlockDataTabPanels
            blockDataTab={blockDataTab}
            schema={schema}
            exampleGraph={exampleGraph}
            text={text}
            setText={setText}
            modalOpen
          />
          <Box
            style={{
              position: "absolute",
              height: "80px",
              width: "100%",
              bottom: 0,
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
              textAlign: "right",
            }}
          >
            <BlockModalButton modalOpen={open} setBlockModalOpen={setOpen} />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
