import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import withTwindDocument from "@twind/next/document";
import createEmotionServer from "@emotion/server/create-instance";
import twindConfig from "../../twind.config";
import { createEmotionCache } from "../util/createEmotionCache";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="A standardized way to create blocks whose contents are mapped to schemas, which are both
            human and machine-readable."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Block Protocol" />
          <meta
            name="twitter:description"
            content="An open standard for data-driven blocks"
          />
          <meta name="twitter:site" content="@blockprotocol" />
          <meta
            name="twitter:image:src"
            content="https://blockprotocol.org/assets/bp_twitter_cover.png"
          />

          <meta name="og:title" content="Block Protocol" />
          <meta
            name="og:description"
            content="An open standard for data-driven blocks"
          />
          <meta
            property="og:image"
            content="https://blockprotocol.org/assets/bp_og_cover.png"
          />
          <meta property="og:site_name" content="Block Protocol" />
          <meta property="og:type" content="website" />

          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/assets/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/assets/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/assets/favicon-16x16.png"
          />
          <link rel="manifest" href="/assets/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/assets/safari-pinned-tab.svg"
            color="#39444f"
          />
          <link rel="icon" href="/assets/favicon.ico" />
          <meta name="msapplication-TileColor" content="#39444f" />
          <meta
            name="msapplication-config"
            content="/assets/browserconfig.xml"
          />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        // eslint-disable-next-line react/function-component-definition
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};

export default withTwindDocument(twindConfig, MyDocument);
