import { GetStaticProps } from "next";
import { FunctionComponent } from "react";

import { AnyFramework } from "../components/pages/home/anyframework";
import { ComposableInterfaces } from "../components/pages/home/composable-interfaces";
import { ConfinedBlocks } from "../components/pages/home/confined-blocks";
import { FinalCTA } from "../components/pages/home/final-cta";
import { Header } from "../components/pages/home/header";
import { InteroperableBlocks } from "../components/pages/home/interoperable-blocks";
import { RegistrySection } from "../components/pages/home/registry-section";
import { WhatAreBlocks } from "../components/pages/home/what-are-blocks";
import { useUser } from "../context/user-context";
import { apiClient } from "../lib/api-client";
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
  // @todo replace with direct call to block model, when it exists
  const { data, error } = await apiClient.getBlocks();
  if (error) {
    // eslint-disable-next-line no-console -- server-side log. TODO: consider using logger
    console.error(`Error getting static props for home page: ${error.message}`);
    throw error;
  }
  const catalog = data?.results ?? [];

  return {
    props: { catalog: excludeHiddenBlocks(catalog) },
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
