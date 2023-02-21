import { FunctionComponent } from "react";

import { Link, LinkProps } from "../../link";

export const CustomLink: FunctionComponent<LinkProps> = ({
  children,
  sx,
  ...props
}) => (
  <Link
    {...props}
    sx={[
      {
        color: ({ palette }) => `${palette.purple[70]} !important`,
        fontWeight: 700,
        whiteSpace: "nowrap",
        borderBottomWidth: "0px !important",
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </Link>
);
