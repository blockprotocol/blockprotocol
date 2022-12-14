import { FunctionComponent } from "react";

import { Availability } from "../components/pages/wordpress/availability";
import { Header } from "../components/pages/wordpress/header";
import { WhyDevelop } from "../components/pages/wordpress/why-develop";
import { WhyInstall } from "../components/pages/wordpress/why-install";

const WordPressPage: FunctionComponent = () => (
  <>
    <Header />
    <WhyInstall />
    <WhyDevelop />
    <Availability />
  </>
);

export default WordPressPage;
