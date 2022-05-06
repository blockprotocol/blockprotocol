import Dialog from "@mui/material/dialog";
import DialogActions from "@mui/material/dialog-actions";
import DialogContent from "@mui/material/dialog-content";
import DialogContentText from "@mui/material/dialog-content-text";
import DialogTitle from "@mui/material/dialog-title";
import { FunctionComponent, ReactNode } from "react";

import { Button } from "./button";

type ConfirmationAlertProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  title: string;
};

export const ConfirmationAlert: FunctionComponent<ConfirmationAlertProps> = ({
  children,
  open,
  onClose,
  onContinue,
  title,
}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onContinue} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
