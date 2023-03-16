import { faAsterisk, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  Hidden,
  Stack,
  svgIconClasses,
  Tab,
  Tabs,
  tabsClasses,
  Typography,
} from "@mui/material";
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
      sx={[
        (theme) => ({
          px: 1.25,
          height: 24,
          fontWeight: 500,
          color: theme.palette.gray[90],
          position: "relative",
          display: "flex",
          alignItems: "center",
          lineHeight: 1.5,
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

const HubListTabs = ({
  activeIndex,
  items,
  onChange,
  mobile = false,
}: {
  activeIndex: number;
  items: BrowseItem[];
  onChange: (index: number) => void;
  mobile?: boolean;
}) => (
  <Tabs
    orientation={mobile ? "horizontal" : "vertical"}
    value={activeIndex}
    sx={({ breakpoints }) => ({
      display: "flex",
      minHeight: 0,
      gap: 1,
      [`.${tabsClasses.indicator}`]: {
        borderRadius: 2,
        background: (theme) => theme.palette.purple[70],
        height: "3px !important",
        [breakpoints.up("sm")]: {
          left: 0,
          right: "unset",
          height: "12px !important",
          width: "3px !important",
          marginY: 0.875,
        },
      },
    })}
  >
    {items.map(({ icon, title, type }, index) => (
      <Tab
        key={type}
        label={
          <HubListBrowseType
            active={index === activeIndex}
            type={type}
            onClick={() => {
              onChange(index);
            }}
          >
            <FontAwesomeIcon icon={icon} /> {title}
          </HubListBrowseType>
        }
        sx={({ breakpoints }) => ({
          width: "min-content",
          minHeight: 0,
          p: 0,
          [breakpoints.down("sm")]: {
            mb: 1,
          },
        })}
      />
    ))}
  </Tabs>
);

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
      <Stack
        sx={{
          position: "relative",
        }}
      >
        <Hidden smDown>
          <HubListTabs
            activeIndex={activeTypeIndex}
            items={browseItems}
            onChange={(index) => {
              setOverriddenActiveTypeIndex(index);
              onBrowseClick();
            }}
          />
        </Hidden>

        <Hidden smUp>
          <HubListTabs
            activeIndex={activeTypeIndex}
            items={browseItems}
            onChange={(index) => {
              setOverriddenActiveTypeIndex(index);
              onBrowseClick();
            }}
            mobile
          />
        </Hidden>
      </Stack>
    </Stack>
  );
};
