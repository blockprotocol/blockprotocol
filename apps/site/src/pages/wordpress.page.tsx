import { NextSeo } from "next-seo";
import { FunctionComponent } from "react";

import { Availability } from "../components/pages/wordpress/availability";
import { EmailSubmittedProvider } from "../components/pages/wordpress/email-submitted-context";
import { Header } from "../components/pages/wordpress/header";
import { WhyDevelop } from "../components/pages/wordpress/why-develop";
import { WhyInstall } from "../components/pages/wordpress/why-install";

const WordPressPage: FunctionComponent = () => (
  <>
    <NextSeo
      title="Block Protocol WordPress Plugin"
      openGraph={{
        title: "Þ plugin for WordPress",
        description:
          "The Block Protocol is a standard for building web blocks that work across applications. Use them in WordPress, or vote for another app",
        images: [
          { url: "https://blockprotocol.org/assets/wp_bp_og_cover.png" },
        ],
        site_name: "Block Protocol",
        type: "website",
        url: "https://blockprotocol.org/wordpress",
      }}
    />
    <meta title="og:social" content="public.jpg" />

    <EmailSubmittedProvider>
      <Header />
      <WhyInstall />
      <WhyDevelop />
      <Availability />
    </EmailSubmittedProvider>
  </>
);

export default WordPressPage;
