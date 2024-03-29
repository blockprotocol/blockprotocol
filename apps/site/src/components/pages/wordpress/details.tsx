import { Stream } from "@cloudflare/stream-react";
import { Box, Container, Grid, Skeleton, Typography } from "@mui/material";
import { useState } from "react";

import {
  ArrowUpRightIcon,
  GlobeIcon,
  MagicIcon,
  RightPointerIcon,
  TelescopeIcon,
} from "../../icons";
import { CustomLinkButton } from "./custom-link-button";
import { DetailsSection } from "./details-section";

export const Details = () => {
  const [loading, setLoading] = useState(true);

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
              maxWidth: 500,
              margin: "auto",
            },
          })}
          columnSpacing={{ xs: 0, lg: 10 }}
          rowSpacing={{ xs: 3, lg: 6.875 }}
        >
          <DetailsSection xs={12} lg={6} order={{ xs: 2, lg: 1 }}>
            <Typography
              variant="bpHeading6"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: ({ palette }) => palette.black,
                letterSpacing: "0.05em",
                lineHeight: 1.3,
              }}
            >
              NEXT-GENERATION
            </Typography>
            <Typography
              variant="bpTitle"
              sx={{
                fontSize: "2.625rem",
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                fontWeight: 700,
                color: ({ palette }) => palette.purple[700],
              }}
            >
              AI Blocks
            </Typography>
            <Box
              sx={{
                fontSize: "1rem",
                mt: "20px",
              }}
            >
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography>
                  The best <strong>AI text</strong> generation, style, tone,
                  grammar and editing blocks for WordPress
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000">
                  Powerful <strong>AI image generation</strong> blocks let you
                  illustrate posts in seconds
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000">
                  Advanced <strong>AI image editing</strong> blocks let you
                  remove watermarks from photos, or remove/replace the
                  backgrounds of product photos in WooCommerce
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000" component="div">
                  Best-in-class <strong>AI chat</strong> block lets you persist
                  chats, publish them on your website, branch off mid-way from
                  prior conversations, set the AI’s response style and more
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000">
                  Switch between AI models and providers at will
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000" component="div">
                  <strong>
                    <Typography
                      display="inline"
                      sx={{
                        color: ({ palette }) => palette.purple[700],
                        fontWeight: 700,
                      }}
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
                gap: 1,
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                mt: 1,
              }}
            >
              <CustomLinkButton
                href="/hub"
                isPrimary={false}
                variant="secondary"
                endIcon={<TelescopeIcon />}
              >
                Preview the AI blocks
              </CustomLinkButton>

              <CustomLinkButton href="#get_started" isPrimary variant="primary">
                Get these blocks
              </CustomLinkButton>
            </Box>
          </DetailsSection>
          <Grid
            item
            xs={12}
            lg={6}
            order={{ xs: 1, lg: 2 }}
            sx={{
              alignSelf: "center",
              justifySelf: "center",
            }}
          >
            {loading ? (
              <Skeleton
                sx={{
                  width: "100%",
                  height: "100%",
                  transform: "unset",
                }}
              />
            ) : null}
            <Stream
              controls
              src="17a35fcc1fb28ce771c1d3917cd51c21"
              onCanPlay={() => setLoading(false)}
              primaryColor="#7963F5"
              letterboxColor="transparent"
            />
          </Grid>
          <Grid
            item
            xs={12}
            lg={6.5}
            sx={{
              alignSelf: "center",
              justifySelf: "left",
            }}
            order={{ xs: 3, lg: 3 }}
            component="img"
            src="/assets/wp_bp_seo_cover.png"
          />
          <DetailsSection xs={12} lg={5.5} order={{ xs: 4, lg: 4 }}>
            <Typography
              variant="bpHeading6"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: ({ palette }) => palette.black,
                letterSpacing: "0.05em",
                lineHeight: 1.3,
              }}
            >
              LEVEL UP YOUR SEO
            </Typography>

            <Typography
              variant="bpTitle"
              sx={{
                fontSize: "2.625rem",
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                fontWeight: 700,
                color: ({ palette }) => palette.black,
              }}
              component="div"
            >
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(94.72deg, rgba(235,0,255,1) 6%, rgba(255,122,0,1) 70%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  fontSize: "2.625rem",
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
              >
                Super
              </Box>
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(92.01deg, rgba(255,145,65,1) 25%, rgba(116,7,255,1) 100%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  fontSize: "2.625rem",
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
              >
                -
              </Box>
              <Box
                component="span"
                sx={{
                  color: ({ palette }) => palette.purple[700],
                  fontSize: "2.625rem",
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
              >
                structured data
              </Box>
              <span>{" comes to WordPress"}</span>
            </Typography>
            <Box
              sx={{
                fontSize: "1rem",
                mt: "20px",
              }}
            >
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000" component="div">
                  <strong>
                    Turn WordPress into a powerful{" "}
                    <Typography
                      display="inline"
                      sx={{ color: ({ palette }) => palette.purple[700] }}
                    >
                      <strong>entity graph</strong>
                    </Typography>{" "}
                    and unlock a whole range of new functionality.
                  </strong>{" "}
                  Go beyond Custom Post Types and Advanced Custom Fields with a
                  graph of entities, all with their own properties and connected
                  by links
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <ArrowUpRightIcon
                    sx={{
                      scale: "0.7 !important",
                      mt: "-3px",
                      fill: ({ palette }) => palette.purple[600],
                    }}
                  />
                </Box>
                <Typography color="#000000" component="div">
                  <strong>
                    <Typography
                      sx={{
                        color: ({ palette }) => palette.purple[600],
                        fontWeight: "700",
                        fontSize: "12px",
                      }}
                    >
                      COMING SOON
                    </Typography>
                    Improve your search rankings
                  </strong>{" "}
                  by leveraging structured data (SEO) blocks that take context
                  from their surroundings and dynamically generating whole-page
                  JSON-LD based on related information{" "}
                  <Typography sx={{ color: ({ palette }) => palette.gray[60] }}>
                    (e.g. offers in WooCommerce, or tickets for an event)
                  </Typography>
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <ArrowUpRightIcon
                    sx={{
                      scale: "0.7 !important",
                      mt: "-3px",
                      fill: ({ palette }) => palette.purple[600],
                    }}
                  />
                </Box>
                <Typography color="#000000" component="div">
                  <strong>
                    <Typography
                      sx={{
                        color: ({ palette }) => palette.purple[600],
                        fontWeight: "700",
                        fontSize: "12px",
                      }}
                    >
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
                gap: 1,
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                mt: 1,
              }}
            >
              <CustomLinkButton
                href="https://hash.dev/blog/block-protocol-0-3-wordpress"
                isPrimary={false}
                variant="secondary"
                endIcon={<MagicIcon />}
              >
                Learn more about the benefits
              </CustomLinkButton>

              <CustomLinkButton href="#get_started" isPrimary variant="primary">
                Get started
              </CustomLinkButton>
            </Box>
          </DetailsSection>
          <DetailsSection
            xs={12}
            lg={5.5}
            sx={{ marginTop: { xs: "45px" } }}
            order={{ xs: 5, lg: 5 }}
          >
            <Typography
              variant="bpHeading6"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: ({ palette }) => palette.black,
                letterSpacing: "0.05em",
                lineHeight: 1.3,
              }}
            >
              SUPERCHARGE YOUR WEBSITE
            </Typography>
            <Typography
              variant="bpTitle"
              sx={{
                fontSize: "2.625rem",
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                fontWeight: 700,
                color: ({ palette }) => palette.black,
              }}
              component="div"
            >
              <Box
                sx={{
                  color: ({ palette }) => palette.purple[700],
                  fontSize: "2.625rem",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
                component="span"
              >
                <strong>{"Powerful API services "}</strong>
              </Box>
              <span>without the fuss</span>
            </Typography>
            <Box
              sx={{
                fontSize: "1rem",
                mt: "20px",
              }}
            >
              <Box sx={{ display: "flex", mb: "14px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000">
                  Access OpenAI, Mapbox, and other powerful APIs{" "}
                  <strong>
                    directly within WordPress, with zero extra steps
                  </strong>
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "14px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000">
                  <strong>Everything is handled by the Block Protocol.</strong>{" "}
                  No need to share card details, obtain API keys, or set up an
                  account with any other service provider.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "14px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <RightPointerIcon />
                </Box>
                <Typography color="#000000">
                  Generous free allowances with all providers let you try out
                  blocks and use them in WordPress
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: "14px", gap: 1.75 }}>
                <Box sx={{ ml: "-4px" }}>
                  <ArrowUpRightIcon
                    sx={{
                      scale: "0.7 !important",
                      mt: "-3px",
                      fill: ({ palette }) => palette.purple[600],
                    }}
                  />
                </Box>

                <Typography component="div" color="#000000">
                  <strong>
                    <Typography
                      sx={{
                        color: ({ palette }) => palette.purple[600],
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
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
                gap: 1,
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                mt: 1,
              }}
            >
              <CustomLinkButton
                href="/hub"
                isPrimary={false}
                variant="secondary"
                endIcon={<GlobeIcon />}
              >
                Browse all services
              </CustomLinkButton>

              <CustomLinkButton href="#get_started" isPrimary variant="primary">
                Access for free
              </CustomLinkButton>
            </Box>
          </DetailsSection>
          <Grid
            item
            xs={12}
            lg={6.5}
            order={{ xs: 6, lg: 6 }}
            sx={{
              alignSelf: "center",
              justifySelf: "right",
            }}
            component="img"
            src="/assets/wp_bp_api_cover.png"
          />
          <Grid
            container
            sx={{ marginTop: { xs: "40px", lg: "100px" } }}
            order={{ xs: 7, lg: 7 }}
          >
            <Grid
              item
              xs={12}
              lg={6.5}
              sx={{
                scale: "1.4",
                marginTop: "120px",
                marginLeft: "-150px",
                marginBottom: "-150px",
                order: { xs: 2, lg: 1 },
              }}
              component="img"
              src="/assets/wp_bp_blocks_cover.png"
            />
            <DetailsSection
              xs={12}
              lg={5.5}
              sx={{
                paddingLeft: { lg: "60px" },
                marginLeft: { lg: "150px" },
                order: { xs: 1, lg: 2 },
              }}
            >
              <Typography
                variant="bpHeading6"
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: ({ palette }) => palette.black,
                  letterSpacing: "0.05em",
                  lineHeight: 1.3,
                }}
              >
                TONS MORE BENEFITS
              </Typography>
              <Typography
                variant="bpTitle"
                sx={{
                  fontSize: "2.625rem",
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  fontWeight: 700,
                  color: ({ palette }) => palette.black,
                }}
                component="div"
              >
                <Box
                  component="span"
                  sx={{
                    color: ({ palette }) => palette.purple[700],
                    fontSize: "2.625rem",
                    fontStyle: "italic",
                  }}
                >
                  Instant access to
                </Box>
                <span>{" infinite blocks"}</span>
              </Typography>
              <Box
                sx={{
                  fontSize: "1rem",
                  mt: "20px",
                }}
              >
                <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                  <Box sx={{ ml: "-4px" }}>
                    <RightPointerIcon />
                  </Box>
                  <Typography color="#000000">
                    <strong>
                      Discover and insert new blocks at the point of need
                    </strong>{" "}
                    from the normal block insertion menu built into WordPress
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                  <Box sx={{ ml: "-4px" }}>
                    <RightPointerIcon />
                  </Box>
                  <Typography color="#000000" component="div">
                    <strong>
                      New blocks are instantly available within WordPress
                    </strong>{" "}
                    without having to update the plugin, or install additional
                    plugins{" "}
                    <Typography
                      sx={{ color: ({ palette }) => palette.gray[60] }}
                      component="span"
                    >
                      (as is required for Gutenberg blocks)
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                  <Box sx={{ ml: "-4px" }}>
                    <RightPointerIcon />
                  </Box>
                  <Typography color="#000000">
                    The Block Protocol is an open-source ecosystem of blocks
                    that anybody can contribute to
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: "12px", gap: 1.75 }}>
                  <Box sx={{ ml: "-4px" }}>
                    <RightPointerIcon />
                  </Box>
                  <Typography color="#000000" component="div">
                    <strong>
                      You can use Block Protocol blocks in any{" "}
                      <Typography
                        sx={{
                          fontWeight: 700,
                          display: "inline",
                          color: ({ palette }) => palette.purple[70],
                        }}
                      >
                        Þ
                      </Typography>
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
                    xs: "column",
                    md: "row",
                  },
                  mt: "8px",
                }}
              >
                <CustomLinkButton
                  href="#get_started"
                  isPrimary
                  variant="primary"
                >
                  Get the plugin for free
                </CustomLinkButton>
              </Box>
            </DetailsSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
