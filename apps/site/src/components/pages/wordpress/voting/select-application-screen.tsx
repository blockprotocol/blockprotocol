import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { ApplicationBadgeButton } from "./application-button";
import { Application, applications } from "./applications";

export interface SelectApplicationScreenProps {
  votes: string[];
  onSelect: (application: Application) => void;
}

export const SelectApplicationScreen: FunctionComponent<
  SelectApplicationScreenProps
> = ({ votes, onSelect }) => {
  return (
    <Box>
      <Typography
        sx={({ palette, breakpoints }) => ({
          fontSize: 16,
          color: palette.gray[90],
          mb: 3,
          lineHeight: 1,
          fontWeight: 900,
          textTransform: "uppercase",
          maxWidth: "unset",
          [breakpoints.up("lg")]: {
            textAlign: "left",
          },
        })}
      >
        Vote for What’s Next
      </Typography>

      <Box
        sx={{
          display: "inline-flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {Object.values(applications).map((application) => (
          <ApplicationBadgeButton
            key={application.id}
            name={application.name}
            icon={application.icon}
            onClick={() => onSelect(application)}
            alreadyVoted={votes.includes(application.id)}
          />
        ))}
      </Box>
    </Box>
  );
};
