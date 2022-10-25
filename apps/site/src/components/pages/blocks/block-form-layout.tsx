import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Box, buttonClasses } from "@mui/material";
import { PropsWithChildren } from "react";

import { FontAwesomeIcon } from "../../icons/index.js";
import { LinkButton } from "../../link-button.js";
import { BlockFormContainer } from "./block-form-styles.js";

export const BlockFormLayout = ({ children }: PropsWithChildren) => {
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

      <BlockFormContainer>{children}</BlockFormContainer>
    </Box>
  );
};
