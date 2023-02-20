import { SubscriptionTierPrices } from "@local/internal-api-client";
import { Box } from "@mui/material";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FreeTierSection } from "../components/pages/pricing/free-tier-section";
import { Header } from "../components/pages/pricing/header";
import { PaidAddonsSection } from "../components/pages/pricing/paid-addons-section";
import { PaidTiersSection } from "../components/pages/pricing/paid-tiers-section";
import { useUser } from "../context/user-context";
import { internalApi } from "../lib/internal-api-client";

const PricingPage: NextPage = () => {
  const { user } = useUser();
  const signedIn = !(user !== "loading" && !user?.id);

  const [subscriptionTierPrices, setSubscriptionTierPrices] =
    useState<SubscriptionTierPrices>();

  const currentSubscriptionTier = useMemo(() => {
    if (user && user !== "loading") {
      return user.stripeSubscriptionStatus === "active"
        ? user.stripeSubscriptionTier ?? "free"
        : "free";
    }
  }, [user]);

  const fetchSubscriptionTierPrices = useCallback(async () => {
    const {
      data: { subscriptionTierPrices: fetchedSubscriptionTierPrices },
    } = await internalApi.getSubscriptionTierPrices();

    setSubscriptionTierPrices(fetchedSubscriptionTierPrices);
  }, []);

  useEffect(() => {
    void fetchSubscriptionTierPrices();
  }, [fetchSubscriptionTierPrices]);

  return (
    <>
      <NextSeo
        title="Block Protocol – Pricing"
        description="The Block Protocol's registry of open-source blocks and types"
      />
      <Box
        sx={{
          mb: 60,
          position: "relative",
          backgroundImage: "url(/assets/hub-gradient.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "30% 50%",
          backgroundSize: "100% 100%",
        }}
      >
        <Header />
        <FreeTierSection signedIn={signedIn} />
        <PaidTiersSection
          signedIn={signedIn}
          currentSubscriptionTier={currentSubscriptionTier}
          subscriptionTierPrices={subscriptionTierPrices}
        />
        <PaidAddonsSection />
      </Box>
    </>
  );
};

export default PricingPage;
