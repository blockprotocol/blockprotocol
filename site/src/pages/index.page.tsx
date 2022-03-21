import { VFC } from "react";
import { GetStaticProps } from "next";
import { Header } from "../components/pages/home/Header";
import { IntroSection } from "../components/pages/home/IntroSection";
import { Section2 } from "../components/pages/home/Section2";
import { WhyBlockProtocolSection } from "../components/pages/home/WhyBlockProtocolSection";
import { RegistrySection } from "../components/pages/home/RegistrySection";
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
      <IntroSection />
      <Section2 />
      <WhyBlockProtocolSection />
      <RegistrySection catalog={catalog} />
    </>
  );
};

export default HomePage;
