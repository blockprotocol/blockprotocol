import { Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { Link, LinkProps } from "../../link";

export const CustomLink: FunctionComponent<Partial<LinkProps>> = ({
  href,
  children,
  sx,
  ...props
}) =>
  href ? (
    <Link
      {...props}
      href={href}
      sx={[
        {
          color: ({ palette }) => `${palette.purple[70]} !important`,
          fontWeight: 700,
          whiteSpace: "nowrap",
          borderBottomWidth: "0px !important",

          "&:hover": {
            color: ({ palette }) => `${palette.purple[60]} !important`,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Link>
  ) : (
    <Typography
      {...props}
      sx={[
        {
          cursor: "pointer",
          color: ({ palette }) => `${palette.purple[70]} !important`,
          fontWeight: 700,
          whiteSpace: "nowrap",

          "&:hover": {
            color: ({ palette }) => `${palette.purple[60]} !important`,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Typography>
  );
