import { faAsterisk, faBoxes } from "@fortawesome/free-solid-svg-icons";
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
import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";

import { FontAwesomeIcon } from "../../icons";
import { faBinary } from "../../icons/fa/binary";
import { Link } from "../../link";
import { getHubBrowseQuery, getRouteHubBrowseType } from "./hub-utils";

export const useRouteHubBrowseType = () => {
  const router = useRouter();
  return getRouteHubBrowseType(router.query);
};

const HubItem = ({
  image,
  title,
  description,
  author,
  version,
  updated,
  url,
}: {
  image?: string | null;
  title: ReactNode;
  description: ReactNode;
  author: string;
  version: ReactNode;
  updated: ReactNode;
  url: string;
}) => (
  <Stack direction="row" spacing={2} alignItems="start">
    {image ? (
      <Link href={url}>
        <Box
          component="img"
          sx={{ width: 24 }}
          // @todo make this correct
          src={image}
        />
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
      <Typography
        variant="bpSmallCopy"
        color={(theme) => theme.palette.gray[80]}
        fontSize={15}
      >
        {description}
      </Typography>
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
          <Box>{updated}</Box>
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
          [`.${svgIconClasses.root}`]: { marginRight: 1, fontSize: 15 },
        }),
        active &&
          ((theme) => ({
            fontWeight: 600,
            color: theme.palette.purple[70],

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
        <FontAwesomeIcon icon={faBoxes} /> Blocks
      </HubListBrowseType>
      <HubListBrowseType type="types">
        <FontAwesomeIcon icon={faAsterisk} /> Types
      </HubListBrowseType>
      <HubListBrowseType type="services">
        <FontAwesomeIcon icon={faBinary} /> Services
      </HubListBrowseType>
    </Stack>
  );
};
export const HubList = ({ listing }: { listing: BlockMetadata[] }) => {
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
            >
              <HubListBrowse />
            </Grid>
            <Grid item xs={9} pt={6.5} pb={6.5}>
              <Typography variant="bpHeading3" fontWeight={500} mb={2}>
                Blocks
              </Typography>
              <Typography>
                Blocks are interactive components that can be used to view
                and/or edit information on a page
              </Typography>
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
            >
              Left
            </Grid>
            <Grid item xs={9} pt={6.5} pb={9}>
              <Stack spacing={6}>
                {listing.map((item) => (
                  <HubItem
                    key={item.pathWithNamespace}
                    image={item.icon}
                    author={item.author}
                    title={item.displayName}
                    description={item.description}
                    updated={item.lastUpdated}
                    version={item.version}
                    url={item.blockSitePath}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
