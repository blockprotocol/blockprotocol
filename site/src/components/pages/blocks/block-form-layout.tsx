import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Box, buttonClasses, SxProps, Theme } from "@mui/material";
import { PropsWithChildren } from "react";

import { FontAwesomeIcon } from "../../icons";
import { LinkButton } from "../../link-button";
import { BlockFormContainer } from "./block-form-container";

type BlockFormLayoutProps = PropsWithChildren<{
  formContainerSx?: SxProps<Theme>;
}>;

export const BlockFormLayout = ({
  children,
  formContainerSx,
}: BlockFormLayoutProps) => {
  return (
    <Box
      sx={({ breakpoints }) => ({
        display: "flex",
        gap: 4,
        alignItems: "flex-start",
        [breakpoints.down("md")]: {
          flexDirection: "column",
        },
      })}
    >
      <LinkButton
        href="/blocks"
        variant="transparent"
        sx={({ palette }) => ({
          [`.${buttonClasses.startIcon}`]: {
            color: palette.purple[300],
          },
        })}
        startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
      >
        Back to Blocks
      </LinkButton>

      <BlockFormContainer sx={formContainerSx}>{children}</BlockFormContainer>
    </Box>
  );
};
