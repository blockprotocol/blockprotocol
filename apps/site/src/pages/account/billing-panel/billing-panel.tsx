import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { SubscriptionTierPrices } from "@local/internal-api-client";
import { Breadcrumbs, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Stripe from "stripe";

import { FontAwesomeIcon } from "../../../components/icons";
import { Link } from "../../../components/link";
import { internalApi } from "../../../lib/internal-api-client";
import {
  BillingOverviewPanelPage,
  billingOverviewPanelPageAsPath,
} from "./billing-overview";
import {
  BillingPageContext,
  BillingPageContextValue,
} from "./billing-page-context";
import {
  CardDetailsPanelPage,
  cardDetailsPanelPageAsPath,
} from "./card-details-panel-page";
import {
  PaymentMethodsPanelPage,
  paymentMethodsPanelPageAsPath,
} from "./payment-methods";

type BillingPanelPage = {
  href: string;
  title: string;
  PanelPage: FunctionComponent;
  childPanelPages?: BillingPanelPage[];
};

const billingPanelPageRoot: BillingPanelPage = {
  title: "Billing",
  href: billingOverviewPanelPageAsPath,
  PanelPage: BillingOverviewPanelPage,
  childPanelPages: [
    {
      title: "Payment Methods",
      href: paymentMethodsPanelPageAsPath,
      PanelPage: PaymentMethodsPanelPage,
      childPanelPages: [
        {
          title: "Card Payments",
          href: cardDetailsPanelPageAsPath,
          PanelPage: CardDetailsPanelPage,
        },
      ],
    },
  ],
};

const getBillingPanelPageByHref = (params: {
  href: string;
  panelPageTree?: BillingPanelPage;
}): BillingPanelPage | undefined => {
  const { href, panelPageTree = billingPanelPageRoot } = params;

  if (href === panelPageTree.href) {
    return panelPageTree;
  }

  for (const childPage of panelPageTree.childPanelPages ?? []) {
    const matchingChild = getBillingPanelPageByHref({
      href,
      panelPageTree: childPage,
    });

    if (matchingChild) {
      return matchingChild;
    }
  }
};

const getBreadcrumbsOfPanelPage = (params: {
  panelPage: BillingPanelPage;
  currentPanelPage?: BillingPanelPage;
}): BillingPanelPage[] => {
  const { panelPage, currentPanelPage = billingPanelPageRoot } = params;

  if (panelPage.href === currentPanelPage.href) {
    return [panelPage];
  }

  for (const childPanelPage of currentPanelPage.childPanelPages ?? []) {
    const breadcrumbs = getBreadcrumbsOfPanelPage({
      panelPage,
      currentPanelPage: childPanelPage,
    });

    if (breadcrumbs.length > 0) {
      return [currentPanelPage, ...breadcrumbs];
    }
  }

  return [];
};

export const BillingPanel: FunctionComponent = () => {
  const router = useRouter();

  const [subscriptionTierPrices, setSubscriptionTierPrices] =
    useState<SubscriptionTierPrices>();

  const fetchSubscriptionTierPrices = useCallback(async () => {
    const {
      data: { subscriptionTierPrices: fetchedSubscriptionTierPrices },
    } = await internalApi.getSubscriptionTierPrices();

    setSubscriptionTierPrices(fetchedSubscriptionTierPrices);
  }, []);

  const [subscription, setSubscription] = useState<Stripe.Subscription>();

  const fetchSubscription = useCallback(async () => {
    const {
      data: { subscription: fetchedSubscription },
    } = await internalApi
      .getSubscription()
      .catch(() => ({ data: { subscription: undefined } }));

    setSubscription(fetchedSubscription);
  }, []);

  const [paymentMethods, setPaymentMethods] =
    useState<Stripe.PaymentMethod[]>();

  const fetchPaymentMethods = useCallback(async () => {
    const {
      data: { paymentMethods: fetchedPaymentMethods },
    } = await internalApi
      .getPaymentMethods()
      .catch(() => ({ data: { paymentMethods: [] } }));

    setPaymentMethods(fetchedPaymentMethods);
  }, []);

  useEffect(() => {
    void fetchSubscriptionTierPrices();
    void fetchSubscription();
    void fetchPaymentMethods();
  }, [fetchSubscriptionTierPrices, fetchSubscription, fetchPaymentMethods]);

  const currentPanelPage = useMemo(() => {
    if (router.isReady) {
      const { asPath } = router;

      const asPathWithoutParams = asPath.split("#")[0]!.split("?")[0]!;

      const matchingBillingPanelPage = getBillingPanelPageByHref({
        href: asPathWithoutParams,
      });

      if (matchingBillingPanelPage) {
        return matchingBillingPanelPage;
      }

      void router.replace(billingPanelPageRoot.href, undefined, {
        shallow: true,
      });

      return billingPanelPageRoot;
    }
  }, [router]);

  const breadCrumbs = useMemo(() => {
    if (currentPanelPage) {
      return getBreadcrumbsOfPanelPage({ panelPage: currentPanelPage });
    }
  }, [currentPanelPage]);

  const billingPageContextValue = useMemo<BillingPageContextValue>(
    () => ({
      subscription,
      refetchSubscription: fetchSubscription,
      paymentMethods,
      subscriptionTierPrices,
      refetchPaymentMethods: fetchPaymentMethods,
    }),
    [
      subscription,
      paymentMethods,
      subscriptionTierPrices,
      fetchSubscription,
      fetchPaymentMethods,
    ],
  );

  const { PanelPage } = currentPanelPage ?? {};

  return (
    <>
      <Breadcrumbs
        separator={<FontAwesomeIcon icon={faChevronRight} />}
        aria-label="breadcrumb"
        sx={{ marginBottom: 3 }}
      >
        {breadCrumbs?.map(({ href, title }, index) => {
          const typography = (
            <Typography
              key={href}
              variant="bpHeading2"
              sx={{ fontSize: 28, fontWeight: 400 }}
            >
              {title}
            </Typography>
          );
          return index === breadCrumbs.length - 1 ? (
            typography
          ) : (
            <Link key={href} href={href}>
              {typography}
            </Link>
          );
        })}
      </Breadcrumbs>
      <BillingPageContext.Provider value={billingPageContextValue}>
        {PanelPage ? <PanelPage /> : null}
      </BillingPageContext.Provider>
    </>
  );
};
