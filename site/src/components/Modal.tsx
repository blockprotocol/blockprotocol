import { FunctionComponent, ReactNode } from "react";
import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";
import { SxProps, Theme } from "@mui/material";

const style: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: 520,
  },
  bgcolor: "white",
  boxShadow:
    "0px 20px 41px rgba(61, 78, 133, 0.07), 0px 16px 25px rgba(61, 78, 133, 0.0531481), 0px 12px 12px rgba(61, 78, 133, 0.0325), 0px 2px 3.13px rgba(61, 78, 133, 0.02)",
  borderRadius: 2,
  p: 4,
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal: FunctionComponent<ModalProps> = ({
  open,
  children,
  onClose,
}) => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </MuiModal>
  );
};
