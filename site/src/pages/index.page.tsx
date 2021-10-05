import { GetStaticProps } from "next";
import React from "react";

interface PageProps {
  catalog: Array<Record<string, string>>;
}

type Page = React.VFC<PageProps>;

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

const Home: Page = ({ catalog }) => {
  return (
    <main style={{ width: 840, margin: "2em auto" }}>
      <header><h1><strong>Block</strong>protocol</h1></header>
      <p>This site is under construction.</p>
      <ul>
        {catalog.map((entry) => (
          <li key={entry.path}>{entry.path}</li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
