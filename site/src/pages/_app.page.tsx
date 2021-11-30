import withTwindApp from "@twind/next/app";
import type { AppProps } from "next/app";
import twindConfig from "../../twind.config";
import "../styles/index.css";
/** @sync ../components/Snippet.tsx */
import "../styles/prism.css";

import createCache from "@emotion/cache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import React from "react";
import { theme } from "../components/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";

function createEmotionCache() {
  return createCache({ key: "css" });
}

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
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default withTwindApp(twindConfig, MyApp);
