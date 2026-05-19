import {
  faArrowRight,
  faCodePullRequest,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Typography } from "@mui/material";
import { NextPage } from "next";

import { FontAwesomeIcon } from "../../icons";
import { ArrowUpIcon } from "../../icons/arrow-up-icon";
import { LinkButton } from "../../link-button";

export const FinalCTA: NextPage = () => {
  return (
    <Box
      data-testid="final-cta"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        sx={(theme) => ({
          height: "100%",
          width: "100%",
          maxWidth: 600,
          transition: theme.transitions.create("padding"),
          padding: {
            xs: 4,
            lg: 12.5,
          },
          mb: 2,
          gap: 3,
        })}
      >
        <Typography
          variant="bpHeading2"
          component="h2"
          sx={{ fontWeight: 700 }}
        >
          Build with the Block Protocol
        </Typography>
        <Typography
          component="p"
          variant="bpBodyCopy"
          sx={{ color: ({ palette }) => palette.gray[80] }}
        >
          Browse the open-source Hub for blocks you can drop into any compatible
          application, or read the docs to start building your own.
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <LinkButton
            href="/hub"
            variant="primary"
            endIcon={<FontAwesomeIcon icon={faArrowRight} />}
          >
            Browse the Hub
          </LinkButton>
          <LinkButton href="/docs" variant="secondary">
            Read the docs
          </LinkButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: {
            xs: "100%",
            md: "auto",
          },
          padding: {
            xs: 6,
            lg: 8,
          },
          background:
            "linear-gradient(180.32deg, #FFFFFF 22.26%, rgba(240, 231, 255, 0.38) 99.72%), #FFFFFF",
          borderStyle: "solid",
          borderColor: ({ palette }) => palette.purple[100],
          borderLeftWidth: { xs: 0, md: 1 },
          borderTopWidth: { xs: 1, md: 0 },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: 1,
            maxWidth: {
              xs: 600,
              md: 460,
            },
            gap: 2,
          }}
        >
          {[
            {
              heading: (
                <>
                  Discover the{" "}
                  <strong>
                    <Box
                      component="span"
                      sx={{ color: ({ palette }) => palette.purple[70] }}
                    >
                      Þ
                    </Box>{" "}
                    <Box
                      component="span"
                      sx={{ fontFamily: "colfax-web", fontStyle: "italic" }}
                    >
                      Hub
                    </Box>
                  </strong>
                </>
              ),
              subHeading: (
                <>
                  Browse existing blocks that work in any application supporting
                  the protocol
                </>
              ),
              icon: <ArrowUpIcon sx={{ fontSize: 16 }} />,
            },
            {
              heading: <>Add blocks to your app</>,
              subHeading: (
                <>Embed open-source blocks from the Hub into your own product</>
              ),
              icon: (
                <FontAwesomeIcon
                  sx={{
                    fontSize: 16,
                    fill: ({ palette }) => palette.purple[70],
                  }}
                  icon={faPlus}
                />
              ),
            },
            {
              heading: <>Contribute to a growing, open source community</>,
              subHeading: (
                <>Help make new block types available to everyone on the web</>
              ),
              icon: (
                <FontAwesomeIcon
                  sx={{
                    fontSize: 16,
                    fill: ({ palette }) => palette.purple[70],
                  }}
                  icon={faCodePullRequest}
                />
              ),
            },
            {
              heading: <>Claim your favorite username</>,
              subHeading: <>@pizza goes fast</>,
              icon: (
                <FontAwesomeIcon
                  sx={{
                    fontSize: 16,
                    fill: ({ palette }) => palette.purple[70],
                  }}
                  icon={faUser}
                />
              ),
            },
          ].map(({ heading, subHeading, icon }, index) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              display="flex"
              alignItems="flex-start"
              gap={1.5}
              sx={{
                maxWidth: {
                  xs: 600,
                  lg: 460,
                },
              }}
            >
              <Box sx={{ lineHeight: "16px", position: "relative", top: 4 }}>
                {icon}
              </Box>
              <Box>
                <Typography
                  variant="bpSmallCopy"
                  sx={{
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    lineHeight: 1.3,
                    mb: 1,
                  }}
                >
                  {heading}
                </Typography>

                <Typography
                  variant="bpSmallCopy"
                  component="p"
                  sx={{
                    color: ({ palette }) => palette.gray[70],
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  {subHeading}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
