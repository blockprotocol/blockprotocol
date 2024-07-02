import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Image from "next/image";

import { ArrowUpRightIcon, DownloadIcon, OpenAiIcon } from "../../icons";
import { LinkButton } from "../../link-button";
import { FaqItem } from "./faq-item";

export const FAQ = () => {
  return (
    <Box
      sx={{
        fontFamily: "Inter",
        textAlign: "left",
        width: 1,
        overflow: "hidden",
      }}
    >
      <Typography
        variant="bpHeading5"
        sx={{
          fontSize: "14px",
          lineHeight: 1,
          fontWeight: 500,
          letterSpacing: ".06rem",
          mb: 1,
          color: ({ palette }) => palette.black,
        }}
      >
        MORE INFORMATION
      </Typography>
      <Typography
        variant="bpHeading1"
        sx={{
          fontSize: "2.6rem",
          lineHeight: 1,
          fontWeight: 700,
          mb: 1,
          color: ({ palette }) => palette.purple[700],
          fontStyle: "italic",
          letterSpacing: "-0.03em",
        }}
      >
        In case you’re wondering...
      </Typography>
      <Typography
        variant="bpHeading1"
        sx={{
          fontSize: "2.6rem",
          lineHeight: 1,
          fontWeight: 700,
          mb: 2.25,
          fontStyle: "italic",
          color: ({ palette }) => palette.black,
          letterSpacing: "-0.03em",
        }}
      >
        Frequently Asked Questions
      </Typography>
      <Box
        sx={{
          width: 166,
          height: 3,
          borderRadius: 100,
          background: "linear-gradient(89.98deg, #6B54EF 0%, #FFFFFF 100%)",
          mb: 3.375,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 948,
        }}
      >
        <FaqItem
          title={
            <div>
              What is the{" "}
              <Typography
                sx={{
                  fontWeight: 600,
                  color: ({ palette }) => palette.purple[70],
                }}
                component="span"
              >
                Þ
              </Typography>{" "}
              Block Protocol?
            </div>
          }
        >
          <Box sx={{ width: "100%" }}>
            The Block Protocol is a universal plugin framework. It allows...
            <List style={{ listStyleType: "disc" }}>
              <ListItem
                sx={{
                  display: "list-item",
                  listStylePosition: "outside",
                  ml: "1em",
                }}
              >
                <strong>developers</strong> to build blocks once which work
                across any{" "}
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: ({ palette }) => palette.purple[70],
                  }}
                  component="span"
                >
                  Þ
                </Typography>{" "}
                compliant application
              </ListItem>
              <ListItem
                sx={{
                  display: "list-item",
                  listStylePosition: "outside",
                  ml: "1em",
                }}
              >
                <strong>applications</strong> to offer their users access to an
                ever-expanding range of native-quality blocks, without needing
                to develop or vet these themselves
              </ListItem>
              <ListItem
                sx={{
                  display: "list-item",
                  listStylePosition: "outside",
                  ml: "1em",
                }}
              >
                <strong>users</strong> to access best-in-class blocks, including
                those powered by third-party services, even when applications
                themselves don’t natively integrate with that service
              </ListItem>
            </List>
            In short, the Block Protocol removes barriers to interoperability,
            and allows frontend components to be built once and used anywhere,
            in an extremely high-quality way.
          </Box>
        </FaqItem>
        <FaqItem
          title={
            <div>
              What is the{" "}
              <Typography
                sx={{
                  fontWeight: 600,
                  color: ({ palette }) => palette.purple[70],
                }}
                component="span"
              >
                Þ
              </Typography>{" "}
              Block Protocol for WordPress plugin?
            </div>
          }
        >
          <Box>
            The plugin adds support for the Block Protocol to any WordPress
            instance, enabling it to embed{" "}
            <Typography
              sx={{
                fontWeight: 600,
                color: ({ palette }) => palette.purple[70],
              }}
              component="span"
            >
              Þ
            </Typography>{" "}
            blocks and utilize external services from providers such as OpenAI,
            and Mapbox. The plugin introduces an in-database “entity graph”
            which allows information created using blocks to be captured as
            structured data. This can then be reassembled into search-engine
            friendly metadata on page load, boosting website traffic by
            improving the search rankings (SEO) of websites using the plugin.
          </Box>
        </FaqItem>
        <FaqItem
          title={
            <div>
              What are some example{" "}
              <Typography
                sx={{
                  fontWeight: 600,
                  color: ({ palette }) => palette.purple[70],
                }}
                component="span"
              >
                Þ
              </Typography>{" "}
              blocks?
            </div>
          }
        >
          <Box>
            Because they work in multiple environments, developers can invest in
            ensuring their{" "}
            <Typography
              sx={{
                fontWeight: 600,
                color: ({ palette }) => palette.purple[70],
              }}
              component="span"
            >
              Þ
            </Typography>{" "}
            blocks are absolute best-in-class. This means that{" "}
            <Typography
              sx={{
                fontWeight: 700,
                color: ({ palette }) => palette.purple[70],
              }}
              component="span"
            >
              Þ
            </Typography>{" "}
            blocks provide an unparalleled user experience when it comes to
            things like using AI within WordPress.
          </Box>
          <Box
            sx={{
              display: "flex",
              mt: "1rem",
              mb: "1rem",
              alignItems: "center",
            }}
          >
            <Typography
              variant="bpTitle"
              sx={{
                color: ({ palette }) => palette.gray[70],
                fontWeight: 700,
                fontSize: "14px",
              }}
              component="span"
            >
              AI BLOCKS
            </Typography>
            <Typography
              variant="bpTitle"
              sx={{
                color: ({ palette }) => palette.bpGray[50],
                fontWeight: 400,
                px: "5px",
                fontSize: "14px",
              }}
              component="span"
            >
              POWERED BY
            </Typography>
            <OpenAiIcon sx={{ width: "83px", height: "20px" }} />
          </Box>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} lg={4}>
              <Link href="https://blockprotocol.org/@hash/blocks/ai-text">
                <Card
                  sx={{
                    minWidth: "auto",
                  }}
                >
                  <CardMedia
                    sx={{ height: "202px" }}
                    image="/assets/block-cover-text.png"
                    title=""
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      fontWeight={600}
                      sx={{
                        color: ({ palette }) => palette.bpGray[80],
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                      component="div"
                    >
                      <Image
                        src="https://blockprotocol.hashai.workers.dev/blocks/hash/ai-text/public/ai-text.svg"
                        alt="ai-text"
                        width={24}
                        height={24}
                      />
                      AI Text
                    </Typography>
                    <Typography
                      sx={{
                        color: ({ palette }) => palette.gray[80],
                        fontSize: "14px",
                      }}
                    >
                      Generate text in any style directly inside WordPress using
                      the latest models from ChatGPT and more
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Link href="https://blockprotocol.org/@hash/blocks/ai-image">
                <Card
                  sx={{
                    minWidth: "auto",
                  }}
                >
                  <CardMedia
                    sx={{ height: "202px" }}
                    image="/assets/block-cover-image.png"
                    title=""
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      fontWeight={600}
                      sx={{
                        color: ({ palette }) => palette.bpGray[80],
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                      component="div"
                    >
                      <Image
                        src="https://blockprotocol.hashai.workers.dev/blocks/hash/ai-image/public/ai-image.svg"
                        alt="ai-image"
                        width={26}
                        height={24}
                      />
                      AI Image
                    </Typography>
                    <Typography
                      sx={{
                        color: ({ palette }) => palette.gray[80],
                        fontSize: "14px",
                      }}
                    >
                      Illustrate blog posts and make content pop with
                      photorealistic or stylized AI-generated imagery
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Link href="https://blockprotocol.org/@hash/blocks/ai-chat">
                <Card
                  sx={{
                    minWidth: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(
                      "https://blockprotocol.org/@hash/blocks/ai-chat",
                    )
                  }
                >
                  <CardMedia
                    sx={{ height: "202px" }}
                    image="/assets/block-cover-chat.png"
                    title=""
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      fontWeight={600}
                      sx={{
                        color: ({ palette }) => palette.bpGray[80],
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                      component="div"
                    >
                      <Image
                        src="https://blockprotocol.hashai.workers.dev/blocks/hash/ai-chat/public/ai-chat-icon.svg"
                        alt="ai-chat"
                        width={26}
                        height={26}
                      />
                      AI Chat
                    </Typography>
                    <Typography
                      sx={{
                        color: ({ palette }) => palette.gray[80],
                        fontSize: "14px",
                      }}
                    >
                      Chat with AI, embed one or more responses in a post, or
                      easily share a whole thread on your WordPress site
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          </Grid>
          <Box>
            Blocks look and feel like native parts of the application you’re
            using, blending right in, and when shown to users their outputs
            match the style of your website (and can often be customized further
            when required).
          </Box>
        </FaqItem>
        <FaqItem
          title={
            <div>
              How are{" "}
              <Typography
                sx={{
                  fontWeight: 600,
                  color: ({ palette }) => palette.purple[70],
                }}
                component="span"
              >
                Þ
              </Typography>{" "}
              blocks inserted within WordPress?
            </div>
          }
        >
          <Box>
            Once the plugin has been activated and a (free to obtain) API key
            entered,{" "}
            <Typography
              sx={{
                fontWeight: 700,
                color: ({ palette }) => palette.purple[70],
              }}
              component="span"
            >
              Þ
            </Typography>{" "}
            blocks simply appear within the normal block insertion menu in
            Gutenberg. New blocks also appear without needing to update the
            plugin.
          </Box>
        </FaqItem>
        <FaqItem
          title={
            <div>
              Are there security considerations around using{" "}
              <Typography
                sx={{
                  fontWeight: 600,
                  color: ({ palette }) => palette.purple[70],
                }}
                component="span"
              >
                Þ
              </Typography>{" "}
              blocks?
            </div>
          }
        >
          <Box>
            Unlike normal Gutenberg blocks, adding new{" "}
            <Typography
              sx={{
                fontWeight: 600,
                color: ({ palette }) => palette.purple[70],
              }}
              component="span"
            >
              Þ
            </Typography>{" "}
            blocks doesn't require installing more plugins and doesn't require
            introducing any external PHP code. As a result, we believe it is
            generally safer to add new blocks in WordPress through the Block
            Protocol than via any other method. However, because the Block
            Protocol is an open standard, anybody may develop a block, and any
            block may execute code in-browser. Because of this, by default we
            restrict blocks available via the plugin to ones on the{" "}
            <Typography
              sx={{
                fontWeight: 700,
                color: ({ palette }) => palette.purple[70],
              }}
              component="span"
            >
              Þ
            </Typography>{" "}
            Hub which we have reviewed.
          </Box>
        </FaqItem>
        <FaqItem
          title={
            <div>
              Should I install the{" "}
              <Typography
                sx={{
                  fontWeight: 600,
                  color: ({ palette }) => palette.purple[70],
                }}
                component="span"
              >
                Þ
              </Typography>{" "}
              plugin?
            </div>
          }
          bordered={false}
        >
          <Box>
            Absolutely. It’s free, and gives your existing WordPress website new
            superpowers. If you get stuck or have any questions, feel free to{" "}
            <Link href="/contact">
              <strong>contact us</strong>
            </Link>
            .
          </Box>
        </FaqItem>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <LinkButton
            variant="primary"
            href="https://wordpress.com/plugins/blockprotocol/"
            sx={{
              fontSize: 15,
              color: ({ palette }) => palette.bpGray[20],
              padding: "8px 20px 8px 20px",
              background: ({ palette }) => palette.purple[700],
            }}
            endIcon={
              <ArrowUpRightIcon
                sx={{ fill: ({ palette }) => palette.purple[30] }}
              />
            }
          >
            Install on WordPress.com
          </LinkButton>

          <LinkButton
            variant="secondary"
            endIcon={<DownloadIcon fill="6048E5" />}
            sx={{
              padding: "8px 20px 8px 20px",
            }}
            href="https://wordpress.org/plugins/blockprotocol/"
          >
            Download ZIP for self-hosted Wordpress
          </LinkButton>
        </Box>
      </Box>
    </Box>
  );
};
