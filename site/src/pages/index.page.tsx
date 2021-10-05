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
    .map((path: string) => JSON.parse(fs.readFileSync(path, { encoding: "utf8" })));
  
  return { props: { catalog } };
};

const Home: Page = ({ catalog }) => {
  return (
    <main>
      <strong>Block</strong>protocol
      <ul>
        {catalog.map((entry) => (
          <li key={entry.name}>{entry.name}</li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
