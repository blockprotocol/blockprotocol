import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Box, BoxProps, SvgIconProps, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { FontAwesomeIcon } from "../../../icons";
import { CardWrapper } from "./card-wrapper";
import { DashboardCardLoading } from "./dashboard-card-loading";
import { LinkWrapper } from "./link-wrapper";

const cardContainerSharedStyles: BoxProps["sx"] = {
  display: "flex",
  position: "relative",
  height: "100%",
  textAlign: "left",

  "&::after": {
    content: `""`,
    position: "absolute",
    zIndex: -1,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    boxShadow: 1,
    borderRadius: "inherit",
    opacity: 0,
    transition: ({ transitions }) => transitions.create("opacity"),
  },

  "&:hover::after": {
    opacity: 1,
  },

  "&:hover .arrow-right-icon": {
    transform: "translateX(4px)",
  },
};

const iconStyle: SvgIconProps["sx"] = {
  fontSize: 32,
  mr: 3,
  color: ({ palette }) => palette.gray[40],
};

export type CardVariant = "primary" | "secondary";

export type DashboardCardProps = {
  title: string;
  colorGradient?: string;
  colorGradientOnHover?: string;
  description: string;
  link: {
    title: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: IconDefinition;
  CustomIcon?: FunctionComponent<SvgIconProps>;
  variant?: CardVariant;
  loading?: false;
};

type LoadingCardProps = { variant?: CardVariant; loading: true };

const DashboardCardSecondary: FunctionComponent<
  Pick<
    DashboardCardProps,
    "title" | "link" | "description" | "icon" | "CustomIcon"
  >
> = ({ link, title, description, icon, CustomIcon }) => {
  return (
    <CardWrapper href={link.href} onClick={link.onClick}>
      <Box
        sx={[
          cardContainerSharedStyles,
          {
            border: ({ palette }) => `1px solid ${palette.gray[30]}`,
            borderRadius: 1,
            p: 3,
          },
        ]}
      >
        {CustomIcon ? (
          <CustomIcon sx={iconStyle} />
        ) : icon ? (
          <FontAwesomeIcon sx={iconStyle} icon={icon} />
        ) : null}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            data-testid="dashboard-card-title"
            variant="bpLargeText"
            sx={{
              mb: 0.75,
              color: ({ palette }) => palette.gray[90],
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ mb: 2 }}>{description}</Typography>
          <LinkWrapper title={link.title} />
        </Box>
      </Box>
    </CardWrapper>
  );
};

export const DashboardCard: FunctionComponent<
  DashboardCardProps | LoadingCardProps
> = (props) => {
  const { loading, variant = "primary" } = props;
  if (loading) {
    return <DashboardCardLoading variant={variant} />;
  }

  const {
    title,
    colorGradient,
    colorGradientOnHover,
    description,
    link,
    icon,
    CustomIcon,
  } = props;

  if (variant === "secondary") {
    const secondaryCardProps = {
      title,
      description,
      link,
      variant,
      icon,
      CustomIcon,
    };
    return <DashboardCardSecondary {...secondaryCardProps} />;
  }

  return (
    <CardWrapper href={link.href} onClick={link.onClick}>
      <Box
        sx={[
          cardContainerSharedStyles,
          (theme) => ({
            // @todo update theme config to include microShadow
            background: ({ palette }) => palette.common.white,
            boxShadow:
              "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
            borderRadius: 2,
            flexDirection: "column",
            border: `1px solid ${theme.palette.gray[20]}`,
            transition: theme.transitions.create("border-color"),

            "&:hover": {
              borderColor: theme.palette.gray[30],

              ".gradient:after": {
                opacity: 1,
              },
            },

            "&::after": {
              boxShadow: 2,
            },
          }),
        ]}
      >
        <Box
          className="gradient"
          sx={{
            background: colorGradient,
            borderRadius: 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            position: "relative",
            transform: "scaleX(-1)",

            "&::after": {
              content: `""`,
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background: colorGradientOnHover,
              opacity: 0,
              transition: ({ transitions }) => transitions.create("opacity"),
            },
          }}
          height={8}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            p: 4,
          }}
        >
          <Typography
            data-testid="dashboard-card-title"
            mb={1}
            sx={{ color: "gray.90" }}
            fontWeight="500"
            variant="bpHeading4"
          >
            {title}
          </Typography>
          <Typography mb={2} sx={{ color: "gray.80" }}>
            {description}
          </Typography>
          <LinkWrapper bold title={link.title} />
        </Box>
      </Box>
    </CardWrapper>
  );
};
