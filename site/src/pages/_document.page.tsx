import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import withTwindDocument from "@twind/next/document";

import twindConfig from "../../twind.config";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <title>Blockprotocol</title>
          <meta
            name="description"
            content="A standardized way to create blocks whose contents are mapped to schemas, which are both
            human and machine-readable."
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          ></link>
          <link rel="shortcut icon" href="/assets/logo.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default withTwindDocument(twindConfig, MyDocument);
