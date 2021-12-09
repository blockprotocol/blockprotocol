import React from "react"
import { Container, Typography, Box } from "@mui/material";
import { NextPage } from "next";
import { Header } from "../components/pages/home/Header";
import { Section1 } from "../components/pages/home/Section1";

export const HOME_PAGE_HEADER_HEIGHT = 750;

const HomePage: NextPage = () => {
  return (
    <>
    {/* HEADER */}
    <Header />
      {/* SECTION 1 */}
    <Section1 />

    </>
  );
};

export default HomePage;
