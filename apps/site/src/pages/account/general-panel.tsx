import {
  faFaceLaugh,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  Avatar,
  Box,
  Card,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextSeo } from "next-seo";
import { ChangeEvent, FunctionComponent, useRef, useState } from "react";

import { Button, ButtonProps } from "../../components/button";
import { FontAwesomeIcon } from "../../components/icons";
import { Link } from "../../components/link";
import { PanelSection } from "../../components/pages/account/panel-section";
import { TextField } from "../../components/text-field";
import { useUser } from "../../context/user-context";
import { apiClient } from "../../lib/api-client";

const MiscellaneousTopic = ({
  description,
  buttonTitle,
  buttonHref,
}: {
  description: string;
  buttonTitle: string;
  buttonHref: string;
}) => {
  return (
    <Box>
      <Typography
        sx={{
          maxWidth: "unset",
          mb: 1.25,
          color: "gray.70",
          fontSize: 14,
        }}
      >
        {description}
      </Typography>
      <Button
        href={buttonHref}
        squared
        variant="tertiary"
        size="small"
        color="gray"
      >
        {buttonTitle}
      </Button>
    </Box>
  );
};

const AvatarButton = (props: ButtonProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Button
      squared
      variant="tertiary"
      size={isMobile ? "medium" : "small"}
      color="gray"
      fullWidth={isMobile}
      {...props}
    />
  );
};

const getFormDataBodyWithFile = (file?: File) => {
  const body = new FormData();

  if (file) {
    const blob =
      file instanceof File
        ? file
        : new Blob([JSON.stringify(file)], { type: "application/json" });
    body.append("image", blob);
  }

  return body;
};

export const GeneralPanel: FunctionComponent = () => {
  const { user, setUser } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [displayRemoveAvatarConfirmation, setDisplayRemoveAvatarConfirmation] =
    useState(false);

  if (!user || user === "loading") {
    return null;
  }

  const hasAvatar = !!user.userAvatarUrl;

  const clickOnInput = () => {
    inputRef.current?.click();
  };

  const handleOnAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!inputRef.current) {
      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const body = getFormDataBodyWithFile(file);
    // clear input selection after body is created
    inputRef.current.value = "";

    /** @todo handle error & loading state */
    const res = await apiClient.uploadUserAvatar(body);

    if (res.data) {
      setUser({ ...user, userAvatarUrl: res.data.avatarUrl });
    }
  };

  const removeAvatar = async () => {
    /** @todo handle error & loading state */
    const res = await apiClient.removeUserAvatar();

    if (res.data) {
      setUser({ ...user, userAvatarUrl: undefined });
    }

    setDisplayRemoveAvatarConfirmation(false);
  };

  return (
    <>
      <NextSeo title="Block Protocol – General Settings" />

      <Stack gap={5.25}>
        <PanelSection
          title="Public profile"
          description={
            <>
              Information that may appear on your public Block Protocol profile
              page, visible <Link href={`/@${user.shortname}`}>here</Link>.
            </>
          }
        >
          <Stack direction={isMobile ? "column" : "row"} gap={4.5}>
            <Stack flex={1} gap={3}>
              <TextField
                fullWidth
                placeholder="e.g. John"
                label="First or preferred name"
                helperText="Your name is visible on your public profile"
                value={user.preferredName}
                onChange={(event) => {
                  setUser({
                    ...user,
                    preferredName: event.target.value.trim(),
                  });
                }}
                onBlur={async () => {
                  void apiClient.updateUserPreferredName({
                    preferredName: user.preferredName ?? "",
                  });
                }}
              />
              <TextField
                disabled
                fullWidth
                label="Username (cannot be changed)"
                value={`@${user.shortname}`}
                helperText="Your username is your public handle and cannot be changed"
              />
            </Stack>

            <Box flex={1}>
              <Typography
                sx={{ color: "gray.80", fontSize: 15, fontWeight: 500 }}
              >
                Avatar
              </Typography>
              <Stack direction={isMobile ? "column" : "row"}>
                <Avatar
                  src={user.userAvatarUrl}
                  sx={[
                    {
                      width: 150,
                      height: 150,
                      backgroundColor: "gray.10",
                      border: "1px solid",
                      borderColor: "gray.30",
                      position: "relative",
                      alignSelf: "center",
                      margin: 2,

                      "&:after": {
                        content: '""',
                        transition: theme.transitions.create("opacity"),
                        opacity: displayRemoveAvatarConfirmation ? 1 : 0,
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        zIndex: 1,
                        background:
                          "linear-gradient(0deg, rgba(218, 42, 84, 0.33), rgba(218, 42, 84, 0.33))",
                      },
                    },
                  ]}
                >
                  <FontAwesomeIcon
                    icon={faFaceLaugh}
                    sx={{ color: "gray.40", fontSize: 80 }}
                  />
                </Avatar>

                <Stack
                  sx={{
                    alignItems: "flex-start",
                    flex: 1,
                    gap: 1,
                    alignSelf: isMobile ? "stretch" : "center",
                  }}
                >
                  {displayRemoveAvatarConfirmation ? (
                    <Card
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "gray.20",
                        alignSelf: "center",
                        width: "100%",
                      }}
                      elevation={2}
                    >
                      <Typography
                        sx={{ mb: 1.5, fontSize: 14, color: "gray.80" }}
                      >
                        Are you sure you want to delete your current profile
                        picture?
                      </Typography>
                      <Stack gap={1} direction="row">
                        <Button
                          size="small"
                          color="danger"
                          squared
                          onClick={removeAvatar}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          color="gray"
                          squared
                          variant="tertiary"
                          onClick={() =>
                            setDisplayRemoveAvatarConfirmation(false)
                          }
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Card>
                  ) : (
                    <>
                      <AvatarButton
                        onClick={clickOnInput}
                        startIcon={<FontAwesomeIcon icon={faUpload} />}
                      >
                        Upload {hasAvatar ? "new" : "an"} avatar
                      </AvatarButton>
                      <input
                        hidden
                        ref={inputRef}
                        accept="image/*"
                        type="file"
                        onChange={handleOnAvatarChange}
                      />

                      {hasAvatar && (
                        <AvatarButton
                          startIcon={<FontAwesomeIcon icon={faTrash} />}
                          onClick={() =>
                            setDisplayRemoveAvatarConfirmation(true)
                          }
                        >
                          Delete picture
                        </AvatarButton>
                      )}
                    </>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </PanelSection>

        <PanelSection
          title="Personal information"
          description="The following information is private and only visible to you"
        >
          <TextField
            disabled
            fullWidth
            label="Email address (cannot be changed))"
            value={user.email}
            sx={[!isMobile && { maxWidth: "50%" }]}
          />
        </PanelSection>

        <PanelSection title="Miscellaneous">
          <Stack gap={2}>
            <MiscellaneousTopic
              description="If you would like to request a copy of the data we hold associated
              with your account, click the button below."
              buttonTitle="Request account data"
              buttonHref="/contact"
            />
            <MiscellaneousTopic
              description="If you would like to delete your account, click the button below."
              buttonTitle="Permanently delete data"
              buttonHref="/contact"
            />
          </Stack>
        </PanelSection>
      </Stack>
    </>
  );
};
