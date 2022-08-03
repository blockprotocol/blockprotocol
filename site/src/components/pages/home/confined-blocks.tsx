import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";

import darkBoxImage from "../../../../public/assets/new-home/dark-box-min.png";

export const ConfinedBlocks = () => {
  const translate = useTranslations();
  return (
    <Box
      sx={{
        background:
          "linear-gradient(40.4deg, rgb(29, 29, 38) 63.75%, rgb(62, 62, 73) 82.21%)",
        py: { xs: 10, md: 12 },
        px: { xs: "1rem", lg: "0" },
        border: "2px solid rgb(5, 5, 7)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: "1100px",
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
          <Typography
            sx={{
              color: ({ palette }) => palette.grey[200],
              textAlign: { xs: "center", md: "left" },
              maxWidth: "20ch",
              margin: "0 auto 1.5rem",
            }}
            variant="bpHeading2"
          >
            {translate("confine_block_title")}
          </Typography>
          <Box
            sx={{
              width: "120px",
              height: "2px",
              ml: "0.25rem",
              my: 2,
              background:
                "linear-gradient(to right, rgb(172, 159, 255, 1), rgba(172, 159, 255, 0))",
            }}
          />
          <Typography
            sx={{
              color: "#c2cedf",
              textAlign: { xs: "center", md: "left" },
              maxWidth: "45ch",
              margin: "1rem auto",
              lineHeight: 1.5,
            }}
            mb={2}
            variant="bpBodyCopy"
          >
            {translate("confine_block_text_1")}
          </Typography>
          <Typography
            sx={{
              color: "#c2cedf",
              textAlign: { xs: "center", md: "left" },
              maxWidth: "45ch",
              margin: "1rem 0",
              lineHeight: 1.5,
            }}
            mb={2}
            variant="bpBodyCopy"
          >
            {translate("confine_block_text_2")}
          </Typography>
          <Typography
            sx={{
              color: "#c2cedf",
              textAlign: { xs: "center", md: "left" },
              maxWidth: "45ch",
              margin: "1rem 0",
              lineHeight: 1.5,
            }}
            mb={2}
            variant="bpBodyCopy"
          >
            {translate("confine_block_text_3")}
          </Typography>
        </Box>
        <Box sx={{ width: { xs: "90%", md: "55%" } }}>
          <Image src={darkBoxImage} />
        </Box>
      </Box>
    </Box>
  );
};
