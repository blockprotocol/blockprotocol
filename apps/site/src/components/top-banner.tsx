import { faArrowRight, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { Box, Container, Typography } from "@mui/material";

import { FontAwesomeIcon } from "./icons";
import { Link } from "./link";

const ANNOUNCEMENT_URL = "https://hash.dev/blog/tech-tree#roadmap-update";

export const TopBanner = () => {
  return (
    <Box
      sx={({ transitions, zIndex }) => ({
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: zIndex.appBar + 2,
        height: "var(--banner-height)",
        display: "flex",
        alignItems: "center",
        transition: transitions.create("opacity"),
        background: {
          xs: "linear-gradient(96.49deg, #52C5F7 -17.34%, #6249EF 38.34%)",
          lg: "linear-gradient(90.78deg, #52C5F7 -2.72%, #6851F4 31.33%, #6249EF 100.36%)",
        },
      })}
    >
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={({ palette }) => ({
            height: 28,
            width: 28,
            borderRadius: "50%",
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: palette.teal[100],
            color: palette.purple[600],
            mr: 1.5,
            flexShrink: 0,
          })}
        >
          <FontAwesomeIcon icon={faBullhorn} sx={{ fontSize: 13 }} />
        </Box>

        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          justifyContent="center"
          sx={{ gap: { xs: 0.5, md: 1.25 }, textAlign: "center" }}
        >
          <Typography
            variant="bpSmallCopy"
            sx={({ palette }) => ({
              color: palette.teal[200],
              fontWeight: "medium",
              fontSize: { xs: 13, md: 14 },
              lineHeight: 1.3,
            })}
          >
            Work on version 0.4 of the Block Protocol has been paused.
          </Typography>
          <Link
            href={ANNOUNCEMENT_URL}
            target="_blank"
            rel="noopener"
            sx={({ palette, transitions }) => ({
              display: "inline-flex",
              alignItems: "center",
              color: palette.gray[10],
              fontWeight: 700,
              fontSize: { xs: 13, md: 14 },
              lineHeight: 1.3,
              borderBottom: "1px solid currentColor",
              transition: transitions.create("color"),
              "&:hover": {
                color: palette.gray[30],
              },
            })}
          >
            Read the announcement
            <FontAwesomeIcon
              icon={faArrowRight}
              sx={{ ml: 0.5, fontSize: 13 }}
            />
          </Link>
        </Box>
      </Container>
    </Box>
  );
};
