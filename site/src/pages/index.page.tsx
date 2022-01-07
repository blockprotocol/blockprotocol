import { VFC } from "react";
import { GetStaticProps } from "next";
import { Header } from "../components/pages/home/Header";
import { IntroSection } from "../components/pages/home/IntroSection";
import { Section2 } from "../components/pages/home/Section2";
import { WhyBlockProtocol1Section } from "../components/pages/home/WhyBlockProtocol1Section";
import { WhyBlockProtocol2Section } from "../components/pages/home/WhyBlockProtocol2Section";
import { RegistrySection } from "../components/pages/home/RegistrySection";
import { BlockMetadata, readBlocksFromDisk } from "./api/blocks.api";

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
      <WhyBlockProtocol1Section />
      <WhyBlockProtocol2Section />
      <RegistrySection catalog={catalog} />
    </>
  );
};

export default HomePage;
