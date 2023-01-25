import { faArrowRight, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { Box, Container, Typography } from "@mui/material";

import { FontAwesomeIcon } from "./icons";
import { Link } from "./link";

export const ComingSoonBanner = () => {
  return (
    <Link href="/wordpress#availability" rel="noopener">
      <Box
        sx={({ transitions }) => ({
          position: "relative",
          borderTop: "1px solid #80ABFF",
          py: 2.375,
          transition: transitions.create("opacity"),
          cursor: "pointer",
          background: {
            xs: "linear-gradient(96.49deg, #52C5F7 -17.34%, #6249EF 38.34%)",
            lg: "linear-gradient(90.78deg, #52C5F7 -2.72%, #6851F4 31.33%, #6249EF 100.36%)",
          },
          "&:after": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: {
              xs: "linear-gradient(87.78deg, #52C5F7 0.78%, #6249EF 81.21%)",
              lg: "linear-gradient(90.8deg, #52C5F7 8.95%, #6851F4 67.3%, #6249EF 117.05%)",
            },
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
            alignItems: "center",
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
              alignSelf: { xs: "flex-start", lg: "center" },
              backgroundColor: palette.teal[100],
              color: palette.purple[600],
              mr: 2,
              flexShrink: 0,
            })}
          >
            <FontAwesomeIcon icon={faBullhorn} />
          </Box>

          <Box display="flex" alignItems="center" flexWrap="wrap">
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
                The current version of the &THORN; spec is about to be
                deprecated. Learn more about v0.3, arriving 28<sup>th</sup>{" "}
                February 2023.
              </Box>
            </Typography>
            <Typography
              component="span"
              variant="bpSmallCopy"
              color="currentcolor"
              sx={({ palette }) => ({
                fontWeight: 700,
                color: palette.gray[10],
                lineHeight: 1.1,
                display: { xs: "flex", md: "inline-flex" },
                width: "content",
                alignItems: "center",
                borderBottom: "1px solid currentColor",
                "&:hover": {
                  color: palette.gray[30],
                },
              })}
            >
              Learn more
              <FontAwesomeIcon
                icon={faArrowRight}
                sx={{ ml: 0.5, fontSize: 14 }}
              />
            </Typography>
          </Box>
        </Container>
      </Box>
    </Link>
  );
};
