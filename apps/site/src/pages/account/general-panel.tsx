import {
  faFaceLaugh,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextSeo } from "next-seo";
import { FunctionComponent } from "react";

import { Button, ButtonProps } from "../../components/button";
import { FontAwesomeIcon } from "../../components/icons";
import { Link } from "../../components/link";
import { PanelSection } from "../../components/pages/account/panel-section";
import { TextField } from "../../components/text-field";
import { useUser } from "../../context/user-context";

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
          fontSize: 15,
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

export const GeneralPanel: FunctionComponent = () => {
  const { user } = useUser();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!user || user === "loading") {
    return null;
  }

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
              <TextField
                fullWidth
                placeholder="e.g. John"
                label="First or preferred name"
                helperText="Your name is visible on your public profile"
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
              <Typography>Avatar</Typography>
              <Stack direction={isMobile ? "column" : "row"}>
                <Avatar
                  src={user.userAvatarUrl}
                  sx={{
                    margin: 2,
                    width: 150,
                    height: 150,
                    backgroundColor: "gray.10",
                    border: "1px solid",
                    borderColor: "gray.30",
                    alignSelf: "center",
                  }}
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
                  <AvatarButton startIcon={<FontAwesomeIcon icon={faUpload} />}>
                    Upload {hasAvatar ? "new" : "an"} avatar
                  </AvatarButton>
                  {hasAvatar && (
                    <AvatarButton
                      startIcon={<FontAwesomeIcon icon={faTrash} />}
                    >
                      Delete picture
                    </AvatarButton>
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
