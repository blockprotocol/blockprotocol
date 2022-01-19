import { useEffect } from "react";
import withTwindApp from "@twind/next/app";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import TagManager from "react-gtm-module";
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
import SiteMapContext from "../components/context/SiteMapContext";

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

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
      TagManager.initialize({ gtmId: "GTM-5DRD4LS" });
    }
  }, []);

  useEffect(() => {
    const { asPath } = router;
    if (asPath.endsWith("#")) {
      void router.replace(asPath.slice(0, -1));
    }
  }, [router]);

  return (
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
  );
};

export default withTwindApp(twindConfig, MyApp);
