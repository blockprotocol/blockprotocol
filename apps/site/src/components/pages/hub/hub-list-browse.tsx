import { faAsterisk, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Box, Stack, svgIconClasses, Typography } from "@mui/material";
import { ReactNode, useMemo, useState } from "react";

import { HUB_SERVICES_ENABLED } from "../../../pages/hub.page";
import { FontAwesomeIcon } from "../../icons";
import { faBinary } from "../../icons/fa/binary";
import { faBoxesStacked } from "../../icons/fa/boxes-stacked";
import { Link } from "../../link";
import { useRouteHubBrowseType } from "./hub";
import { getHubBrowseQuery } from "./hub-utils";

const HubListBrowseType = ({
  children,
  type,
  onClick,
  active,
}: {
  children: ReactNode;
  type: string;
  onClick: () => void;
  active: boolean;
}) => {
  return (
    <Typography
      onClick={onClick}
      component={Link}
      scroll={false}
      href={{ query: getHubBrowseQuery(type) }}
      pl={1.5}
      sx={[
        (theme) => ({
          fontWeight: 500,
          color: theme.palette.gray[90],
          position: "relative",
          display: "flex",
          alignItems: "center",
          [`.${svgIconClasses.root}`]: {
            marginRight: 1,
            fontSize: 15,
            color: theme.palette.gray[50],
          },
        }),
        active &&
          ((theme) => ({
            fontWeight: 600,
            color: theme.palette.purple[70],

            [`.${svgIconClasses.root}`]: {
              color: "inherit",
            },
          })),
      ]}
    >
      {children}
    </Typography>
  );
};

type BrowseItem = {
  icon: IconDefinition;
  title: string;
  type: string;
};

const getBrowseItems = (): BrowseItem[] => [
  { icon: faBoxesStacked, type: "blocks", title: "Blocks" },
  { icon: faAsterisk, type: "types", title: "Types" },
  ...(HUB_SERVICES_ENABLED
    ? [{ icon: faBinary, type: "services", title: "Services" }]
    : []),
];

export const HubListBrowse = ({
  onBrowseClick,
}: {
  onBrowseClick: () => void;
}) => {
  const [overriddenActiveTypeIndex, setOverriddenActiveTypeIndex] =
    useState<number>();

  const browseItems = getBrowseItems();
  const currentType = useRouteHubBrowseType();

  const activeTypeIndex = useMemo(() => {
    if (typeof overriddenActiveTypeIndex === "number") {
      return overriddenActiveTypeIndex;
    }

    return browseItems.findIndex((item) => item.type === currentType) ?? 0;
  }, [browseItems, overriddenActiveTypeIndex, currentType]);

  return (
    <Stack spacing={1.25}>
      <Typography
        variant="bpSmallCaps"
        fontSize={14}
        color="#000"
        fontWeight={500}
      >
        Browse
      </Typography>
      <Box sx={{ position: "relative" }}>
        {browseItems.map(({ icon, title, type }, index) => (
          <HubListBrowseType
            active={index === activeTypeIndex}
            key={type}
            type={type}
            onClick={() => {
              setOverriddenActiveTypeIndex(index);
              onBrowseClick();
            }}
          >
            <FontAwesomeIcon icon={icon} /> {title}
          </HubListBrowseType>
        ))}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            height: `calc(100% / ${browseItems.length})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${100 * activeTypeIndex}%)`,
            transition: (theme) => theme.transitions.create("transform"),
          }}
        >
          <Box
            sx={{
              background: (theme) => theme.palette.purple[70],
              height: 12,
              width: 3,
              borderRadius: "8px",
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
};
