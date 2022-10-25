import { Box } from "@mui/material";

import { ArrowRightIcon } from "../../../icons/index.js";

interface LinkWrapperProps {
  title: string;
  bold?: boolean;
}

export const LinkWrapper = ({ title, bold }: LinkWrapperProps) => {
  return (
    <Box
      sx={{
        color: ({ palette }) => palette.purple[700],
        fontWeight: bold ? 600 : 400,
        path: {
          fill: "currentColor",
        },
        display: "flex",
        alignItems: "center",
        mt: "auto",
      }}
    >
      <Box component="span" paddingRight={1}>
        {title}
      </Box>
      <ArrowRightIcon
        className="arrow-right-icon"
        sx={(theme) => ({
          width: "auto",
          height: "0.8em",
          color: ({ palette }) => palette.gray[50],
          transition: theme.transitions.create("transform"),
        })}
      />
    </Box>
  );
};
