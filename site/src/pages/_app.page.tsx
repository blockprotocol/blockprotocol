import withTwindApp from "@twind/next/app";
import type { AppProps } from "next/app";
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

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PageLayout>
          <Head>
            <title>Blockprotocol</title>
          </Head>
          <Component {...pageProps} />
        </PageLayout>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default withTwindApp(twindConfig, MyApp);
