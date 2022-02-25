import { VFC } from "react";
import {
  Typography,
  Box,
  Icon,
  BoxProps,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "./Link";
import { SiteMapPage } from "../lib/sitemap";

const NavArrowIcon = styled(Icon)(({ theme }) => ({
  color: theme.palette.purple[300],
  fontSize: 15,
  marginTop: theme.spacing(0.8),
  position: "relative",
  left: 0,
  transition: theme.transitions.create("left"),
}));

type PageNavLinksProps = {
  prevPage?: SiteMapPage;
  nextPage?: SiteMapPage;
} & BoxProps;

export const PageNavLinks: VFC<PageNavLinksProps> = ({
  prevPage,
  nextPage,
  ...boxProps
}) => {
  const theme = useTheme();
  const hideIcons = useMediaQuery(theme.breakpoints.down(1050));

  return (
    <Box display="flex" justifyContent="space-between" {...boxProps}>
      <Box>
        {prevPage && (
          <Box display="flex" alignItems="flex-end">
            <Box>
              <Typography
                sx={{ color: theme.palette.gray[70] }}
                component="p"
                variant="bpSmallCopy"
              >
                Previous
              </Typography>
              <Box
                display="flex"
                sx={{
                  marginLeft: hideIcons ? 0 : "-31px",
                  "& svg": {
                    display: hideIcons ? "none" : "inherit",
                    ":hover": {
                      left: `-${theme.spacing(1)}`,
                    },
                  },
                }}
              >
                <NavArrowIcon
                  sx={{
                    marginRight: 2,
                  }}
                  className="fas fa-arrow-left"
                />
                <Link
                  sx={{
                    maxWidth: hideIcons ? 150 : 200,
                    ":hover": {
                      color: theme.palette.purple[800],
                    },
                  }}
                  href={prevPage.href}
                >
                  {prevPage.title}
                </Link>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box>
        {nextPage && (
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography
              sx={{ color: theme.palette.gray[70] }}
              component="p"
              variant="bpSmallCopy"
            >
              Next
            </Typography>
            <Box
              display="flex"
              sx={{
                marginRight: hideIcons ? 0 : "-31px",
                "& svg": {
                  display: hideIcons ? "none" : "inherit",
                  ":hover": {
                    left: theme.spacing(1),
                  },
                },
              }}
            >
              <Link
                sx={{
                  textAlign: "right",
                  maxWidth: hideIcons ? 150 : 200,
                  ":hover": {
                    color: theme.palette.purple[800],
                  },
                }}
                href={nextPage.href}
              >
                {nextPage.title}
              </Link>
              <NavArrowIcon
                sx={{
                  marginLeft: 2,
                }}
                className="fas fa-arrow-right"
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
