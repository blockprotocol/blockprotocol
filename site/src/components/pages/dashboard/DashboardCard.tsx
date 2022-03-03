import { Box, Typography, Link, Icon, BoxProps } from "@mui/material";
import { VoidFunctionComponent, FC } from "react";

import { ArrowRightIcon } from "../../icons";

export type DashboardCardProps = {
  title: string;
  colorGradient?: string;
  description: string;
  link: {
    title: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: string;
  variant?: "primary" | "secondary";
};

type CardWrapperProps = {
  onClick?: () => void;
  href?: string;
};

const sharedStyles: BoxProps["sx"] = {
  position: "relative",
  height: "100%",
  textAlign: "left",

  "& > *": {
    height: "100%",
  },

  "&::after": {
    content: `""`,
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    boxShadow: 1,
    opacity: 0,
    transition: ({ transitions }) =>
      transitions.create("opacity", { duration: 300 }),
  },

  "&:hover::after": {
    opacity: 1,
  },

  "&:focus-visible": {
    outline: ({ palette }) => `1px solid ${palette.purple[700]}`,
  },
};

const CardWrapper: FC<CardWrapperProps> = ({ children, onClick, href }) => {
  if (onClick) {
    return (
      <Box component="button" sx={sharedStyles} onClick={onClick}>
        {children}
      </Box>
    );
  }

  return (
    <Link href={href} sx={sharedStyles}>
      {children}
    </Link>
  );
};

export const DashboardCardSecondary: VoidFunctionComponent<
  Pick<DashboardCardProps, "title" | "link" | "description" | "icon">
> = ({ link, title, description, icon }) => {
  return (
    <CardWrapper href={link.href} onClick={link.onClick}>
      <Box
        sx={{
          display: "flex",
          border: ({ palette }) => `1px solid ${palette.gray[30]}`,
          borderRadius: "4px",
          p: 3,
        }}
      >
        <Icon
          sx={{ fontSize: 32, mr: 3, color: ({ palette }) => palette.gray[40] }}
          className={icon}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="bpLargeText"
            sx={{
              mb: 0.75,
              color: ({ palette }) => palette.gray[80],
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ mb: 2 }}>{description}</Typography>
          <Box
            sx={{
              color: ({ palette }) => palette.purple[700],
              fontWeight: 400,
              path: {
                fill: "currentColor",
              },
              display: "flex",
              alignItems: "center",
              mt: "auto",
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
    </CardWrapper>
  );
};

export const DashboardCard: VoidFunctionComponent<DashboardCardProps> = ({
  title,
  colorGradient,
  description,
  link,
  variant,
  icon,
}) => {
  if (variant === "secondary") {
    const secondaryCardProps = { title, description, link, variant, icon };
    return <DashboardCardSecondary {...secondaryCardProps} />;
  }

  return (
    <CardWrapper href={link.href} onClick={link.onClick}>
      <Box
        sx={{
          // @todo update theme config to include microShadow
          boxShadow:
            "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
          borderRadius: 2,
          position: "relative",
          display: "flex",
          flexDirection: "column",

          "&::after": {
            content: `""`,
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            boxShadow: 2,
            opacity: 0,
            transition: ({ transitions }) =>
              transitions.create("opacity", { duration: 300 }),
          },

          "&:hover::after": {
            opacity: 1,
          },
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
        <Box
          p={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Apercu Pro",
              fontSize: "28.128px",
              lineHeight: "120%",
              color: "#37434F",
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography mb={2} color="#4D5C6C">
            {description}
          </Typography>
          <Box
            sx={{
              color: "#6048E5",
              fontWeight: 600,
              path: {
                fill: "currentColor",
              },
              display: "flex",
              alignItems: "center",
              mt: "auto",
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
    </CardWrapper>
  );
};
