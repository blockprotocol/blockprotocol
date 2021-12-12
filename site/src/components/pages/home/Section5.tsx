import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { Button } from "../../Button";

export const Section5 = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 20,
      }}
    >
      <Box sx={{ flex: 0.48 }}>
        <Container sx={{ width: "75%" }}>
          <Typography
            sx={{ color: ({ palette }) => palette.gray[80] }}
            variant="bpHeading3"
            mb={2.25}
          >
            The Block Protocol makes interoperable, block-based data possible
          </Typography>
          <Typography mb={6.125}>
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
          flex: 0.48,
          py: 6,
          backgroundColor: ({ palette }) => palette.gray[80],
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ height: 380 }}
          component="img"
          src="/assets/registry-section-illustration.svg"
        />
      </Box>
    </Box>
  );
};
