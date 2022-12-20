import { Box, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";

import { ArrowLeftIcon } from "../../../icons";
import { Input } from "../input";

export interface SuggestAnotherApplicationScreenProps {
  submitHandler: (applicationName: string) => void;
  goBackHandler: () => void;
}

export const SuggestAnotherApplicationScreen: FunctionComponent<
  SuggestAnotherApplicationScreenProps
> = ({ submitHandler, goBackHandler }) => {
  const [applicationName, setApplicationName] = useState("");

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
        Suggest another application
      </Typography>

      <Typography
        variant="bpBodyCopy"
        sx={{
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1,
          mb: 2,
          color: ({ palette }) => palette.common.black,
        }}
      >
        What application would you like to use the Þ in? 👀
      </Typography>

      <Input
        placeholder="Enter the app’s name here"
        value={applicationName}
        onChange={({ target }) => {
          setApplicationName(target.value);
        }}
        buttonLabel="Suggest app"
        handleSubmit={() => submitHandler(applicationName)}
      />

      <Typography
        variant="bpBodyCopy"
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: 14,
          lineHeight: 1,
          fontWeight: 700,
          color: ({ palette }) => palette.purple[70],
          cursor: "pointer",
        }}
        onClick={goBackHandler}
      >
        <ArrowLeftIcon sx={{ fontSize: "inherit", mr: 0.5 }} />
        Go back and vote for a different application
      </Typography>
    </Box>
  );
};
