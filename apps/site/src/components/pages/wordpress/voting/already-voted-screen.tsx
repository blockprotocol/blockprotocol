import { Box, Typography } from "@mui/material";
import { cloneElement, FunctionComponent } from "react";

import { ArrowRightIcon } from "../../../icons";
import { Application } from "./applications";

export interface AlreadyVotedScreenProps {
  selectedApplication: Application;
  goBackHandler: () => void;
}

export const AlreadyVotedScreen: FunctionComponent<AlreadyVotedScreenProps> = ({
  selectedApplication,
  goBackHandler,
}) => {
  return (
    <Box
      sx={({ breakpoints }) => ({
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        flex: 1,
        [breakpoints.down("lg")]: {
          display: "inline-flex",
        },
      })}
    >
      <Typography
        variant="bpBodyCopy"
        sx={({ palette, breakpoints }) => ({
          color: palette.gray[90],
          mb: 4,
          fontSize: 16,
          fontWeight: 900,
          lineHeight: 1,
          textTransform: "uppercase",
          textAlign: "center",
          [breakpoints.up("lg")]: {
            textAlign: "left",
          },
        })}
      >
        Make your vote count
      </Typography>

      <Typography
        variant="bpBodyCopy"
        sx={{
          lineHeight: 1,
          color: ({ palette }) => palette.common.black,
          mb: 2,
        }}
      >
        You previously voted for
        <strong> {selectedApplication.name}</strong>
        {cloneElement(selectedApplication.icon, {
          sx: { height: 24, width: "unset", ml: 1.5, mb: 0.125 },
        } as Record<string, unknown>)}
      </Typography>

      <Typography
        variant="bpBodyCopy"
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: 18,
          lineHeight: 1,
          fontWeight: 700,
          color: ({ palette }) => palette.purple[70],
          cursor: "pointer",
          mb: 2,
        }}
        onClick={goBackHandler}
      >
        Click here to cast your vote for an additional app
        <ArrowRightIcon sx={{ fontSize: "inherit", ml: 0.5 }} />
      </Typography>

      <Typography
        variant="bpBodyCopy"
        sx={{
          fontSize: 14,
          lineHeight: 1,
          color: ({ palette }) => palette.gray[50],
          mb: 2,
        }}
      >
        Only one vote will be counted per person, per app.
      </Typography>
    </Box>
  );
};
