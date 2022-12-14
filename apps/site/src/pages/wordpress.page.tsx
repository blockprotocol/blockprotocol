import { GetStaticProps } from "next";
import { FunctionComponent } from "react";

import { AnyFramework } from "../components/pages/home/anyframework";
import { ComposableInterfaces } from "../components/pages/home/composable-interfaces";
import { ConfinedBlocks } from "../components/pages/home/confined-blocks";
import { FinalCTA } from "../components/pages/home/final-cta";
import { Header } from "../components/pages/wordpress/header";
import { InteroperableBlocks } from "../components/pages/home/interoperable-blocks";
import { RegistrySection } from "../components/pages/home/registry-section";
import { useUser } from "../context/user-context";
import { getAllBlocks } from "../lib/api/blocks/get";
import {
  excludeHiddenBlocks,
  ExpandedBlockMetadata as BlockMetadata,
} from "../lib/blocks";
import { WhyInstall } from "../components/pages/wordpress/why-install";

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
      <WhyInstall />
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
