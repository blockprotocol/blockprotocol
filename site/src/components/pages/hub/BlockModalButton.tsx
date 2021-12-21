import { Button, Box } from "@mui/material";
import { VoidFunctionComponent } from "react";

import ExpandIcon from "../../../../public/assets/expand.svg";
import CollapseIcon from "../../../../public/assets/collapse.svg";

interface BlockModalButtonProps {
  setBlockModalOpen: (setBlockCallback: (oldValue: boolean) => boolean) => void;
  modalOpen?: boolean;
}

export const BlockModalButton: VoidFunctionComponent<BlockModalButtonProps> = ({
  setBlockModalOpen,
  modalOpen,
}) => {
  return (
    <Button
      onClick={() => setBlockModalOpen((oldValue) => !oldValue)}
      sx={{
        padding: 0,
        margin: "29px 20px 20px auto",
        display: "flex",
        color: "white",
        ".expand-text": {
          opacity: 0,
        },
        svg: {
          path: {
            transition: "0.25s all ease-in-out",
          },
          rect: {
            transition: "0.25s all ease-in-out",
          },
        },
        ":hover": {
          ".expand-text": {
            opacity: 1,
          },
          svg: {
            path: {
              fill: "white",
            },
            rect: {
              stroke: "white",
            },
          },
        },
      }}
    >
      <Box
        sx={{
          transition: "0.25s all ease-in-out",
        }}
        className="expand-text"
      >
        {modalOpen ? "Collapse" : "Expand"}
      </Box>
      {modalOpen ? (
        <CollapseIcon style={{ marginLeft: 10 }} />
      ) : (
        <ExpandIcon style={{ marginLeft: 10 }} />
      )}
    </Button>
  );
};
