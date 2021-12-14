import React from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "../../Link";
import { Spacer } from "../../Spacer";
import { Button } from "../../Button";

export const RegistrySection = () => {
  return (
    <Box
      sx={{
        mb: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mx: "auto",
        width: { xs: "90%", md: "100%" },
        textAlign: "center",
      }}
    >
      {/* @todo set a max-width for latger screens */}
      <Typography variant="bpHeading2" mb={3}>
        Tap into a global registry of reusable blocks
      </Typography>
      <Typography sx={{ mb: 6, width: { xs: "100%", md: "44%" } }}>
        As a developer, building your applications using the{" "}
        <strong>Block Protocol</strong> will give you access to a global
        registry of reusable, flexible blocks to embed inside your application.
        All connected to powerful structured data formats.
      </Typography>
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.gray[20],
          height: 480,
          width: "100%",
          mb: 6,
        }}
      />
      {/* @todo use Link instead */}
      <Box sx={{ textAlign: "center", width: { md: "40%" }, maxWidth: 540 }}>
        <Button variant="secondary">Explore all Blocks</Button>
        <Spacer height={4} />
        <Box>
          Anyone can build new blocks and submit them to the registry. If you
          can’t see the block type you want,{" "}
          <Link href="/">start building it today.</Link>
        </Box>
      </Box>
    </Box>
  );
};
