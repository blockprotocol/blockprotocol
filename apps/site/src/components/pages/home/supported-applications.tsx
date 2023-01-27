import { faFigma } from "@fortawesome/free-brands-svg-icons";
import {
  Box,
  Container,
  Stack,
  Tooltip,
  TooltipComponentsPropsOverrides,
  Typography,
} from "@mui/material";
import Image from "next/legacy/image";
import { ReactNode } from "react";

import supportedApplicationsFullImage from "../../../../public/assets/new-home/supported-applications-full-min.webp";
import {
  FontAwesomeIcon,
  GithubIcon,
  HashIcon,
  WordPressIcon,
} from "../../icons";
import { ArrowUpRightFromSquareIcon } from "../../icons/arrow-up-right-from-square-icon";
import { BoxesStackedIcon } from "../../icons/boxes-stacked-icon";
import { BrowserIcon } from "../../icons/browser-icon";
import { Grid2PlusIcon } from "../../icons/grid-2-plus";
import { SparklesIcon } from "../../icons/sparkles-icon";
import { Link } from "../../link";
import { LinkButton } from "../../link-button";

const IconButtonWithTooltip = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) => {
  return (
    <Tooltip
      componentsProps={{
        tooltip: {
          "data-testid": `${label}-tooltip`,
        } as TooltipComponentsPropsOverrides,
      }}
      title={
        <Box display="flex" alignItems="center">
          {label}
          <ArrowUpRightFromSquareIcon
            sx={{
              fontSize: 12,
              fill: ({ palette }) => palette.gray[50],
              ml: 1.25,
            }}
          />
        </Box>
      }
      placement="top"
    >
      <LinkButton
        linkProps={{
          "data-testid": `${label}-button`,
        }}
        data-testid={label}
        href={href}
        color="inherit"
        sx={{
          borderRadius: 2.5,
          background: "transparent",
          p: 0.5,
          minWidth: 0,
          "&:hover": {
            background: ({ palette }) => palette.gray[20],
          },
        }}
      >
        {icon}
      </LinkButton>
    </Tooltip>
  );
};

