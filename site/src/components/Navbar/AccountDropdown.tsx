import { Box, Divider, ListItemButton, Typography } from "@mui/material";
import { useRef, useState, VFC } from "react";

import { useUser } from "../../context/UserContext";
import { apiClient } from "../../lib/apiClient";
import { Button } from "../Button";
import { Link } from "../Link";
import { Popover } from "../Popover";
import { UserAvatar } from "../UserAvatar";

export const AccountDropdown: VFC = () => {
  const { user, setUser } = useUser();

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

    setUser(undefined);
  };

  if (user === "loading" || !user) {
    return null;
  }

  const { preferredName, shortname } = user;

  const id = open ? "simple-popover" : undefined;

  return (
    <Box>
      <Button
        variant="transparent"
        aria-describedby={id}
        onClick={handleClick}
        ref={buttonRef}
      >
        <UserAvatar user={user} />
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
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <ListItemButton
              sx={{ padding: (theme) => theme.spacing(1, 2), mt: 0.5 }}
            >
              <Typography variant="bpSmallCopy" sx={{ lineHeight: 1 }}>
                Dashboard
              </Typography>
            </ListItemButton>
          </Link>
          <Link href={`/@${user.shortname}`} onClick={() => setOpen(false)}>
            <ListItemButton sx={{ padding: (theme) => theme.spacing(1, 2) }}>
              <Typography variant="bpSmallCopy" sx={{ lineHeight: 1 }}>
                Your Profile
              </Typography>
            </ListItemButton>
          </Link>
          <Link href="/settings/api-keys" onClick={() => setOpen(false)}>
            <ListItemButton sx={{ padding: (theme) => theme.spacing(1, 2) }}>
              <Typography variant="bpSmallCopy" sx={{ lineHeight: 1 }}>
                API Keys
              </Typography>
            </ListItemButton>
          </Link>
          <ListItemButton
            sx={{ padding: (theme) => theme.spacing(1, 2), mb: 0.5 }}
            onClick={handleLogout}
          >
            <Typography variant="bpSmallCopy" sx={{ lineHeight: 1 }}>
              Log Out
            </Typography>
          </ListItemButton>
        </Box>
      </Popover>
    </Box>
  );
};
