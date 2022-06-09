import { GetStaticProps } from "next";
import { VFC } from "react";

import { Header } from "../components/pages/home/header";
import { IntroSection } from "../components/pages/home/intro-section";
import { RegistrySection } from "../components/pages/home/registry-section";
import { Section2 } from "../components/pages/home/section2";
import { WhyBlockProtocolSection } from "../components/pages/home/why-block-protocol-section";
import {
  excludeHiddenBlocks,
  ExpandedBlockMetadata as BlockMetadata,
  readBlocksFromDisk,
} from "../lib/blocks";

export const HOME_PAGE_HEADER_HEIGHT = 750;

interface PageProps {
  catalog: BlockMetadata[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { catalog: excludeHiddenBlocks(readBlocksFromDisk()) } };
};

const HomePage: VFC<PageProps> = ({ catalog }) => {
  return (
    <>
      <Header />
      <IntroSection />
      <Section2 />
      <WhyBlockProtocolSection />
      <RegistrySection catalog={catalog} />
    </>
  );
};

export default HomePage;
