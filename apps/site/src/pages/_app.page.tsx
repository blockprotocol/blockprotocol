import "../styles/nprogress.css";
import "../styles/prism.css";

import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as Sentry from "@sentry/nextjs";
import withTwindApp from "@twind/next/app";
import { LazyMotion } from "framer-motion";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { DefaultSeo, DefaultSeoProps } from "next-seo";
import { SnackbarProvider } from "notistack";
import NProgress from "nprogress";
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
import { setWordPressSettingsUrlSession } from "../lib/word-press-settings-url-session";
import { theme } from "../theme";
import { createEmotionCache } from "../util/create-emotion-cache";
import { ApiMeResponse } from "./api/me.api";
import { NextPageWithLayout } from "./shared/next-types";

const loadFramerFeatures = () =>
  import("../util/framer-features").then((res) => res.default);

NProgress.configure({ showSpinner: false });

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

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

type MyAppProps = {
  emotionCache?: EmotionCache;
} & AppPropsWithLayout;

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };

    const handleStop = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  const [user, setUser] = useState<UserState>("loading");

  const signOut = useCallback(() => {
    Sentry.configureScope((scope) => {
      scope.clear();
    });
    setWordPressSettingsUrlSession(null);
    setUser(undefined);
  }, []);

  const refetchUser = useCallback(async () => {
    const { data, error } = await apiClient.get<ApiMeResponse>("me", {
      "axios-retry": {
        onRetry: (retryCount, axiosError) => {
          Sentry.captureMessage("Retrying /api/me", {
            extra: { retryCount, axiosError },
          });
        },
        retries: 2,
        retryCondition: (axiosError) =>
          ![200, 304].includes(axiosError.response?.status ?? 0),
      },
    });

    if (!data) {
      Sentry.captureException("Problem fetching /api/me", {
        level: "warning",
        extra: { error },
      });
      return;
    }

    if ("guest" in data) {
      signOut();
    } else {
      Sentry.configureScope((scope) => {
        scope.setUser({ id: data.user.id });
      });
      setUser(data.user);
    }
  }, [signOut]);

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
        try {
          sessionStorage.setItem("previousRoute", document.location.href);
        } catch {
          // sessionStorage is not available
        }
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
    if (user && user !== "loading" && route === "/") {
      void router.push("/dashboard");
    }
  }, [user, router]);

  const userContextValue = useMemo<UserContextValue>(
    () => ({ user, setUser, refetch: refetchUser, signOut }),
    [refetchUser, user, signOut],
  );

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <PageLayout blockMetadata={pageProps.blockMetadata}>{page}</PageLayout>
    ));

  return (
    <LazyMotion features={loadFramerFeatures} strict>
      <UserContext.Provider value={userContextValue}>
        <SiteMapContext.Provider value={siteMap}>
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider maxSnack={3}>
                <DefaultSeo {...defaultSeoConfig} />
                {getLayout(<Component {...pageProps} />)}
              </SnackbarProvider>
            </ThemeProvider>
          </CacheProvider>
        </SiteMapContext.Provider>
      </UserContext.Provider>
    </LazyMotion>
  );
};

export default withTwindApp(twindConfig, MyApp);
