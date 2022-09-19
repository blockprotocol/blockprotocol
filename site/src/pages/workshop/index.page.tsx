import { Container } from "@mui/material";
import fs from "fs-extra";
import { GetStaticProps, NextPage } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import path from "node:path";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "../../components/mdx/mdx-components";

type WorkshopPageProps = {
  compiledMarkdown: string;
};

export const getStaticProps: GetStaticProps<WorkshopPageProps> = async () => {
  const contentPath = path.join(
    process.cwd(),
    `src/pages/workshop/workshop.md`,
  );
  const content = (await fs.readFile(contentPath)).toString();

  const compiledMarkdown = (
    await serialize(content, {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
      },
    })
  ).compiledSource;

  return {
    props: {
      compiledMarkdown,
    },
  };
};

const WorkshopPage: NextPage<WorkshopPageProps> = ({ compiledMarkdown }) => {
  return (
    <>
      <NextSeo
        title="Block Protocol – Building a Block workshop"
        description="Learn by doing – build a Portfolio block to learn basic Block Protocol concepts"
      />
      <Container sx={{ mb: 12 }}>
        <MDXRemote
          compiledSource={compiledMarkdown}
          components={mdxComponents}
        />
      </Container>
      <style jsx global>{`
        pre {
          max-width: 100ch !important;
        }

        h1 a {
          display: none !important;
        }

        h2 a {
          display: none !important;
        }

        h3 a {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default WorkshopPage;
