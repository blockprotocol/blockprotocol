import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export const WhatAreBlocks = () => {
  const translate = useTranslations();
  return (
    <Box
      sx={{
        zIndex: 1,
        background:
          "radial-gradient(116.02% 95.04% at 50% 100.79%, #f5f3fa 0%, #FFFFFF 80.54%)",
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
          pt: { xs: 1, md: 3 },
          px: { xs: 2, md: 9 },
          pb: 10,
          margin: { xs: "-6rem 1rem 0", lg: "-8rem auto 0" },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: { xs: "center", md: "start" },
            justifyContent: { xs: "center", md: "start" },
            py: "1rem",
            gridGap: "1rem",
          }}
        >
          <Box>
            <Typography
              variant="bpHeading2"
              sx={{
                lineHeight: 1,
                color: ({ palette }) => palette.gray[90],
                margin: "2rem auto 1rem",
                maxWidth: "40ch",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {translate("block_q")}
            </Typography>
            <Typography
              variant="bpBodyCopy"
              sx={{
                textAlign: { xs: "center", md: "left" },
                margin: "0 auto 1rem",
              }}
              maxWidth="52ch"
            >
              {translate("block_desc_1")}
            </Typography>
            <Typography
              variant="bpBodyCopy"
              sx={{
                textAlign: { xs: "center", md: "left" },
                margin: "0 auto",
              }}
              maxWidth="52ch"
            >
              {translate("block_desc_2")}
            </Typography>
          </Box>
          <Box
            component="img"
            src="/assets/new-home/checklist-block.svg"
            sx={{
              borderRadius: "6px",
              boxShadow:
                "0px 1px 0.629px 0px rgba(175, 155, 193, 0.081), 0px 4.237px 8.10px 0px rgba(175, 155, 193, 0.123), 0px 8px 20px 0px rgba(175, 155, 193, 0.083)",
              margin: { xs: 1, md: "2rem 4rem 2.5rem 4rem" },
              maxWidth: "500px",
              alignSelf: "center",
              justifySelf: "center",
            }}
          />
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
        }}
      >
        <Box component="img" src="/assets/new-home/block-menu.svg" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            px: { xs: "1rem", md: "0" },
          }}
        >
          <Typography
            variant="bpHeading2"
            sx={{
              textAlign: { xs: "center", md: "left" },
              maxWidth: { xs: "20ch", md: "100%" },
            }}
          >
            {translate("user_typical_select")}
          </Typography>
          <Box
            sx={{
              width: "120px",
              height: "2px",
              ml: "0.25rem",
              my: 3,
              background:
                "linear-gradient(to right, rgb(149, 135, 239, 1), rgba(172, 159, 255, 0))",
            }}
          />
          <Typography
            variant="bpBodyCopy"
            sx={{
              textAlign: { xs: "center", md: "left" },
              maxWidth: { xs: "45ch", md: "100%" },
            }}
            mb={{ xs: 3, md: 6 }}
          >
            {translate("user_typical_select_desc")}
          </Typography>
          <Box
            component="img"
            src="/assets/new-home/image-block-interaction.svg"
            sx={{ display: { xs: "none", md: "block" } }}
          />
        </Box>
      </Box>
    </Box>
  );
};
