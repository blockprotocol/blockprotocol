import { FunctionComponent } from "react";
import { Header } from "../components/pages/wordpress/header";
import { WhyInstall } from "../components/pages/wordpress/why-install";
import { WhyDevelop } from "../components/pages/wordpress/why-develop";
import { Availability } from "../components/pages/wordpress/availability";

const WordPressPage: FunctionComponent = () => (
  <>
    <Header />
    <WhyInstall />
    <WhyDevelop />
    <Availability />
  </>
);

export default WordPressPage;