export const SupportedApplications = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FBF7FF",
          mt: 2,
          pt: 12.5,
          borderBottom: `1px solid #eceaf1`,
          overflow: "hidden",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 3,
            mb: { xs: 12, md: 18 },
            maxWidth: { xs: "95%", md: "85%", lg: 1000 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              gap: 5,
              mb: 8,
            }}
          >
            <Box>
              <Typography
                sx={{
                  textAlign: "center",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: ({ palette }) => palette.gray[90],
                  mb: 1.25,
                }}
                variant="bpSmallCaps"
              >
                <Box
                  component="span"
                  sx={{ color: ({ palette }) => palette.purple[70] }}
                >
                  Þ
                </Box>{" "}
                blocks work in
              </Typography>

              <Stack gap={2.5} flexDirection="row" justifyContent="center">
                <IconButtonWithTooltip
                  href="/docs/using-blocks#wordpress"
                  label="WordPress"
                  icon={
                    <WordPressIcon
                      dark
                      sx={{
                        fill: ({ palette }) => palette.gray[90],
                        fontSize: 54,
                      }}
                    />
                  }
                />

                <IconButtonWithTooltip
                  href="/docs/using-blocks#hash"
                  label="HASH"
                  icon={
                    <HashIcon
                      dark
                      sx={{
                        fill: ({ palette }) => palette.gray[90],
                        fontSize: 54,
                      }}
                    />
                  }
                />
              </Stack>
            </Box>

            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                width: 0,
                minHeight: 1,
                borderLeft: "1px solid #D9D9D9",
              }}
            />

            <Box>
              <Typography
                sx={{
                  textAlign: "center",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: ({ palette }) => palette.gray[90],
                  mb: 1.25,
                }}
                variant="bpSmallCaps"
              >
                Coming soon
              </Typography>

              <Stack gap={2.5} flexDirection="row" justifyContent="center">
                <IconButtonWithTooltip
                  href="/docs/using-blocks#github-blocks"
                  label="GitHub Blocks"
                  icon={
                    <GithubIcon
                      sx={{
                        fill: ({ palette }) => palette.gray[90],
                        fontSize: 54,
                      }}
                    />
                  }
                />

                <IconButtonWithTooltip
                  href="/docs/using-blocks#figma"
                  label="Figma"
                  icon={
                    <FontAwesomeIcon
                      icon={faFigma}
                      sx={{
                        fill: ({ palette }) => palette.gray[90],
                        fontSize: 54,
                      }}
                    />
                  }
                />
                <IconButtonWithTooltip
                  href="/docs/using-blocks#other-environments"
                  label="Vote on what’s next"
                  icon={
                    <Grid2PlusIcon
                      sx={{
                        fill: ({ palette }) => palette.gray[40],
                        fontSize: 54,
                      }}
                    />
                  }
                />
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              textAlign: "left",
              gap: 12.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "inherit",
                position: "relative",
                maxWidth: 620,
              }}
            >
              <Box
                component="img"
                src="/assets/new-home/faded-infinity.svg"
                sx={{
                  position: "absolute",
                  right: { xs: -10, lg: -45 },
                  top: 40,
                  zIndex: -1,
                }}
              />

              <Typography
                sx={{
                  textTransform: "uppercase",
                  color: ({ palette }) => palette.purple[800],
                  mb: 0.75,
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  textAlign: "inherit",
                  letterSpacing: 0,
                }}
                variant="bpSmallCaps"
              >
                Block developers
              </Typography>

              <Typography
                variant="bpHeading3"
                sx={{
                  color: ({ palette }) => palette.gray[90],
                  textAlign: "inherit",
                  fontWeight: 500,
                  mb: 1.5,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                Build blocks that work across the web
              </Typography>

              <Box
                sx={{
                  width: 166,
                  height: 3,
                  background:
                    "linear-gradient(89.98deg, #6B54EF 0%, #FFFFFF 100%)",
                  borderRadius: 25,
                  mb: 3.5,
                }}
              />

              <Typography
                variant="bpBodyCopy"
                sx={{
                  mb: 2,
                  textAlign: "inherit",
                  flexGrow: 1,
                }}
              >
                Rather than develop blocks separately for multiple platforms,
                build your block once and let users access them in{" "}
                <strong>HASH, WordPress, GitHub Blocks</strong> and{" "}
                <strong>Figma</strong> (coming soon).
              </Typography>

              <Box>
                <LinkButton
                  href="/docs/developing-blocks"
                  variant="primary"
                  sx={{ color: ({ palette }) => palette.common.white }}
                  startIcon={
                    <SparklesIcon
                      sx={{
                        fontSize: 18,
                      }}
                    />
                  }
                >
                  Build a block
                </LinkButton>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "inherit",
                position: "relative",
                maxWidth: 620,
              }}
            >
              <Box
                component="img"
                src="/assets/new-home/faded-earth.svg"
                sx={{
                  position: "absolute",
                  right: -10,
                  top: 5,
                  zIndex: -1,
                }}
              />

              <Typography
                sx={{
                  textTransform: "uppercase",
                  color: ({ palette }) => palette.purple[800],
                  mb: 0.75,
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  textAlign: "inherit",
                  letterSpacing: 0,
                }}
                variant="bpSmallCaps"
              >
                Block Users
              </Typography>

              <Typography
                variant="bpHeading3"
                sx={{
                  color: ({ palette }) => palette.gray[90],
                  textAlign: "inherit",
                  fontWeight: 500,
                  mb: 1.5,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                Tap into blocks in any supporting application
              </Typography>

              <Box
                sx={{
                  width: 166,
                  height: 3,
                  background:
                    "linear-gradient(89.98deg, #6B54EF 0%, #FFFFFF 100%)",
                  borderRadius: 25,
                  mb: 3.5,
                }}
              />

              <Typography
                variant="bpBodyCopy"
                sx={{
                  mb: 2,
                  textAlign: "inherit",
                  flexGrow: 1,
                }}
              >
                Access a whole world of blocks on the{" "}
                <Link
                  href="/hub"
                  sx={{
                    borderBottomColor: "transparent !important",
                    ":hover": {
                      borderBottomColor: ({ palette }) =>
                        `${palette.purple[500]} !important`,
                    },
                  }}
                >
                  Þ Hub
                </Link>{" "}
                to extend the functionality of the apps you use, and enjoy
                high-quality, consistent interfaces across applications.
              </Typography>

              <Stack flexDirection="row" gap={2}>
                <LinkButton
                  href="/docs/using-blocks"
                  variant="primary"
                  sx={{
                    color: ({ palette }) => palette.common.white,
                    whiteSpace: "nowrap",
                  }}
                  startIcon={
                    <BrowserIcon
                      sx={{
                        fontSize: 18,
                      }}
                    />
                  }
                >
                  Browse apps
                </LinkButton>

                <LinkButton
                  href="/hub"
                  variant="secondary"
                  sx={{
                    color: ({ palette }) => palette.purple[70],
                    background: "transparent",
                    whiteSpace: "nowrap",
                  }}
                  startIcon={
                    <BoxesStackedIcon
                      sx={{
                        fontSize: 18,
                      }}
                    />
                  }
                >
                  Browse blocks
                </LinkButton>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        sx={{
          mt: "-10%",
          background: "linear-gradient(0deg, #FFF 50%, #FBF7FF 50%)",
          pb: { xs: 3, sm: 5 },
        }}
      >
        <Image layout="responsive" src={supportedApplicationsFullImage} />
      </Box>
    </>
  );
};
