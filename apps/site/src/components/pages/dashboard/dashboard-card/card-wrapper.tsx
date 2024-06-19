import { Box, BoxProps, Link } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

type CardWrapperProps = {
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
};

const focusOutlineStyle: BoxProps["sx"] = {
  "&:focus-visible": {
    outline: ({ palette }) => `1px solid ${palette.purple[700]}`,
  },
};

export const CardWrapper: FunctionComponent<CardWrapperProps> = ({
  children,
  onClick,
  href,
}) => {
  if (onClick) {
    return (
      <Box
        data-testid="dashboard-card"
        component="button"
        onClick={onClick}
        sx={focusOutlineStyle}
      >
        {children}
      </Box>
    );
  }

  return (
    <Link data-testid="dashboard-card" href={href} sx={focusOutlineStyle}>
      {children}
    </Link>
  );
};
