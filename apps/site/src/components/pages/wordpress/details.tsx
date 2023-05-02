import { Box, Container, Grid, Typography } from "@mui/material";

import {
  ArrowUpRightIcon,
  BlockProtocolIcon,
  GlobeIcon,
  MagicIcon,
  RightPointerIcon,
  TelescopeIcon,
} from "../../icons";
import { CustomButton } from "./custom-button";
import { DetailsSection } from "./details-section";

export const Details = () => {
  return (
    <Box
      sx={{
        background:
          "radial-gradient(116.02% 95.04% at 50% 100.79%, #F3F0F9 0%, #FFFFFF 70.54%)",
        pb: "11rem",
        borderBottom: `1px solid #edeaf1`,
        position: "relative",
      }}
    >
      <Container
        sx={{
          mb: 10,
          width: { xs: "95%", md: "75%", lg: "80%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Inter",
        }}
      >
        <Grid
          container
          sx={({ breakpoints }) => ({
            [breakpoints.down("lg")]: {
              pt: 2,
              maxWidth: 500,
              margin: "auto",
            },
          })}
          columnSpacing={{ xs: 0, lg: 10 }}
          rowSpacing={{ xs: 3, lg: 6.875 }}
        >
          <DetailsSection xs={12} lg={6}>
            <Typography variant="bpTitle" sx={{ fontSize: "1rem" }}>
              <strong>NEXT-GENERATION</strong>
            </Typography>
            <Typography
              variant="bpTitle"
              sx={{ fontSize: "2.6rem", color: "#6048E5", fontStyle: "italic" }}
            >
              AI Blocks
            </Typography>
            <Box
              sx={{
                fontSize: "1rem",
                mt: "20px",
              }}
            >
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  The best <strong>AI text</strong> generation, style, tone,
                  grammar and editing blocks for WordPress
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  Powerful <strong>AI image generation</strong> blocks let you
                  illustrate posts in seconds
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  Advanced <strong>AI image editing</strong> blocks let you
                  remove watermarks from photos, or remove/replace the
                  backgrounds of product photos in WooCommerce
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography component="div">
                  Best-in-class <strong>AI chat</strong> block lets you persist
                  chats, publish them on your website, branch off mid-way from
                  prior conversations, set the AI’s response style and more
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  Switch between AI models and providers at will
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography component="div">
                  <strong>
                    <Typography
                      display="inline"
                      sx={{ color: "#6048E5", fontWeight: 700 }}
                    >
                      Free credits
                    </Typography>{" "}
                    for all models and providers
                  </strong>
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  sm: "column",
                  md: "row",
                },
                mt: "8px",
              }}
            >
              <CustomButton
                endIcon={<TelescopeIcon />}
                buttonLabel="Preview the AI blocks"
                backgroundColor="#F4F3FF"
                color="#3A2084"
                sx={{
                  height: "40px",
                  border: "1px solid #EFEBFE",
                  fontSize: "14px",
                  mr: "8px",
                  minHeight: "40px",
                  p: "8px, 18px, 8px, 18px",
                  mb: { xs: 1, md: 0 },
                }}
              />
              <CustomButton
                buttonLabel="Get these blocks"
                sx={{
                  height: "40px",
                  fontSize: "14px",
                  minHeight: "40px",
                  p: "8px, 18px, 8px, 18px",
                }}
              />
            </Box>
          </DetailsSection>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              alignSelf: "center",
              justifySelf: "center",
            }}
            component="img"
            src="/assets/wp_bp_ai_cover.png"
          />
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              alignSelf: "center",
              justifySelf: "left",
            }}
            component="img"
            src="/assets/wp_bp_seo_cover.png"
          />
          <DetailsSection xs={12} lg={6}>
            <Typography variant="bpTitle" sx={{ fontSize: "1rem" }}>
              <strong>LEVEL UP YOUR SEO</strong>
            </Typography>
            <Typography
              variant="bpTitle"
              sx={{ fontSize: "2.6rem", fontStyle: "italic", fontWeight: 700 }}
              component="div"
            >
              <Typography
                component="span"
                sx={{
                  background:
                    "linear-gradient(94.72deg, rgba(235,0,255,1) 6%, rgba(255,122,0,1) 70%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  fontSize: "2.6rem",
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
              >
                Super
              </Typography>
              <Typography
                component="span"
                sx={{
                  background:
                    "linear-gradient(92.01deg, rgba(255,145,65,1) 25%, rgba(116,7,255,1) 100%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  fontSize: "2.6rem",
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
              >
                -
              </Typography>
              <Typography
                component="span"
                sx={{
                  color: "#6048E5",
                  fontSize: "2.6rem",
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
              >
                structured data
              </Typography>
              {" comes to WordPress"}
            </Typography>
            <Box
              sx={{
                fontSize: "1rem",
                mt: "20px",
              }}
            >
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography component="div">
                  <strong>
                    Turn WordPress into a powerful{" "}
                    <Typography display="inline" sx={{ color: "#6048E5" }}>
                      <strong>entity graph</strong>
                    </Typography>{" "}
                    and unlock a whole range of new functionality.
                  </strong>{" "}
                  Go beyond Custom Post Types and Advanced Custom Fields with a
                  graph of entities, all with their own properties and connected
                  by links
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <ArrowUpRightIcon
                  sx={{ scale: "0.7 !important", color: "#6F59EC" }}
                />
                <Typography component="div">
                  <strong>
                    <Typography sx={{ color: "#6F59EC", fontWeight: "700px" }}>
                      <strong>COMING SOON</strong>
                    </Typography>
                    Improve your search rankings
                  </strong>{" "}
                  by leveraging structured data (SEO) blocks that take context
                  from their surroundings and dynamically generating whole-page
                  JSON-LD based on related information{" "}
                  <Typography sx={{ color: "#758AA1" }}>
                    (e.g. offers in WooCommerce, or tickets for an event)
                  </Typography>
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <ArrowUpRightIcon
                  sx={{ scale: "0.7 !important", color: "#6F59EC" }}
                />
                <Typography component="div">
                  <strong>
                    <Typography sx={{ color: "#6F59EC", fontWeight: "700" }}>
                      PLANNED
                    </Typography>
                    Build apps on top of your structured data,
                  </strong>{" "}
                  turning WordPress from a CMS into a fully-fledged app builder
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  sm: "column",
                  md: "row",
                },
                mt: "8px",
              }}
            >
              <CustomButton
                endIcon={<MagicIcon />}
                buttonLabel="Learn more about the benefits"
                backgroundColor="#F4F3FF"
                color="#3A2084"
                sx={{
                  height: "40px",
                  border: "1px solid #EFEBFE",
                  fontSize: "14px",
                  mr: "8px",
                  minHeight: "40px",
                  p: "8px, 18px, 8px, 18px",
                  mb: { xs: 1, md: 0 },
                }}
              />
              <CustomButton
                buttonLabel="Get started"
                sx={{
                  height: "40px",
                  fontSize: "14px",
                  minHeight: "40px",
                  p: "8px, 18px, 8px, 18px",
                }}
              />
            </Box>
          </DetailsSection>
          <DetailsSection xs={12} lg={6}>
            <Typography variant="bpTitle" sx={{ fontSize: "1rem" }}>
              <strong>SUPERCHARGE YOUR WEBSITE</strong>
            </Typography>
            <Typography
              variant="bpTitle"
              sx={{ fontSize: "2.6rem", fontStyle: "italic" }}
              component="div"
            >
              <Typography
                sx={{
                  color: "#6048E5",
                  fontSize: "2.6rem",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                <strong>Powerful API services</strong>
              </Typography>
              without the fuss
            </Typography>
            <Box
              sx={{
                fontSize: "1rem",
                mt: "20px",
              }}
            >
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  Access OpenAI, Mapbox, and other powerful APIs{" "}
                  <strong>
                    directly within WordPress, with zero extra steps
                  </strong>
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  <strong>Everything is handled by the Block Protocol.</strong>{" "}
                  No need to share card details, obtain API keys, or set up an
                  account with any other service provider.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  Generous free allowances with all providers let you try out
                  blocks and use them in WordPress
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <ArrowUpRightIcon
                  sx={{ scale: "0.7 !important", color: "#6F59EC" }}
                />
                <Typography component="div">
                  <strong>
                    <Typography sx={{ color: "#6F59EC", fontWeight: 700 }}>
                      COMING SOON
                    </Typography>
                    Sync data from external apps into WordPress
                  </strong>{" "}
                  through blocks that authenticate as you with external services
                  such as Notion, Coda, and Zapier.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  sm: "column",
                  md: "row",
                },
                mt: "8px",
              }}
            >
              <CustomButton
                endIcon={<GlobeIcon />}
                buttonLabel="Browse all services"
                backgroundColor="#F4F3FF"
                color="#3A2084"
                sx={{
                  height: "40px",
                  border: "1px solid #EFEBFE",
                  fontSize: "14px",
                  mr: "8px",
                  minHeight: "40px",
                  p: "8px, 18px, 8px, 18px",
                  mb: { xs: 1, md: 0 },
                }}
              />
              <CustomButton
                buttonLabel="Access for free"
                sx={{
                  height: "40px",
                  fontSize: "14px",
                  minHeight: "40px",
                  p: "8px, 18px, 8px, 18px",
                }}
              />
            </Box>
          </DetailsSection>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              alignSelf: "center",
              justifySelf: "right",
            }}
            component="img"
            src="/assets/wp_bp_api_cover.png"
          />
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              alignSelf: "center",
              justifySelf: "left",
            }}
            component="img"
            src="/assets/wp_bp_blocks_cover.png"
          />
          <DetailsSection xs={12} lg={6}>
            <Typography variant="bpTitle" sx={{ fontSize: "1rem" }}>
              <strong>TONS MORE BENEFITS</strong>
            </Typography>
            <Typography
              variant="bpTitle"
              sx={{ fontSize: "2.6rem", fontStyle: "italic" }}
              component="div"
            >
              <Typography
                variant="bpTitle"
                sx={{
                  color: "#6048E5",
                  fontSize: "2.6rem",
                  fontStyle: "italic",
                }}
              >
                Instant access to
              </Typography>
              infinite blocks
            </Typography>
            <Box
              sx={{
                fontSize: "1rem",
                mt: "20px",
              }}
            >
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  <strong>
                    Discover and insert new blocks at the point of need
                  </strong>{" "}
                  from the normal block insertion menu built into WordPress
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography component="div">
                  <strong>
                    New blocks are instantly available within WordPress
                  </strong>{" "}
                  without having to update the plugin, or install additional
                  plugins{" "}
                  <Typography sx={{ color: "#758AA1" }}>
                    (as is required for Gutenberg blocks)
                  </Typography>
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  The Block Protocol is an open-source ecosystem of blocks that
                  anybody can contribute to
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px" }}>
                <RightPointerIcon />
                <Typography>
                  <strong>
                    You can use Block Protocol blocks in any{" "}
                    <BlockProtocolIcon
                      gradient
                      sx={{ scale: "0.6 !important" }}
                    />
                    -enabled environment,
                  </strong>{" "}
                  not just WordPress
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  sm: "column",
                  md: "row",
                },
                mt: "8px",
              }}
            >
              <CustomButton
                buttonLabel="Get the plugin for free"
                sx={{
                  height: "40px",
                  fontSize: "14px",
                  minHeight: "40px",
                  p: "8px, 18px, 8px, 18px",
                }}
              />
            </Box>
          </DetailsSection>
        </Grid>
      </Container>
    </Box>
  );
};
