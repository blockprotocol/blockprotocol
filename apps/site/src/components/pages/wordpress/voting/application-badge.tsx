import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography } from "@mui/material";
import { cloneElement, FunctionComponent, ReactElement } from "react";

import { FontAwesomeIcon } from "../../../icons";

export interface ApplicationBadgeProps {
  icon: ReactElement;
  name: string;
  alreadyVoted?: boolean;
}

export const ApplicationBadge: FunctionComponent<ApplicationBadgeProps> = ({
  icon,
  name,
  alreadyVoted,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Box position="relative">
        {cloneElement(icon, {
          sx: { height: 88, width: "unset", opacity: alreadyVoted ? 0.4 : 1 },
        } as Record<string, unknown>)}

        {alreadyVoted ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: ({ palette }) => palette.gray[50],
            }}
          >
            <Typography
              variant="bpSmallCopy"
              sx={{
                color: "inherit",
                fontSize: 14,
                lineHeight: 1,
                textTransform: "uppercase",
                fontWeight: 700,
                mr: 0.5,
              }}
            >
              Voted
            </Typography>

            <FontAwesomeIcon icon={faCheck} />
          </Box>
        ) : null}
      </Box>

      <Typography
        sx={{
          mt: 2.25,
          fontSize: 16,
          color: ({ palette }) =>
            alreadyVoted ? palette.gray[50] : palette.common.black,
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};
