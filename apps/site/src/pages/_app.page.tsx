import "../styles/nprogress.css";
import "../styles/prism.css";

import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import withTwindApp from "@twind/next/app";
import { LazyMotion } from "framer-motion";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { DefaultSeo, DefaultSeoProps } from "next-seo";
import { SnackbarProvider } from "notistack";
import NProgress from "nprogress";
import { useEffect } from "react";
import TagManager from "react-gtm-module";

import siteMap from "../../site-map.json";
import twindConfig from "../../twind.config.cjs";
import { PageLayout } from "../components/page-layout";
import SiteMapContext from "../context/site-map-context";
import { isProduction } from "../lib/config";
import { SiteMap } from "../lib/sitemap";
import { theme } from "../theme";
import { createEmotionCache } from "../util/create-emotion-cache";
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

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
      TagManager.initialize({ gtmId: "GTM-5DRD4LS" });
    }

    const updatePreviousRoute = (url: string) => {
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

  const getLayout =
    Component.getLayout ??
    ((page) => (
      <PageLayout blockMetadata={pageProps.blockMetadata}>{page}</PageLayout>
    ));

  return (
    <LazyMotion features={loadFramerFeatures} strict>
      <SiteMapContext.Provider value={siteMap as unknown as SiteMap}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <DefaultSeo
                {...defaultSeoConfig}
                dangerouslySetAllPagesToNoIndex={!isProduction}
                dangerouslySetAllPagesToNoFollow={!isProduction}
              />
              {getLayout(<Component {...pageProps} />)}
            </SnackbarProvider>
          </ThemeProvider>
        </CacheProvider>
      </SiteMapContext.Provider>
    </LazyMotion>
  );
};

export default withTwindApp(twindConfig, MyApp);
