import { Box, Typography } from "@mui/material";
import Image from "next/legacy/image";

import darkBoxImage from "../../../../public/assets/new-home/dark-box-min.webp";

export const ConfinedBlocks = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(40.4deg, #130E2F 63.75%, #572181 82.21%)",
        py: { xs: 10, md: 12 },
        px: { xs: "1rem", lg: "0" },
        border: "2px solid rgb(5, 5, 7)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: 1100,
          margin: "0 auto",
          gridGap: { xs: "2rem", md: "4rem" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
              sx={{
                color: ({ palette }) => palette.grey[200],
                textAlign: { xs: "center", md: "left" },
                fontWeight: 500,
                mb: 1.75,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                maxWidth: { xs: "30ch", md: "20ch" },
              }}
              variant="bpHeading3"
            >
              Today, blocks are confined to single apps and websites
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
              color: ({ palette }) => palette.gray[40],
              textAlign: { xs: "center", md: "left" },
              mb: 2,
              maxWidth: { xs: "65ch", md: "45ch" },
            }}
            variant="bpBodyCopy"
          >
            Every app has to build all of their own blocks. This means
            developers are rebuilding the same block types over and over.
          </Typography>
          <Typography
            sx={{
              color: ({ palette }) => palette.gray[40],
              textAlign: { xs: "center", md: "left" },
              mb: 2,
              maxWidth: { xs: "65ch", md: "45ch" },
            }}
            variant="bpBodyCopy"
          >
            Open source components can save some time, but still need to be
            individually integrated.
          </Typography>
          <Typography
            sx={{
              color: ({ palette }) => palette.gray[40],
              textAlign: { xs: "center", md: "left" },
              maxWidth: { xs: "65ch", md: "45ch" },
              mb: 2,
            }}
            variant="bpBodyCopy"
          >
            This also limits how many blocks users have access to in any single
            application.
          </Typography>
        </Box>
        <Box
          sx={{
            maxWidth: { xs: 620, md: "unset" },
            width: { xs: "100%", md: "55%" },
          }}
        >
          <Image src={darkBoxImage} />
        </Box>
      </Box>
    </Box>
  );
};
