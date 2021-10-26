import withTwindApp from "@twind/next/app";
import type { AppProps } from "next/app";
import twindConfig from "../../twind.config";
import "../styles/index.css";
/** @sync ../components/Snippet.tsx */
import "../styles/prism.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withTwindApp(twindConfig, MyApp);
