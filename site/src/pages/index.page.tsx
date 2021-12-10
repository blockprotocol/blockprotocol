import React from "react";
import { NextPage } from "next";
import { Header } from "../components/pages/home/Header";
import { Section1 } from "../components/pages/home/Section1";
import { Section2 } from "../components/pages/home/Section2";

export const HOME_PAGE_HEADER_HEIGHT = 750;

const HomePage: NextPage = () => {
  return (
    <>
      {/* HEADER */}
      <Header />
      <Section1 />
      <Section2 />
    </>
  );
};

export default HomePage;
