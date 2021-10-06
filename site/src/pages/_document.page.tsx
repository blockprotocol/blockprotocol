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
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
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
