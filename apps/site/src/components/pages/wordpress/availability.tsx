import { Box, Container, List, ListItem, Typography } from "@mui/material";
import { RoadIcon } from "../../icons";
import { BpWpIcons } from "./bp-wp-icons";
import { EarlyAccessCTA } from "./early-access-cta";

export const Availability = () => {
  return (
    <Container
      sx={{
        mb: 10,
        maxWidth: { xs: "95%", md: "75%", lg: "60%" },
        fontFamily: "Inter",
      }}
    >
      <Typography
        sx={{ fontSize: "2rem", lineHeight: 1, fontWeight: 900, mb: 1 }}
      >
        General Availability
      </Typography>

      <Typography
        component="div"
        sx={{
          fontSize: "2rem",
          lineHeight: 1,
          color: ({ palette }) => palette.gray[50],
        }}
      >
        The <strong>0.3 spec</strong> and{" "}
        <Box sx={{ display: "inline-block", whiteSpace: "nowrap" }}>
          <BpWpIcons />
        </Box>{" "}
        <strong>plugin</strong> will ship in early 2023
      </Typography>

      <Box
        sx={({ breakpoints }) => ({
          display: "flex",
          pt: 4,
          alignItems: "center",
          gap: 7.25,
          [breakpoints.down("lg")]: {
            gap: 3,
            flexDirection: "column",
          },
        })}
      >
        <Box flex={1}>
          <Typography sx={{ lineHeight: 1.2, maxWidth: "unset", pb: 2.25 }}>
            The <strong>Þ WordPress plugin</strong> will be launched alongside{" "}
            <strong>version 0.3</strong> of the
            <strong>Þ</strong> specification, our largest-ever update that
            builds on almost a year of community consultation and block
            development.
          </Typography>

          <Typography sx={{ lineHeight: 1.2, maxWidth: "unset" }}>
            <strong>Our Þ 0.3 update includes:</strong>
          </Typography>
          <List sx={{ p: 0, pb: 2.25 }}>
            <ListItem sx={{ p: 0, pl: 1 }}>
              &#x2022;
              <Typography sx={{ lineHeight: 1.2, maxWidth: "unset", pl: 1 }}>
                A major overhaul of the Core and Graph Service specifications
              </Typography>
            </ListItem>
            <ListItem sx={{ p: 0, pl: 1 }}>
              &#x2022;
              <Typography sx={{ lineHeight: 1.2, maxWidth: "unset", pl: 1 }}>
                A more composable and powerful type system
              </Typography>
            </ListItem>
            <ListItem sx={{ p: 0, pl: 1 }}>
              &#x2022;
              <Typography sx={{ lineHeight: 1.2, maxWidth: "unset", pl: 1 }}>
                The ability to attach metadata to link between entities
              </Typography>
            </ListItem>
          </List>

          <Typography sx={{ lineHeight: 1.2, maxWidth: "unset" }}>
            <strong>
              We&#8217;re now onboarding beta testers to use the Þ WordPress
              plugin.
            </strong>{" "}
            If you&#8217;d like to receive early access, enter your email
            address below.
          </Typography>

          <Box
            sx={({ breakpoints }) => ({
              mt: 3,
              display: "none",
              [breakpoints.up("lg")]: {
                display: "block",
              },
            })}
          >
            <EarlyAccessCTA />
          </Box>
        </Box>

        <Box
          sx={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <RoadIcon
            sx={{
              width: 1,
              height: 1,
              color: ({ palette }) => palette.purple[20],
              minWidth: 180,
            }}
          />
        </Box>
      </Box>

      <Box
        sx={({ breakpoints }) => ({
          mt: 3,
          display: "none",
          justifyContent: "center",
          [breakpoints.down("lg")]: {
            display: "flex",
          },
        })}
      >
        <EarlyAccessCTA />
      </Box>
    </Container>
  );
};
