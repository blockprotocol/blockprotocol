import { GetStaticProps } from "next";
import React from "react";
import { tw } from "twind";
import Navbar from "../components/Navbar";

interface PageProps {
  catalog: Array<Record<string, string>>;
}

/**
 * used to create an index of all available blocks, the catalog
 */
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const fs = require("fs");
  const catalog = require("glob")
    .sync("public/blocks/**/metadata.json")
    .map((path: string) => ({
      // @todo should really be the .name property
      path: path.match(/(@.*?)\.json$/)?.pop(),
      ...JSON.parse(fs.readFileSync(path, { encoding: "utf8" })),
    }));

  return { props: { catalog } };
};

const Gallery: React.VFC<PageProps> = ({ catalog }) => {
  return (
    <div
      className={tw`mx-auto px-4 mt-5 md:px-0 lg:max-w-4xl md:max-w-2xl`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar className={tw`mt-14`} />

      <main className={tw`mt-20 mb-10`}>
        <h1 className={tw`text-5xl font-black`}>Block Gallery</h1>
        <p className={tw`mt-8`}>
          <span className={tw`text-blue-300 font-bold`}>{catalog.length} blocks:</span> see how
          others are using them, and test them out with dummy data
        </p>
        <ul>
          {catalog.map(({ name, icon, description }) => (
            <li key={name} className={tw`flex border border-gray-100 bg-gray-50 hover:bg-gray-100`}>
              <div className={tw`flex w-16 items-center justify-center`}>
                <img className={tw`w-6 h-6`} alt={name} src={icon} />
              </div>
              <div className={tw`py-3`}>
                <p className={tw`text-sm font-bold`}>{name}</p>
                <p className={tw`text-xs text-opacity-60 text-black`}>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Gallery;
