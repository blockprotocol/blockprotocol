import { NextSeo } from "next-seo";
import { FunctionComponent } from "react";

import { Details } from "../components/pages/wordpress/details";
import { EmailSubmittedProvider } from "../components/pages/wordpress/email-submitted-context";
import { Header } from "../components/pages/wordpress/header";
import { InstallPlugin } from "../components/pages/wordpress/install-plugin";

const WordPressPage: FunctionComponent = () => (
  <>
    <NextSeo
      title="The Block Protocol for WordPress Plugin"
      openGraph={{
        title: "The Block Protocol for WordPress",
        description:
          "The Block Protocol is a standard for building web blocks that work across applications. Use them in WordPress, or vote for another app",
        images: [
          { url: "https://blockprotocol.org/assets/wp_bp_og_cover.jpg" },
        ],
        url: "https://blockprotocol.org/wordpress",
      }}
    />

    <EmailSubmittedProvider>
      <Header />
      <Details />
      <InstallPlugin />
    </EmailSubmittedProvider>
  </>
);

export default WordPressPage;
