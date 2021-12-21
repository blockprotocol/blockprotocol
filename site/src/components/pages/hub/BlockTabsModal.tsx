import { VoidFunctionComponent } from "react";
import { Box, Modal, SxProps, Theme } from "@mui/material";

import { BlockDataTabPanels } from "./BlockDataTabPanels";
import { BlockDataTabs } from "./BlockDataTabs";
import { BlockSchema } from "./HubUtils";
import { BlockModalButton } from "./BlockModalButton";

const style: SxProps<Theme> | undefined = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  boxShadow: 24,
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
};

interface BlockTabsModalProps {
  open: boolean;
  setOpen: (setBlockCallback: (oldValue: boolean) => boolean) => void;
  blockDataTab: number;
  setBlockDataTab: (newValue: number) => void;
  schema: BlockSchema;
  text: string;
  setText: (newValue: string) => void;
}

export const BlockTabsModal: VoidFunctionComponent<BlockTabsModalProps> = ({
  open,
  setOpen,
  blockDataTab,
  setBlockDataTab,
  schema,
  text,
  setText,
}) => {
  return (
    <Modal open={open} onClose={() => setOpen((oldValue) => !oldValue)}>
      <Box sx={style}>
        <div style={{ position: "relative" }}>
          <BlockDataTabs
            blockDataTab={blockDataTab}
            setBlockDataTab={setBlockDataTab}
            modalOpen
          />
          <BlockDataTabPanels
            blockDataTab={blockDataTab}
            schema={schema}
            text={text}
            setText={setText}
            modalOpen
          />
          <div
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
          </div>
        </div>
      </Box>
    </Modal>
  );
};
