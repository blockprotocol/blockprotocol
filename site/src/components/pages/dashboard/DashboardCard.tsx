import { Box, Typography, Link } from "@mui/material";
import { VoidFunctionComponent } from "react";

import { ArrowRightIcon } from "../../SvgIcon/ArrowRight";

export type DashboardCardProps = {
  title: string;
  colorGradient: string;
  description: string;
  link: {
    title: string;
    href: string;
  };
};

export const DashboardCard: VoidFunctionComponent<DashboardCardProps> = ({
  title,
  colorGradient,
  description,
  link,
}) => {
  return (
    <Link href={link.href} sx={{ marginBottom: 4 }}>
      <Box
        sx={{
          boxShadow:
            "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            background: colorGradient,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
          height={8}
        />
        <Box p={4}>
          <Typography
            sx={{
              fontFamily: "Apercu Pro",
              fontSize: "28.128px",
              lineHeight: "120%",
              color: "#37434F",
            }}
          >
            {title}
          </Typography>
          <Typography color="#4D5C6C" paddingTop={1}>
            {description}
          </Typography>
          <Box
            sx={{
              color: "#6048E5",
              fontWeight: 600,
              path: {
                fill: "#6F59EC",
              },
              display: "flex",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Box component="span" paddingRight={1}>
              {link.title}
            </Box>
            <ArrowRightIcon
              sx={{
                width: "auto",
                height: "0.8em",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Link>
  );
};
