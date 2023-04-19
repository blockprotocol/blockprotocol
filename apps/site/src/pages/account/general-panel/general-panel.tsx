import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextSeo } from "next-seo";
import {
  ChangeEvent,
  DragEvent,
  FunctionComponent,
  useRef,
  useState,
} from "react";

import { FontAwesomeIcon } from "../../../components/icons";
import { Link } from "../../../components/link";
import { PanelSection } from "../../../components/pages/account/panel-section";
import { SaveOnBlurTextField } from "../../../components/save-on-blur-text-field";
import { TextField } from "../../../components/text-field";
import { useUser } from "../../../context/user-context";
import { apiClient } from "../../../lib/api-client";
import { AvatarButton } from "./avatar-button";
import { AvatarDropzoneInfo } from "./avatar-dropzone-info";
import { AvatarWithOverlay } from "./avatar-with-overlay";
import { LinkButtonWithIntroText } from "./link-button-with-intro-text";
import { RemoveAvatarConfirmation } from "./remove-avatar-confirmation";

const DragOverlay = styled("div")({
  inset: 0,
  position: "absolute",
  opacity: 0,
});

export const GeneralPanel: FunctionComponent = () => {
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [displayRemoveAvatarConfirmation, setDisplayRemoveAvatarConfirmation] =
    useState(false);

  const [isDragging, setDragging] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  if (!user || user === "loading") {
    return null;
  }

  const clickOnInput = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatarImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      /** @todo handle error state */
      setIsUploadingAvatar(true);
      const res = await apiClient.uploadAvatar(formData);

      if (res.data) {
        setUser({ ...user, userAvatarUrl: res.data.avatarUrl });
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    void uploadAvatarImage(file);

    // clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAvatar = async () => {
    const res = await apiClient.removeAvatar();

    if (res.data) {
      setUser({ ...user, userAvatarUrl: undefined });
    }

    setDisplayRemoveAvatarConfirmation(false);
  };

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setDragging(true);

    if (event.type === "dragenter" || event.type === "dragover") {
      setDragging(true);
    } else if (event.type === "dragleave") {
      setDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    setDisplayRemoveAvatarConfirmation(false);

    const file = event.dataTransfer?.files[0];

    if (file) {
      void uploadAvatarImage(file);
    }
  };

  const hasAvatar = !!user.userAvatarUrl;

  return (
    <>
      <NextSeo title="Block Protocol – General Settings" />
      <Stack gap={5.25} onDragEnter={handleDrag} sx={{ position: "relative" }}>
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
                  await apiClient.updatePreferredName({ preferredName });
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
                sx={{
                  color: ({ palette }) => palette.gray[80],
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                Avatar
              </Typography>
              <Stack direction={isMobile ? "column" : "row"}>
                <AvatarWithOverlay
                  src={user.userAvatarUrl}
                  mode={
                    isDragging
                      ? "drop"
                      : displayRemoveAvatarConfirmation
                      ? "danger"
                      : "idle"
                  }
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                />

                <Stack
                  sx={{
                    alignItems: "flex-start",
                    flex: 1,
                    gap: 1,
                    alignSelf: isMobile ? "stretch" : "center",
                  }}
                >
                  {isDragging ? (
                    <AvatarDropzoneInfo isReplacing={!!user.userAvatarUrl} />
                  ) : displayRemoveAvatarConfirmation ? (
                    <RemoveAvatarConfirmation
                      onCancel={() => setDisplayRemoveAvatarConfirmation(false)}
                      onConfirm={removeAvatar}
                    />
                  ) : (
                    <>
                      <AvatarButton
                        onClick={clickOnInput}
                        startIcon={<FontAwesomeIcon icon={faUpload} />}
                        loading={isUploadingAvatar}
                      >
                        Upload {hasAvatar ? "new" : "an"} avatar
                      </AvatarButton>
                      <input
                        hidden
                        ref={fileInputRef}
                        accept="image/*"
                        type="file"
                        onChange={handleFileInputChange}
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
            label="Email address (cannot be changed)"
            value={user.email}
            sx={[!isMobile && { maxWidth: "50%" }]}
          />
        </PanelSection>

        <PanelSection title="Miscellaneous">
          <Stack gap={2}>
            <LinkButtonWithIntroText
              description="If you would like to request a copy of the data we hold associated
              with your account, click the button below."
              buttonTitle="Request account data"
              buttonHref="/contact"
            />
            <LinkButtonWithIntroText
              description="If you would like to delete your account, click the button below."
              buttonTitle="Permanently delete data"
              buttonHref="/contact"
            />
          </Stack>
        </PanelSection>

        {isDragging && (
          <DragOverlay
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
            }}
          />
        )}
      </Stack>
    </>
  );
};
