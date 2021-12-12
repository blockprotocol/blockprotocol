import React from "react";
import { NextPage } from "next";
import { Header } from "../components/pages/home/Header";
import { Section1 } from "../components/pages/home/Section1";
import { Section2 } from "../components/pages/home/Section2";
import { Spacer } from "../components/Spacer";
import { Section3 } from "../components/pages/home/Section3";
import { Section4 } from "../components/pages/home/Section4";
import { Section5 } from "../components/pages/home/Section5";
import { RegistrySection } from "../components/pages/home/RegistrySection";

export const HOME_PAGE_HEADER_HEIGHT = 750;

const HomePage: NextPage = () => {
  return (
    <>
      {/* HEADER */}
      <Header />
      {/* @todo give these better names */}
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <RegistrySection />

      <Spacer height={20} />
    </>
  );
};

export default HomePage;
