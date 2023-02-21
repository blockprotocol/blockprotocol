import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Container,
  Grid,
  Stack,
  svgIconClasses,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { HUB_SERVICES_ENABLED } from "../../../pages/hub.page";
import { FontAwesomeIcon } from "../../icons";
import { faBinary } from "../../icons/fa/binary";
import { faBoxesStacked } from "../../icons/fa/boxes-stacked";
import { ClientOnlyLastUpdated } from "../../last-updated";
import { Link } from "../../link";
import { getHubBrowseQuery, getRouteHubBrowseType } from "./hub-utils";

export const useRouteHubBrowseType = () => {
  const router = useRouter();
  return getRouteHubBrowseType(router.query);
};

export type HubItemDescription = {
  image?: string | null;
  title: string;
  description?: string;
  author: string;
  version: string;
  updated?: string;
  url: string;
};

const HubItem = ({
  item: { image, title, description, author, version, updated, url },
}: {
  item: HubItemDescription;
}) => (
  <Stack direction="row" spacing={2} alignItems="start">
    {image ? (
      <Link href={url}>
        <Box component="img" sx={{ width: 24 }} src={image} />
      </Link>
    ) : null}
    <Stack spacing={0.75}>
      <Typography
        component={Link}
        href={url}
        fontSize={18}
        fontWeight={600}
        lineHeight={1.2}
        color={(theme) => theme.palette.gray[90]}
      >
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="bpSmallCopy"
          color={(theme) => theme.palette.gray[80]}
          fontSize={15}
        >
          {description}
        </Typography>
      ) : null}
      <Typography
        component="div"
        fontSize={14}
        color={(theme) => theme.palette.gray[70]}
      >
        <Stack direction="row" spacing={2}>
          <Box
            component={Link}
            href={`/@${author}`}
            color={(theme) => theme.palette.purple[70]}
            fontWeight={700}
            sx={{ borderBottom: "0 !important" }}
          >
            @{author}
          </Box>
          <Box>V{version}</Box>
          {updated ? (
            <Box>
              <ClientOnlyLastUpdated value={updated} />
            </Box>
          ) : null}
        </Stack>
      </Typography>
    </Stack>
  </Stack>
);

const HubListBrowseType = ({
  children,
  type,
}: {
  children: ReactNode;
  type: string;
}) => {
  const currentType = useRouteHubBrowseType();
  const active = type === currentType;

  return (
    <Typography
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

            "&:before": {
              position: "absolute",
              content: `""`,
              display: "block",
              background: "currentColor",
              height: 12,
              top: "50%",
              transform: "translateY(-50%)",
              left: 0,
              width: 3,
              borderRadius: "8px",
            },
          })),
      ]}
    >
      {children}
    </Typography>
  );
};
const HubListBrowse = () => {
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
      <HubListBrowseType type="blocks">
        <FontAwesomeIcon icon={faBoxesStacked} /> Blocks
      </HubListBrowseType>
      <HubListBrowseType type="types">
        <FontAwesomeIcon icon={faAsterisk} /> Types
      </HubListBrowseType>
      {HUB_SERVICES_ENABLED ? (
        <HubListBrowseType type="services">
          <FontAwesomeIcon icon={faBinary} /> Services
        </HubListBrowseType>
      ) : null}
    </Stack>
  );
};

const HubHeading = ({ children }: { children: ReactNode }) => (
  <Typography
    variant="bpHeading3"
    fontWeight={500}
    color={(theme) => theme.palette.gray[80]}
  >
    {children}
  </Typography>
);

const HubSubHeading = ({ children }: { children: ReactNode }) => (
  <Typography mt={2} color={(theme) => theme.palette.gray[80]}>
    {children}
  </Typography>
);

const HubBrowseHeaderComponents = {
  blocks: () => {
    return (
      <>
        <HubHeading>Blocks</HubHeading>
        <HubSubHeading>
          Blocks are interactive components that can be used to view and/or edit
          information on a page
        </HubSubHeading>
      </>
    );
  },
  types: () => {
    return (
      <>
        <HubHeading>Types</HubHeading>
        <HubSubHeading>
          Types provide a standardized way of describing things, and can used by
          blocks and services
        </HubSubHeading>
      </>
    );
  },
  services: () => {
    return <HubHeading>Services</HubHeading>;
  },
};

const HubBrowseHeader = () => {
  const browseType = useRouteHubBrowseType();
  const HeadingComponent =
    browseType in HubBrowseHeaderComponents
      ? HubBrowseHeaderComponents[
          browseType as keyof typeof HubBrowseHeaderComponents
        ]
      : null;

  return HeadingComponent ? <HeadingComponent /> : null;
};

export const HubList = ({ listing }: { listing: HubItemDescription[] }) => {
  return (
    <>
      <Box
        sx={(theme) => ({
          borderBottom: 1,
          borderColor: theme.palette.gray[30],
        })}
      >
        <Container>
          <Grid container columnSpacing={6}>
            <Grid
              item
              xs={3}
              sx={(theme) => ({
                borderRight: 1,
                borderColor: theme.palette.gray[30],
              })}
              pt={6.5}
              pb={5}
            >
              <HubListBrowse />
            </Grid>
            <Grid item xs={9} pt={6.5} pb={6.5}>
              <HubBrowseHeader />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box>
        <Container>
          <Grid container columnSpacing={6}>
            <Grid
              item
              xs={3}
              sx={(theme) => ({
                borderRight: 1,
                borderColor: theme.palette.gray[30],
              })}
              pt={6.5}
            />
            <Grid item xs={9} pt={6.5} pb={9}>
              <Stack spacing={6}>
                {listing.map((item) => (
                  <HubItem key={item.url} item={item} />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
