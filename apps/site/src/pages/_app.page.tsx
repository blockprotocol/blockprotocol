import "../styles/prism.css";

import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as Sentry from "@sentry/nextjs";
import withTwindApp from "@twind/next/app";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { DefaultSeo, DefaultSeoProps } from "next-seo";
import { useCallback, useEffect, useMemo, useState } from "react";
import TagManager from "react-gtm-module";

import siteMap from "../../site-map.json";
import twindConfig from "../../twind.config.cjs";
import { PageLayout } from "../components/page-layout";
import SiteMapContext from "../context/site-map-context";
import {
  UserContext,
  UserContextValue,
  UserState,
} from "../context/user-context";
import { apiClient } from "../lib/api-client";
import { theme } from "../theme";
import { createEmotionCache } from "../util/create-emotion-cache";
import { ApiMeResponse } from "./api/me.api";

const defaultSeoConfig: DefaultSeoProps = {
  title: "Block Protocol – an open standard for data-driven blocks",
  description:
    "A standardized way to create blocks whose contents are mapped to schemas, which are both human and machine-readable.",

  twitter: {
    cardType: "summary_large_image",
    site: "@blockprotocol",
  },
  openGraph: {
    title: "Block Protocol",
    description: "An open standard for data-driven blocks",
    images: [{ url: "https://blockprotocol.org/assets/bp_og_cover.png" }],
    site_name: "Block Protocol",
    type: "website",
  },
};

const clientSideEmotionCache = createEmotionCache();

type MyAppProps = {
  emotionCache?: EmotionCache;
} & AppProps;

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) => {
  const router = useRouter();

  const [user, setUser] = useState<UserState>("loading");

  const refetchUser = useCallback(async () => {
    const { data, error } = await apiClient.get<ApiMeResponse>("me");

    if (!data) {
      Sentry.captureException("Problem fetching /api/me", {
        level: "warning",
        extra: { error },
      });
      return;
    }

    if ("guest" in data) {
      Sentry.configureScope((scope) => {
        scope.clear();
      });
      setUser(undefined);
    } else {
      Sentry.configureScope((scope) => {
        scope.setUser({ id: data.user.id });
      });
      setUser(data.user);
    }
  }, []);

  useEffect(() => {
    void refetchUser();
  }, [refetchUser]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
      TagManager.initialize({ gtmId: "GTM-5DRD4LS" });
    }

    const updatePreviousRoute = (url: string) => {
      // routeChangeStart also runs on initial load,
      // so this condition prevents the initial URL being added to sessionStorage
      if (document && !document.location.href.includes(url)) {
        sessionStorage.setItem("previousRoute", document.location.href);
      }
    };

    Router.events.on("routeChangeStart", updatePreviousRoute);

    return () => {
      Router.events.off("routeChangeStart", updatePreviousRoute);
    };
  }, []);

  useEffect(() => {
    const { asPath } = router;
    if (asPath.endsWith("#")) {
      void router.replace(asPath.slice(0, -1));
    }
  }, [router]);

  useEffect(() => {
    const { route } = router;
    if (user && user !== "loading" && !user.isSignedUp && route !== "/signup") {
      void router.push("/signup");
    }
  }, [user, router]);

  const userContextValue = useMemo<UserContextValue>(
    () => ({ user, setUser, refetch: refetchUser }),
    [refetchUser, user],
  );

  return (
    <UserContext.Provider value={userContextValue}>
      <SiteMapContext.Provider value={siteMap}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PageLayout>
              <DefaultSeo {...defaultSeoConfig} />
              <Component {...pageProps} />
            </PageLayout>
          </ThemeProvider>
        </CacheProvider>
      </SiteMapContext.Provider>
    </UserContext.Provider>
  );
};

export default withTwindApp(twindConfig, MyApp);
