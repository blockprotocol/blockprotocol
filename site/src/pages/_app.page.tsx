import type { AppProps } from "next/app";
import withTwindApp from "@twind/next/app";

import "../styles/index.css";
import twindConfig from "../../twind.config";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withTwindApp(twindConfig, MyApp);
