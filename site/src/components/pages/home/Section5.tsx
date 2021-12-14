import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { Button } from "../../Button";

export const Section5 = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "unset", md: "center" },
        mb: { xs: 10, md: 20 },
      }}
    >
      <Box sx={{ flex: { xs: 1, md: 0.48 }, mb: { xs: 4, md: 0 } }}>
        <Container sx={{ width: { xs: "100%", md: "75%" } }}>
          <Typography
            sx={{ color: ({ palette }) => palette.gray[80] }}
            variant="bpHeading3"
            mb={2.25}
          >
            The Block Protocol makes interoperable, block-based data possible
          </Typography>
          <Typography mb={{ xs: 4, md: 6.125 }}>
            The <strong>Block Protocol</strong> specification provides a set of
            guidelines on how to write blocks that render, create, update, and
            delete data in a predictable way.
            <br />
            <br />
            This standisation makes it possible to easily move both blocks and
            data between applications that adhere to the protocol.
          </Typography>
          <Button variant="secondary">Read the Spec</Button>
        </Container>
      </Box>
      <Box
        sx={{
          flex: { xs: 1, md: 0.48 },
          py: { xs: 2.8, md: 6 },
          backgroundColor: ({ palette }) => palette.gray[80],
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ml: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{ height: { xs: 276, md: 380 } }}
          component="img"
          src="/assets/registry-section-illustration.svg"
        />
      </Box>
    </Box>
  );
};
