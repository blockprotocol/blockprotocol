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

import { FontAwesomeIcon } from "../../icons";
import { faBinary } from "../../icons/fa/binary";
import { Link } from "../../link";

const defaultBrowseType = "blocks";

const HubListBrowseType = ({
  children,
  type,
}: {
  children: ReactNode;
  type: string;
}) => {
  const router = useRouter();
  const currentType = router.query.type ?? defaultBrowseType;
  const active = type === currentType;

  return (
    <Typography
      component={Link}
      scroll={false}
      href={{ query: type === defaultBrowseType ? {} : { type } }}
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
export const HubList = () => (
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
              Blocks are interactive components that can be used to view and/or
              edit information on a page
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
            Right
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);
