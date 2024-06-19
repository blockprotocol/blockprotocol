import { SubscriptionTierPrices } from "@local/internal-api-client";
import { Box } from "@mui/material";
import { NextPage } from "next";
import NextErrorComponent from "next/error";
import { NextSeo } from "next-seo";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FaqSection } from "../components/pages/pricing/faq-section";
import { FreeTierSection } from "../components/pages/pricing/free-tier-section";
import { Header } from "../components/pages/pricing/header";
import { PaidAddonsSection } from "../components/pages/pricing/paid-addons-section";
import { PaidTiersSection } from "../components/pages/pricing/paid-tiers-section";
import { useUser } from "../context/user-context";
import { isBillingFeatureFlagEnabled } from "../lib/config";
import { internalApi } from "../lib/internal-api-client";

const PricingPage: NextPage = () => {
  const { user } = useUser();
  const signedIn = !(user !== "loading" && !user?.id);

  const [subscriptionTierPrices, setSubscriptionTierPrices] =
    useState<SubscriptionTierPrices>();

  const currentSubscriptionTier = useMemo(
    () =>
      user && user !== "loading" ? user.stripeSubscriptionTier : undefined,
    [user],
  );

  const fetchSubscriptionTierPrices = useCallback(async () => {
    const {
      data: { subscriptionTierPrices: fetchedSubscriptionTierPrices },
    } = await internalApi.getSubscriptionTierPrices();

    setSubscriptionTierPrices(fetchedSubscriptionTierPrices);
  }, []);

  useEffect(() => {
    if (isBillingFeatureFlagEnabled) {
      void fetchSubscriptionTierPrices();
    }
  }, [fetchSubscriptionTierPrices]);

  if (!isBillingFeatureFlagEnabled) {
    return <NextErrorComponent statusCode={404} />;
  }

  return (
    <>
      <NextSeo
        title="Block Protocol – Pricing"
        description="The Block Protocol's registry of open-source blocks and types"
      />
      <Box>
        <Box
          sx={{
            background:
              "radial-gradient(116.02% 95.04% at 50% 100.79%, #F3F0F9 0%, #FFFFFF 70.54%)",
            borderBottom: ({ palette }) => `1px solid ${palette.gray[20]}`,
          }}
        >
          <Header />
          <FreeTierSection signedIn={signedIn} />
          <PaidTiersSection
            signedIn={signedIn}
            currentSubscriptionTier={currentSubscriptionTier}
            subscriptionTierPrices={subscriptionTierPrices}
          />
        </Box>
        <PaidAddonsSection />
        <FaqSection />
      </Box>
    </>
  );
};

export default PricingPage;
