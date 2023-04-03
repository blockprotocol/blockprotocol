import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { NextSeo } from "next-seo";
import { ChangeEvent, FunctionComponent, useRef, useState } from "react";

import { FontAwesomeIcon } from "../../../components/icons";
import { Link } from "../../../components/link";
import { PanelSection } from "../../../components/pages/account/panel-section";
import { SaveOnBlurTextField } from "../../../components/save-on-blur-text-field";
import { TextField } from "../../../components/text-field";
import { useUser } from "../../../context/user-context";
import { apiClient } from "../../../lib/api-client";
import { AvatarButton } from "./avatar-button";
import { AvatarWithOverlay } from "./avatar-with-overlay";
import { MiscellaneousTopic } from "./miscellaneous-topic";
import { RemoveAvatarConfirmation } from "./remove-avatar-confirmation";

export const GeneralPanel: FunctionComponent = () => {
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [displayRemoveAvatarConfirmation, setDisplayRemoveAvatarConfirmation] =
    useState(false);

  if (!user || user === "loading") {
    return null;
  }

  const clickOnInput = () => {
    fileInputRef.current?.click();
  };

  const handleOnAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    /** @todo handle error & loading state */
    const res = await apiClient.uploadUserAvatar(formData);

    if (res.data) {
      setUser({ ...user, userAvatarUrl: res.data.avatarUrl });
    }

    // clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAvatar = async () => {
    const res = await apiClient.removeUserAvatar();

    if (res.data) {
      setUser({ ...user, userAvatarUrl: undefined });
    }

    setDisplayRemoveAvatarConfirmation(false);
  };

  const hasAvatar = !!user.userAvatarUrl;

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
              <SaveOnBlurTextField
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
                onSave={async (preferredName) => {
                  /** @todo handle error state */
                  await apiClient.updateUserPreferredName({ preferredName });
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
                <AvatarWithOverlay
                  src={user.userAvatarUrl}
                  showDangerOverlay={displayRemoveAvatarConfirmation}
                />

                <Stack
                  sx={{
                    alignItems: "flex-start",
                    flex: 1,
                    gap: 1,
                    alignSelf: isMobile ? "stretch" : "center",
                  }}
                >
                  {displayRemoveAvatarConfirmation ? (
                    <RemoveAvatarConfirmation
                      onCancel={() => setDisplayRemoveAvatarConfirmation(false)}
                      onConfirm={removeAvatar}
                    />
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
                        ref={fileInputRef}
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
