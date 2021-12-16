import React from "react";
import { NextPage } from "next";
import { Header } from "../components/pages/home/Header";
import { IntroSection } from "../components/pages/home/IntroSection";
import { Section2 } from "../components/pages/home/Section2";
import { Spacer } from "../components/Spacer";
import { WhyBlockProtocol1Section } from "../components/pages/home/WhyBlockProtocol1Section";
import { WhyBlockProtocol2Section } from "../components/pages/home/WhyBlockProtocol2Section";
import { RegistrySection } from "../components/pages/home/RegistrySection";

export const HOME_PAGE_HEADER_HEIGHT = 750;

const HomePage: NextPage = () => {
  return (
    <>
      {/* HEADER */}
      <Header />
      {/* @todo give these better names */}
      <IntroSection />
      <Section2 />
      <WhyBlockProtocol1Section />
      <WhyBlockProtocol2Section />
      <RegistrySection />

      <Spacer height={20} />
    </>
  );
};

export default HomePage;
