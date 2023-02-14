import { Box, Container } from "@mui/material";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

import { FreeTierSection } from "../components/pages/pricing/free-tier-section";
import { Header } from "../components/pages/pricing/header";

const PricingPage: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Block Protocol – Pricing"
        description="The Block Protocol's registry of open-source blocks and types"
      />
      <Box
        sx={{
          mb: 20,
          position: "relative",
          backgroundImage: "url(/assets/hub-gradient.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "30% 50%",
          backgroundSize: "100% 100%",
        }}
      >
        <Header />
        <FreeTierSection />
      </Box>
    </>
  );
};

export default PricingPage;
