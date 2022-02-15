import { Box, Typography, Link, Icon } from "@mui/material";
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

const CardWrapper: FC<CardWrapperProps> = ({ children, onClick, href }) => {
  if (onClick) {
    return (
      <Box component="button" sx={{ textAlign: "left" }} onClick={onClick}>
        {children}
      </Box>
    );
  }

  return <Link href={href}>{children}</Link>;
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
        <Box>
          <Typography variant="bpLargeText" sx={{ mb: 0.75 }}>
            {title}
          </Typography>
          <Typography sx={{ mb: 0.75 }}>{description}</Typography>
          <Box
            sx={{
              color: ({ palette }) => palette.purple[700],
              fontWeight: 600,
              path: {
                fill: "currentColor",
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
    return (
      <DashboardCardSecondary
        {...{ title, description, link, variant, icon }}
      />
    );
  }

  return (
    <CardWrapper href={link.href} onClick={link.onClick}>
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
                fill: "currentColor",
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
    </CardWrapper>
  );
};
