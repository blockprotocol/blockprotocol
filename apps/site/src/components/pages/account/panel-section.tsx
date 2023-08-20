import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export const PanelSection = ({
  children,
  title,
  description,
  titleEndContent,
}: {
  title: string;
  children: ReactNode;
  description?: ReactNode;
  titleEndContent?: ReactNode;
}) => {
  return (
    <div>
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "flex-end",
          mb: 2,
          [theme.breakpoints.down("md")]: {
            mb: 4,
          },
        })}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="bpHeading2"
            sx={(theme) => ({
              fontSize: 28,
              color: theme.palette.gray[90],
              mb: 1,
              [theme.breakpoints.down("md")]: {
                pb: 1.5,
                borderBottom: "1px solid",
                borderBottomColor: theme.palette.gray[30],
              },
            })}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: ({ palette }) => palette.gray[70],
              maxWidth: "unset",
              fontSize: 15,
            }}
          >
            {description}
          </Typography>
        </Box>
        {!!titleEndContent && <Box>{titleEndContent}</Box>}
      </Box>
      {children}
    </div>
  );
};
