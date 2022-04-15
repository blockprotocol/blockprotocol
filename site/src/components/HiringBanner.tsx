import {
  faBullhorn,
  faArrowRight,
  faArrowsLeftRight,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Container, Typography } from "@mui/material";
import { FontAwesomeIcon } from "./icons";
import { Link } from "./Link";

export const HiringBanner = () => {
  return (
    <Link href="https://hash.ai/careers" tabIndex={0}>
      <Box
        sx={({ transitions }) => ({
          position: "relative",
          border: `1px solid #80ABFF`,
          py: 3.25,
          transition: transitions.create("opacity"),
          cursor: "pointer",
          background:
            "linear-gradient(90.78deg, #52C5F7 -2.72%, #6851F4 31.33%, #6249EF 100.36%)",
          "&:after": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: `linear-gradient(90.8deg, #52C5F7 8.95%, #6851F4 67.3%, #6249EF 117.05%)`,
            opacity: 0,
            transition: transitions.create("opacity"),
          },

          "&:hover:after": {
            opacity: 1,
          },
        })}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", lg: "center" },
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box
            sx={({ palette }) => ({
              height: 32,
              width: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: palette.teal[100],
              color: palette.purple[600],
              mr: { xs: 2, lg: 1 },
              flexShrink: 0,
            })}
          >
            <FontAwesomeIcon icon={faBullhorn} />
          </Box>

          <Box display="flex">
            <Typography
              variant="bpSmallCopy"
              sx={({ palette }) => ({
                color: palette.teal[200],
                fontWeight: "medium",
                mr: { xs: 0, md: 1.5 },
                mb: { xs: 1.5, md: 0 },
              })}
            >
              <Box component="span" mr="0.5ch">
                We're hiring full-stack TypeScript/React and PHP plugin
                developers to help grow the
              </Box>
              <Box
                component="span"
                display="inline-flex"
                alignItems="center"
                mr={1.5}
              >
                Block Protocol
                <FontAwesomeIcon
                  icon={faArrowsLeftRight}
                  sx={{ fontSize: "inherit", mx: "0.5ch" }}
                />
                WordPress ecosystem.
              </Box>

              <Typography
                component="span"
                variant="bpSmallCopy"
                color="currentcolor"
                sx={({ palette }) => ({
                  fontWeight: 700,
                  color: palette.gray[10],
                  lineHeight: 1.1,
                  display: { xs: "flex", md: "inline-flex" },
                  alignItems: "center",
                  borderBottom: `1px solid currentColor`,
                })}
              >
                Learn more
                <FontAwesomeIcon
                  icon={faArrowRight}
                  sx={{ ml: 0.5, fontSize: 14 }}
                />
              </Typography>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Link>
  );
};
