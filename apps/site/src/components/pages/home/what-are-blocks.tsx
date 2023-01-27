import { Box, Typography } from "@mui/material";

export const WhatAreBlocks = () => {
  return (
    <Box
      sx={{
        zIndex: 1,
        background: ({ palette }) => palette.common.white,
        borderBottom: "1px solid #eceaf1",
      }}
    >
      {/* First section */}
      <Box
        sx={{
          maxWidth: "1100px",
          background:
            "linear-gradient(181.4deg, rgba(255, 255, 255, 0.65) 50%, #FDFCFE 94.38%)",
          border: "2px solid white",
          borderRadius: "8px",
          boxShadow:
            "0px 2.8px 2.2px rgba(166, 142, 187, 0.15), 0px 6.7px 5.3px rgba(166, 142, 187, 0.08), 0px 12.5px 10px rgba(166, 142, 187, 0.05), 0px 22.3px 17.9px rgba(166, 142, 187, 0.09), 0px 41.8px 33.4px rgba(166, 142, 187, 0.1), 0px 100px 80px rgba(166, 142, 187, 0.1)",
          margin: { xs: "-8rem 1rem 0", lg: "-12rem auto 0" },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: ({ palette }) => palette.common.white,
            boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.04)",
            pt: { xs: 1, md: 3 },
            px: { xs: 2, md: 9 },
            pb: 10,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              justifyContent: { xs: "center", md: "start" },
              py: "1rem",
              gridGap: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "start" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", md: "start" },
                  mb: 3,
                }}
              >
                <Typography
                  variant="bpHeading2"
                  sx={{
                    fontSize: "2.1875rem",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: ({ palette }) => palette.gray[90],
                    margin: "2rem auto 6px",
                    maxWidth: "40ch",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  What are{" "}
                  <Box
                    component="span"
                    sx={{ color: ({ palette }) => palette.purple[70] }}
                  >
                    blocks?
                  </Box>
                </Typography>
                <Box
                  sx={{
                    width: 74,
                    height: 3,
                    background:
                      "linear-gradient(90deg, rgba(117, 86, 220, 0.8) 0%, rgba(117, 86, 220, 0) 100%)",
                    borderRadius: 6,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  maxWidth: { xs: "65ch", md: "52ch" },
                  margin: "0 auto 0.75rem",
                }}
                variant="bpBodyCopy"
              >
                Blocks are individual front-end components that display data.
                They allow regular users to edit their contents without needing
                to write code.
              </Typography>
              <Typography
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  maxWidth: { xs: "65ch", md: "52ch" },
                  margin: "0 auto",
                }}
                variant="bpBodyCopy"
              >
                Blocks can be simple and static, like an image or a text block,
                or they can be more complex, like a checklist or chart block.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                height: 1,
                width: 1,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/assets/new-home/checklist-block.svg"
                sx={{
                  borderRadius: "6px",
                  boxShadow:
                    "0px 1px 0.629px 0px rgba(175, 155, 193, 0.081), 0px 4.237px 8.10px 0px rgba(175, 155, 193, 0.123), 0px 8px 20px 0px rgba(175, 155, 193, 0.083)",
                  margin: {
                    xs: 1,
                    lg: "2rem 4rem 2.5rem 4rem",
                  },
                  maxWidth: {
                    xs: 500,
                    md: 340,
                  },
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "5.5fr 6.5fr" },
              alignItems: { xs: "center", md: "start" },
              justifyContent: { xs: "center", md: "start" },
              pb: 3,
              gridGap: "1.5rem",
            }}
          >
            <Box
              sx={{
                maxWidth: "500px",
                alignSelf: "center",
                justifySelf: "center",
              }}
              component="img"
              src="/assets/new-home/image-block.svg"
            />
            <Box
              component="img"
              src="/assets/new-home/table-block.svg"
              sx={{
                borderRadius: "6px",
                maxWidth: "600px",
                alignSelf: "center",
                justifySelf: "center",
                boxShadow:
                  "0px 1px 0.629px 0px rgba(175, 155, 193, 0.081), 0px 4.237px 8.10px 0px rgba(175, 155, 193, 0.123), 0px 8px 20px 0px rgba(175, 155, 193, 0.083)",
              }}
            />
          </Box>
          <Box
            component="img"
            src="/assets/new-home/kanban-block.svg"
            sx={{
              width: "100%",
              borderRadius: "6px",
              alignSelf: "center",
              justifySelf: "center",
              boxShadow:
                "0px 1px 0.629px 0px rgba(175, 155, 193, 0.081), 0px 4.237px 8.10px 0px rgba(175, 155, 193, 0.123), 0px 8px 20px 0px rgba(175, 155, 193, 0.083)",
            }}
          />
        </Box>
      </Box>

      {/* Second section */}
      <Box
        sx={{
          maxWidth: "900px",
          margin: { xs: "5rem auto 3rem", md: "6rem auto" },
          display: "flex",
          gridGap: "1rem",
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          px: "1rem",
        }}
      >
        <Box
          component="img"
          src="/assets/new-home/block-menu.svg"
          sx={{ mx: "-0.5rem" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "start" },
              mb: 3,
            }}
          >
            <Typography
              variant="bpHeading3"
              sx={{
                color: ({ palette }) => palette.gray[90],
                fontWeight: 500,
                textAlign: { xs: "center", md: "left" },
                maxWidth: { xs: "30ch", md: "100%" },
                mb: 0.75,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Users typically select blocks from a list
            </Typography>
            <Box
              sx={{
                width: 74,
                height: 3,
                background:
                  "linear-gradient(90deg, rgba(117, 86, 220, 0.8) 0%, rgba(117, 86, 220, 0) 100%)",
                borderRadius: 6,
              }}
            />
          </Box>
          <Typography
            sx={{
              textAlign: { xs: "center", md: "left" },
              maxWidth: { xs: "65ch", md: "100%" },
              mb: { xs: 3, md: 5 },
            }}
            variant="bpBodyCopy"
          >
            Users select the type of block they want, then add it to their page,
            dashboard, or canvas. They can add content to the block, edit it, or
            manipulate it to do what they need.
          </Typography>
          <Box
            component="img"
            src="/assets/new-home/image-block-interaction.svg"
            sx={{
              display: { xs: "none", md: "block" },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
