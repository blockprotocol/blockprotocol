import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Menu, MenuItem } from "@mui/material";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

import { FontAwesomeIcon } from "../../../../../components/icons";

interface RowActionsProps {
  id: string;
  onRename: (publicId: string) => void;
  onRevoke: (publicId: string) => void;
}

export const RowActions = ({ id, onRename, onRevoke }: RowActionsProps) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: id,
  });

  return (
    <>
      <IconButton {...bindTrigger(popupState)}>
        <FontAwesomeIcon icon={faEllipsis} />
      </IconButton>
      <Menu
        {...bindMenu(popupState)}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        PaperProps={{
          sx: {
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={() => onRename(id)}>Rename</MenuItem>
        <MenuItem
          sx={{
            color: "red.70",
            "&:hover": { color: "red.70" },
            "&:active": { color: "white", backgroundColor: "red.70" },
          }}
          onClick={() => onRevoke(id)}
        >
          Revoke
        </MenuItem>
      </Menu>
    </>
  );
};
