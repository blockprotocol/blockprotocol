import {
  Box,
  Divider,
  ListItemButton,
  Popover,
  Typography,
} from "@mui/material";
import { FunctionComponent, useRef, useState } from "react";

import { useUser } from "../../context/user-context";
import { apiClient } from "../../lib/api-client";
import { Button } from "../button";
import { Link } from "../link";
import { UserAvatar } from "../user-avatar";

export const AccountDropdown: FunctionComponent = () => {
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
        data-testid="account-dropdown-button"
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
          // @ts-expect-error -- https://github.com/microsoft/TypeScript/issues/28960
          "data-testid": "account-dropdown-popover",
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
