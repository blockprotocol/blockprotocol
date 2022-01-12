import { useCallback, useEffect, useState } from "react";
import withTwindApp from "@twind/next/app";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import "../styles/index.css";
/** @sync ../components/Snippet.tsx */
import "../styles/prism.css";

import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../components/theme";
import twindConfig from "../../twind.config";
import { PageLayout } from "../components/PageLayout";
import { createEmotionCache } from "../util/createEmotionCache";
import siteMap from "../../site-map.json";
import SiteMapContext from "../context/SiteMapContext";
import { SerializedUser } from "../lib/model/user.model";
import { apiClient } from "../lib/apiClient";
import { ApiMeResponse } from "./api/me.api";
import UserContext from "../context/UserContext";

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

  const [user, setUser] = useState<SerializedUser>();

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
    const { asPath } = router;
    if (asPath.endsWith("#")) {
      void router.replace(asPath.slice(0, -1));
    }
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser, refetch: refetchUser }}>
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
