import { Box, Grid, Link, List, ListItem, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import {
  AiChatIcon,
  AiImageIcon,
  AiTextIcon,
  ArrowUpRightIcon,
  BlockProtocolIcon,
  DownloadIcon,
  OpenAiIcon,
} from "../../icons";
import { CustomButton } from "./custom-button";
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
        sx={{
          fontSize: "1rem",
          lineHeight: 1,
          fontWeight: 500,
          mb: 1,
          color: "#0E1114",
        }}
      >
        <strong>MORE INFORMATION</strong>
      </Typography>
      <Typography
        sx={{
          fontSize: "2.6rem",
          lineHeight: 1,
          fontWeight: 700,
          mb: 1,
          color: "#6048E5",
          fontStyle: "italic",
        }}
      >
        In case you’re wondering...
      </Typography>
      <Typography
        sx={{
          fontSize: "2.6rem",
          lineHeight: 1,
          fontWeight: 700,
          mb: 1,
          fontStyle: "italic",
          color: "#0E1114",
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
          mb: "30px",
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
            <Typography sx={{ fontWeight: 700 }}>
              What is the{" "}
              <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
              Block Protocol?
            </Typography>
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
                <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
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
            <Typography sx={{ fontWeight: 700 }}>
              What is the{" "}
              <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
              Block Protocol for WordPress plugin?
            </Typography>
          }
        >
          <Box>
            The plugin adds support for the Block Protocol to any WordPress
            instance, enabling it to embed{" "}
            <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
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
            <Typography sx={{ fontWeight: 700 }}>
              What are some example{" "}
              <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
              blocks?
            </Typography>
          }
        >
          <Box>
            Because they work in multiple environments, developers can invest in
            ensuring their{" "}
            <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
            blocks are absolute best-in-class. This means that{" "}
            <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
            blocks provide an unparalleled user experience when it comes to
            things like using AI within WordPress.
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ color: "#64778C" }}>AI blocks</Typography>
            <Typography sx={{ color: "#9EACBA" }}> powered by</Typography>
            <OpenAiIcon sx={{ width: "83px", height: "20px" }} />
          </Box>
          <Grid container>
            <Grid item xs={12} lg={4} sx={{ px: "5px" }}>
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
                    sx={{
                      color: "#37434F",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    component="div"
                  >
                    <AiTextIcon /> <strong>AI Text</strong>
                  </Typography>
                  <Typography sx={{ color: "#4D5C6C", fontSize: "14px" }}>
                    Generate text in any style directly inside WordPress using
                    the latest models from ChatGPT and more
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  minWidth: "auto",
                }}
              >
                <CardMedia
                  sx={{ height: 202 }}
                  image="/assets/block-cover-image.png"
                  title=""
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{
                      color: "#37434F",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    component="div"
                  >
                    <AiImageIcon /> <strong>AI Image</strong>
                  </Typography>
                  <Typography sx={{ color: "#4D5C6C", fontSize: "14px" }}>
                    Illustrate blog posts and make content pop with
                    photorealistic or stylized AI-generated imagery
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  minWidth: "auto",
                }}
              >
                <CardMedia
                  sx={{ height: 202 }}
                  image="/assets/block-cover-chat.png"
                  title=""
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{
                      color: "#37434F",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    component="div"
                  >
                    <AiChatIcon /> <strong>AI Chat</strong>
                  </Typography>
                  <Box sx={{ color: "#4D5C6C", fontSize: "14px" }}>
                    Chat with AI, embed one or more responses in a post, or
                    easily share a whole thread on your WordPress site
                  </Box>
                </CardContent>
              </Card>
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
            <Typography sx={{ fontWeight: 700 }}>
              How are{" "}
              <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
              blocks inserted within WordPress?
            </Typography>
          }
        >
          <Box>
            Once the plugin has been activated and a (free to obtain) API key
            entered,{" "}
            <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
            blocks simply appear within the normal block insertion menu in
            Gutenberg. New blocks also appear without needing to update the
            plugin.
          </Box>
        </FaqItem>
        <FaqItem
          title={
            <Typography sx={{ fontWeight: 700 }}>
              Are there security considerations around using{" "}
              <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
              blocks?
            </Typography>
          }
        >
          <Box>
            Unlike normal Gutenberg blocks, adding new{" "}
            <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
            blocks doesn't require installing more plugins and doesn't require
            introducing any external PHP code. As a result, we believe it is
            generally safer to add new blocks in WordPress through the Block
            Protocol than via any other method. However, because the Block
            Protocol is an open standard, anybody may develop a block, and any
            block may execute code in-browser. Because of this, by default we
            restrict blocks available via the plugin to ones on the{" "}
            <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} /> Hub
            which we have reviewed.
          </Box>
        </FaqItem>
        <FaqItem
          title={
            <Typography sx={{ fontWeight: 700 }}>
              Should I install the{" "}
              <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
              plugin?
            </Typography>
          }
          hasBorderBottom={false}
        >
          <Box>
            Should I install the{" "}
            <BlockProtocolIcon gradient sx={{ scale: "0.6 !important" }} />{" "}
            plugin? Absolutely. It’s free, and gives your existing WordPress
            website new superpowers. If you get stuck or have any questions,
            feel free to{" "}
            <Link
              sx={{ color: "#7556DC", textDecoration: "none" }}
              component="button"
            >
              <strong>contact us</strong>
            </Link>
            , or drop a line in our{" "}
            <Link
              sx={{ color: "#7556DC", textDecoration: "none" }}
              component="button"
            >
              <strong>community Discord</strong>
            </Link>
            .
          </Box>
        </FaqItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <CustomButton
            buttonLabel="Install on WordPress.com"
            sx={{
              height: "40px",
              fontSize: "14px",
              padding: "8px, 18px, 8px, 18px",
              marginRight: "14px",
              mb: { xs: 1, md: 0 },
            }}
            endIcon={<ArrowUpRightIcon />}
          />
          <CustomButton
            buttonLabel="Download ZIP for self-hosted Wordpress"
            backgroundColor="#FFFFFF"
            color="#3A2084"
            sx={{
              height: "40px",
              fontSize: "14px",
              padding: "8px, 18px, 8px, 18px",
              border: "1px solid #6048E5",
            }}
            endIcon={<DownloadIcon sx={{ color: "#7556DC !important" }} />}
          />
        </Box>
      </Box>
    </Box>
  );
};
