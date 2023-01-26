import { GetStaticProps } from "next";
import { FunctionComponent } from "react";

import { AnyFramework } from "../components/pages/home/any-framework";
import { ConfinedBlocks } from "../components/pages/home/confined-blocks";
import { Header } from "../components/pages/home/header";
import { InteroperableBlocks } from "../components/pages/home/interoperable-blocks";
import { RegistrySection } from "../components/pages/home/registry-section";
import { SupportedApplications } from "../components/pages/home/supported-applications";
import { WhatAreBlocks } from "../components/pages/home/what-are-blocks";
import { ZeroApplicationDevelopers } from "../components/pages/home/zero-application-developers";
import { getAllBlocks } from "../lib/api/blocks/get";
import {
  excludeHiddenBlocks,
  ExpandedBlockMetadata as BlockMetadata,
} from "../lib/blocks";

// @todo how does this magic number work?
export const HOME_PAGE_HEADER_HEIGHT = 750;

interface PageProps {
  catalog: BlockMetadata[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const blocks = await getAllBlocks();

  return {
    props: { catalog: excludeHiddenBlocks(blocks) },
  };
};

const HomePage: FunctionComponent<PageProps> = ({ catalog }) => {
  return (
    <>
      <Header />
      <WhatAreBlocks />
      <ConfinedBlocks />
      <InteroperableBlocks />
      <ZeroApplicationDevelopers />
      <SupportedApplications />
      <AnyFramework />
      <RegistrySection catalog={catalog} />
    </>
  );
};

export default HomePage;
