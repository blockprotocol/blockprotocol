import { FunctionComponent } from "react";

import { Availability } from "../components/pages/wordpress/availability";
import { EmailSubmittedProvider } from "../components/pages/wordpress/email-submitted-context";
import { Header } from "../components/pages/wordpress/header";
import { WhyDevelop } from "../components/pages/wordpress/why-develop";
import { WhyInstall } from "../components/pages/wordpress/why-install";

const WordPressPage: FunctionComponent = () => (
  <EmailSubmittedProvider>
    <Header />
    <WhyInstall />
    <WhyDevelop />
    <Availability />
  </EmailSubmittedProvider>
);

export default WordPressPage;
