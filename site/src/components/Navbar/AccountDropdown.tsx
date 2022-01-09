import { VFC, useState, useContext, useRef } from "react";
import {
  Box,
  Typography,
  ListItemButton,
  Divider,
  Popover,
} from "@mui/material";
import { Link } from "../Link";
import { Button } from "../Button";
import UserContext from "../context/UserContext";
import { apiClient } from "../../lib/apiClient";
import { UserAvatar } from "../UserAvatar";

export const AccountDropdown: VFC = () => {
  const { user, refetch } = useContext(UserContext);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await apiClient.post("logout");

    refetch();
  };

  const { preferredName, shortname } = user || {};

  const id = open ? "simple-popover" : undefined;

  return (
    <Box>
      <Button
        variant="transparent"
        aria-describedby={id}
        onClick={handleClick}
        ref={buttonRef}
      >
        <UserAvatar />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 225,
            borderRadius: "6px",
            marginTop: 1,
          },
        }}
      >
        <Box px={2} pt={1} pb={1.5}>
          <Typography variant="bpSmallCopy">
            <strong>{preferredName}</strong>
          </Typography>
          <Typography component="p" variant="bpMicroCopy">
            @{shortname}
          </Typography>
        </Box>
        <Divider />
        <Box>
          <Link href="/" onClick={() => setOpen(false)}>
            <ListItemButton sx={{ padding: (theme) => theme.spacing(1.5, 2) }}>
              <Typography variant="bpSmallCopy">Dashboard</Typography>
            </ListItemButton>
          </Link>
          <Link href="/settings" onClick={() => setOpen(false)}>
            <ListItemButton sx={{ padding: (theme) => theme.spacing(1.5, 2) }}>
              <Typography variant="bpSmallCopy">Account Settings</Typography>
            </ListItemButton>
          </Link>
          <ListItemButton
            sx={{ padding: (theme) => theme.spacing(1.5, 2) }}
            onClick={handleLogout}
          >
            <Typography variant="bpSmallCopy">Log Out</Typography>
          </ListItemButton>
        </Box>
      </Popover>
    </Box>
  );
};
