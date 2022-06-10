import { GetStaticProps } from "next";
import { VFC } from "react";

import { AnyFramework } from "../components/pages/home/anyframework";
import { ComposableInterfaces } from "../components/pages/home/composable-interfaces";
import { ConfinedBlocks } from "../components/pages/home/confined-blocks";
import { FinalCTA } from "../components/pages/home/final-cta";
import { Header } from "../components/pages/home/header";
import { InteroperableBlocks } from "../components/pages/home/interoperable-blocks";
import { RegistrySection } from "../components/pages/home/registry-section";
import { WhatAreBlocks } from "../components/pages/home/what-are-blocks";
import {
  ExpandedBlockMetadata as BlockMetadata,
  readBlocksFromDisk,
} from "../lib/blocks";

export const HOME_PAGE_HEADER_HEIGHT = 750;

interface PageProps {
  catalog: BlockMetadata[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { catalog: readBlocksFromDisk() } };
};

const HomePage: VFC<PageProps> = ({ catalog }) => {
  return (
    <>
      <Header />
      <WhatAreBlocks />
      <ConfinedBlocks />
      <InteroperableBlocks />
      <AnyFramework />
      <ComposableInterfaces />
      <RegistrySection catalog={catalog} />
      <FinalCTA />
    </>
  );
};

export default HomePage;
