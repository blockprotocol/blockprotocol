import { Box, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";
import { ArrowLeftIcon } from "../../../icons";
import { Application } from "./applications";
import { VoteEmailInput } from "./vote-email-input";

export interface EnterEmailScreenProps {
  title: ReactNode;
  selectedApplication: Application;
  suggestionName?: string;
  sumbitHandler: () => void;
  goBackHandler: () => void;
}

export const EnterEmailScreen: FunctionComponent<EnterEmailScreenProps> = ({
  title,
  selectedApplication,
  suggestionName,
  sumbitHandler,
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
          display: "flex",
          alignItems: "center",
          mb: 2,
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
        {title}
      </Typography>

      <Typography
        variant="bpBodyCopy"
        sx={{
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1,
          mb: 1,
          color: ({ palette }) => palette.common.black,
        }}
      >
        Enter your email address below to submit your vote
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
        We’ll let you know when the Block Protocol arrives in{" "}
        {selectedApplication.name} 💯
      </Typography>

      <VoteEmailInput
        applicationId={selectedApplication.id}
        onSubmit={sumbitHandler}
        suggestionName={suggestionName}
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
