import {
  Box,
  Divider,
  ListItemButton,
  Popover,
  Typography,
} from "@mui/material";
import Image from "next/legacy/image";
import { FunctionComponent, useRef, useState } from "react";

import proTierBackground from "../../../public/assets/pricing/pro-tier-background.svg";
import { useUser } from "../../context/user-context";
import { apiClient } from "../../lib/api-client";
import { isBillingFeatureFlagEnabled } from "../../lib/config";
import { Button } from "../button";
import { ArrowUpRightIcon } from "../icons/arrow-up-right-icon";
import { MapboxIcon } from "../icons/mapbox-icon";
import { OpenAiIcon } from "../icons/open-ai-icon";
import { Link } from "../link";
import { UserAvatar } from "../user-avatar";

export const AccountDropdown: FunctionComponent = () => {
  const { user, signOut } = useUser();

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

    signOut();
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
          <Link href="/account/general" onClick={() => setOpen(false)}>
            <ListItemButton sx={{ padding: (theme) => theme.spacing(1, 2) }}>
              <Typography variant="bpSmallCopy" sx={{ lineHeight: 1 }}>
                Account Settings
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
          {isBillingFeatureFlagEnabled &&
          user.stripeSubscriptionTier !== "pro" ? (
            <ListItemButton
              href="/account/billing"
              sx={{
                position: "relative",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: (theme) => theme.spacing(2.125, 1.625),
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.074) 100%), linear-gradient(90.25deg, #2600BC 52.19%, #4B0B8A 100.05%)",
                mt: 1,
              }}
            >
              <Box
                sx={{ width: "65%", position: "absolute", bottom: 0, right: 0 }}
              >
                <Image layout="responsive" src={proTierBackground} />
              </Box>

              <Typography
                variant="bpHeading5"
                sx={{
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "16px",
                  color: ({ palette }) => palette.common.white,
                  textShadow: "0px 10px 20px rgba(22, 37, 67, 0.2)",
                  mb: 1.25,
                }}
              >
                <strong>Upgrade for unlimited access</strong> to external
                services
              </Typography>
              <Box display="flex" justifyContent="flex-start" gap={1} mb={2.5}>
                <OpenAiIcon
                  sx={{
                    height: 15,
                    width: "auto",
                    color: ({ palette }) => palette.gray[50],
                  }}
                />
                <MapboxIcon
                  sx={{
                    height: 15,
                    width: "auto",
                    color: ({ palette }) => palette.gray[50],
                  }}
                />
                <Typography
                  variant="bpHeading5"
                  sx={{
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: "16px",
                    color: ({ palette }) => palette.gray[50],
                    textShadow: "0px 10px 20px rgba(22, 37, 67, 0.2)",
                  }}
                >
                  & more...
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="tertiary"
                  size="small"
                  sx={{
                    padding: ({ spacing }) => spacing(0.75, 1.5),
                    borderRadius: 1.5,
                    boxShadow:
                      "0px 33.0556px 50.9514px rgba(50, 65, 111, 0.19), 0px 19.6444px 27.7111px rgba(50, 65, 111, 0.15), 0px 10.2px 14.1375px rgba(50, 65, 111, 0.13), 0px 4.15556px 7.08889px rgba(50, 65, 111, 0.1), 0px 0.944444px 3.42361px rgba(50, 65, 111, 0.08)",
                    "::before": {
                      borderWidth: 0,
                    },
                  }}
                >
                  <ArrowUpRightIcon
                    sx={{
                      fontSize: 16,
                      color: ({ palette }) => palette.gray[40],
                      mr: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: ({ palette }) => palette.gray[80],
                    }}
                  >
                    Upgrade
                  </Typography>
                </Button>
              </Box>
            </ListItemButton>
          ) : null}
        </Box>
      </Popover>
    </Box>
  );
};
