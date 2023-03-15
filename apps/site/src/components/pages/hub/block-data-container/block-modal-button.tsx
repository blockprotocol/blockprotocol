import { Box } from "@mui/material";
import { FunctionComponent } from "react";

import { CollapseIcon, ExpandIcon } from "../../../icons";

type BlockModalButtonProps = {
  setBlockModalOpen: (setBlockCallback: (oldValue: boolean) => boolean) => void;
  modalOpen?: boolean;
};

export const BlockModalButton: FunctionComponent<BlockModalButtonProps> = ({
  setBlockModalOpen,
  modalOpen,
}) => {
  return (
    <Box
      component="button"
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
        <CollapseIcon
          sx={{
            marginLeft: (theme) => theme.spacing(1),
            color: ({ palette }) => palette.bpGray[60],
          }}
        />
      ) : (
        <ExpandIcon
          sx={{
            marginLeft: (theme) => theme.spacing(1),
            color: ({ palette }) => palette.bpGray[60],
          }}
        />
      )}
    </Box>
  );
};
