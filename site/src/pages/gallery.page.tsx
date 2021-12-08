import { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import { tw } from "twind";
import { BlockMetadata, readBlocksFromDisk } from "./api/blocks.api";

interface PageProps {
  catalog: BlockMetadata[];
}

/**
 * used to create an index of all available blocks, the catalog
 */
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { catalog: readBlocksFromDisk() } };
};

const Gallery: React.VFC<PageProps> = ({ catalog }) => {
  return (
    <div
      className={tw`mx-auto px-4 mt-5 md:px-0 lg:max-w-4xl md:max-w-2xl`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <main className={tw`mt-20 mb-10`}>
        <h1 className={tw`text-5xl font-black`}>Block Gallery</h1>
        <p className={tw`mt-8`}>
          <span className={tw`text-blue-300 font-bold`}>
            {catalog.length} blocks:
          </span>{" "}
          see how others are using them, and test them out with dummy data
        </p>
        <ul>
          {catalog.map(({ description, displayName, icon, packagePath }) => (
            <li key={packagePath}>
              <Link href={packagePath}>
                <a className={tw`flex hover:bg-gray-100`}>
                  <div className={tw`flex w-16 items-center justify-center`}>
                    <img
                      className={tw`w-6 h-6`}
                      alt={displayName}
                      src={`/blocks/${packagePath}/${icon}`}
                    />
                  </div>
                  <div className={tw`py-4`}>
                    <p className={tw`text-sm font-bold`}>
                      {displayName}{" "}
                      <span className={tw`font-normal text-gray-500`}>
                        {packagePath}
                      </span>
                    </p>
                    <p className={tw`text-xs text-opacity-60 text-black`}>
                      {description}
                    </p>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Gallery;
