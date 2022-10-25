import { GetStaticProps } from "next";
import { FunctionComponent } from "react";

import { AnyFramework } from "../components/pages/home/anyframework.js";
import { ComposableInterfaces } from "../components/pages/home/composable-interfaces.js";
import { ConfinedBlocks } from "../components/pages/home/confined-blocks.js";
import { FinalCTA } from "../components/pages/home/final-cta.js";
import { Header } from "../components/pages/home/header.js";
import { InteroperableBlocks } from "../components/pages/home/interoperable-blocks.js";
import { RegistrySection } from "../components/pages/home/registry-section.js";
import { WhatAreBlocks } from "../components/pages/home/what-are-blocks.js";
import { useUser } from "../context/user-context.js";
import { getAllBlocks } from "../lib/api/blocks/get.js";
import {
  excludeHiddenBlocks,
  ExpandedBlockMetadata as BlockMetadata,
} from "../lib/blocks.js";

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
  const { user } = useUser();
  return (
    <>
      <Header />
      <WhatAreBlocks />
      <ConfinedBlocks />
      <InteroperableBlocks />
      <AnyFramework />
      <ComposableInterfaces />
      <RegistrySection catalog={catalog} />
      {!user && <FinalCTA />}
    </>
  );
};

export default HomePage;
