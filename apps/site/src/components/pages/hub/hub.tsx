import {
  Box,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { ClientOnlyLastUpdated } from "../../last-updated";
import { Link } from "../../link";
import { VerifiedBadge } from "../../verified-badge";
import { HubListBrowse } from "./hub-list-browse";
import {
  fadeInChildren,
  fadeInWrapper,
  getRouteHubBrowseType,
  useRouteChangingWithTrigger as useRouteChangingWithListener,
} from "./hub-utils";

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
  verified?: boolean;
};

const HubItem = ({
  item: { image, title, description, author, version, updated, url, verified },
}: {
  item: HubItemDescription;
}) => (
  <Stack direction="row" spacing={2} alignItems="start">
    {image ? (
      <Link href={url}>
        <Box component="img" sx={{ width: 24, minWidth: 24 }} src={image} />
      </Link>
    ) : null}
    <Stack spacing={0.75}>
      <Typography
        component={Link}
        href={url}
        fontSize={18}
        fontWeight={600}
        lineHeight={1.2}
        sx={{ color: "gray.90" }}
      >
        {title}
        {!!verified && <VerifiedBadge compact />}
      </Typography>
      {description ? (
        <Typography
          variant="bpSmallCopy"
          sx={{
            color: (theme) => theme.palette.gray[80],
            display: "-webkit-box",
            "-webkit-line-clamp": "2",
            "-webkit-box-orient": "vertical",
            overflow: "hidden",
            minWidth: 0,
            fontSize: 15,
            fontWeight: 400,
          }}
        >
          {description}
        </Typography>
      ) : null}
      <Typography component="div" fontSize={14} sx={{ color: "gray.70" }}>
        <Stack direction="row" spacing={2}>
          <Box
            component={Link}
            href={`/@${author}`}
            sx={{ color: "purple.70", borderBottom: "0 !important" }}
            fontWeight={700}
          >
            @{author}
          </Box>
          <Box>{version}</Box>
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

const HubItemLoading = () => (
  <Stack direction="row" spacing={2}>
    <Skeleton variant="rounded" width={24} height={24} />
    <Stack spacing={0.75} flex={1}>
      <Typography fontSize={18} lineHeight={1.2}>
        <Skeleton width="40%" />
      </Typography>

      <Typography variant="bpSmallCopy" fontSize={15}>
        <Skeleton width="70%" />
      </Typography>

      <Typography fontSize={14}>
        <Skeleton width={200} />
      </Typography>
    </Stack>
  </Stack>
);

const AnimatedTypography = m(Typography);

const HubHeaderWrapper = ({ children }: { children: ReactNode }) => (
  <m.div variants={fadeInWrapper} initial="hidden" animate="show">
    {children}
  </m.div>
);

const HubHeading = ({ children }: { children: ReactNode }) => (
  <AnimatedTypography
    variants={fadeInChildren}
    variant="bpHeading3"
    fontWeight={500}
    sx={{ color: "gray.80" }}
  >
    {children}
  </AnimatedTypography>
);

const HubSubHeading = ({ children }: { children: ReactNode }) => (
  <AnimatedTypography
    variants={fadeInChildren}
    mt={2}
    sx={{ color: "gray.80" }}
    fontSize={21}
  >
    {children}
  </AnimatedTypography>
);

const HubBrowseHeaderComponents = {
  blocks: () => {
    return (
      <HubHeaderWrapper>
        <HubHeading>Blocks</HubHeading>
        <HubSubHeading>
          Blocks are interactive components that can be used to view and/or edit
          information on a page
        </HubSubHeading>
      </HubHeaderWrapper>
    );
  },
  types: () => {
    return (
      <HubHeaderWrapper>
        <HubHeading>Types</HubHeading>
        <HubSubHeading>
          Types provide a standardized way of describing things, and can used by
          blocks and services
        </HubSubHeading>
      </HubHeaderWrapper>
    );
  },
  services: () => {
    return (
      <HubHeaderWrapper>
        <HubHeading>Services</HubHeading>
      </HubHeaderWrapper>
    );
  },
};

const HubBrowseHeaderLoading = () => {
  return (
    <>
      <HubHeading>
        <Skeleton width={150} />
      </HubHeading>
      <HubSubHeading>
        <Skeleton width="100%" />
        <Skeleton width="100%" />
      </HubSubHeading>
    </>
  );
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
  const browseType = useRouteHubBrowseType();

  const [routeChanging, listenRouteChange] = useRouteChangingWithListener();

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
              xs={12}
              sm={3}
              sx={({ breakpoints, palette }) => ({
                pb: { xs: 2, sm: 5 },
                pt: 6.5,
                [breakpoints.up("sm")]: {
                  borderRight: 1,
                  borderColor: palette.gray[30],
                },
              })}
            >
              <HubListBrowse onBrowseClick={listenRouteChange} />
            </Grid>
            <Grid item xs={12} sm={9} sx={{ pt: { xs: 2, sm: 6.5 }, pb: 6.5 }}>
              {routeChanging ? <HubBrowseHeaderLoading /> : <HubBrowseHeader />}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box>
        <Container>
          <Grid container columnSpacing={6}>
            <Grid
              item
              xs={12}
              sm={3}
              sx={({ breakpoints, palette }) => ({
                display: "none",
                [breakpoints.up("sm")]: {
                  display: "block",
                  borderRight: 1,
                  borderColor: palette.gray[30],
                },
              })}
              pt={6.5}
            />
            <Grid item xs={12} sm={9} pt={6.5} pb={9}>
              {routeChanging ? (
                <Stack gap={6}>
                  <HubItemLoading />
                  <HubItemLoading />
                  <HubItemLoading />
                  <HubItemLoading />
                </Stack>
              ) : (
                <Box
                  key={browseType}
                  component={m.div}
                  variants={fadeInWrapper}
                  initial="hidden"
                  animate="show"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {listing.map((item) => (
                    <m.div key={item.url} variants={fadeInChildren}>
                      <HubItem item={item} />
                    </m.div>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
