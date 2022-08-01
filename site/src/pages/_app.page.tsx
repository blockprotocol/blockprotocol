import "../styles/prism.css";

import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import withTwindApp from "@twind/next/app";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router, useRouter } from "next/router";
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

    if (error) {
      if (error.response?.status === 401) {
        setUser(undefined);
      } else {
        throw error;
      }
    } else if (data) {
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
              <Head>
                <title>
                  Block Protocol - an open standard for data-driven blocks
                </title>
                <meta itemProp="name" content="Block Protocol" />
                <meta
                  itemProp="description"
                  content="An open standard for data-driven blocks"
                />
              </Head>
              <Component {...pageProps} />
            </PageLayout>
          </ThemeProvider>
        </CacheProvider>
      </SiteMapContext.Provider>
    </UserContext.Provider>
  );
};

export default withTwindApp(twindConfig, MyApp);
